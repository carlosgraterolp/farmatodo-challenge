#!/bin/bash

# Full-stack deployment script for GCP Cloud Run
# This deploys both backend and frontend services
# Usage: ./deploy-full-stack.sh [PROJECT_ID] [REGION]

set -e

# Configuration
PROJECT_ID=${1:-$(gcloud config get-value project)}
REGION=${2:-us-central1}
BACKEND_SERVICE_NAME="farmatodo-backend"
FRONTEND_SERVICE_NAME="farmatodo-frontend"
BACKEND_IMAGE="us-central1-docker.pkg.dev/$PROJECT_ID/backend-repo/$BACKEND_SERVICE_NAME"
FRONTEND_IMAGE="us-central1-docker.pkg.dev/$PROJECT_ID/frontend-repo/$FRONTEND_SERVICE_NAME"

echo "========================================="
echo "GCP Full-Stack Deployment Script"
echo "========================================="
echo "Project ID: $PROJECT_ID"
echo "Region: $REGION"
echo "Backend Service: $BACKEND_SERVICE_NAME"
echo "Frontend Service: $FRONTEND_SERVICE_NAME"
echo "========================================="

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo "Error: gcloud CLI is not installed"
    echo "Install it from: https://cloud.google.com/sdk/docs/install"
    exit 1
fi

# Set project
echo "Setting project..."
gcloud config set project $PROJECT_ID

# Enable required APIs
echo "Enabling required APIs..."
gcloud services enable \
  cloudbuild.googleapis.com \
  run.googleapis.com \
  artifactregistry.googleapis.com

# Create Artifact Registry repositories if they don't exist
echo "Ensuring Artifact Registry repositories exist..."
gcloud artifacts repositories create backend-repo \
  --repository-format=docker \
  --location=$REGION \
  --description="Backend Docker repository" \
  2>/dev/null || echo "Backend repository already exists"

gcloud artifacts repositories create frontend-repo \
  --repository-format=docker \
  --location=$REGION \
  --description="Frontend Docker repository" \
  2>/dev/null || echo "Frontend repository already exists"

# Build with Cloud Build
echo ""
echo "Building Docker images with Cloud Build..."
gcloud builds submit --config cloudbuild.yaml

# Deploy Backend to Cloud Run
echo ""
echo "========================================="
echo "Deploying Backend to Cloud Run..."
echo "========================================="
gcloud run deploy $BACKEND_SERVICE_NAME \
  --image $BACKEND_IMAGE:latest \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  --port 8080 \
  --memory 512Mi \
  --cpu 1 \
  --min-instances 0 \
  --max-instances 10 \
  --timeout 300 \
  --set-env-vars "SPRING_PROFILES_ACTIVE=gcp" \
  --set-env-vars "APP_API_KEY=SECRET123" \
  --set-env-vars "ENCRYPTION_SECRET=1234567890123456" \
  --set-env-vars "DB_NAME=farmatodo" \
  --set-env-vars "DB_USER=farmatodo_user" \
  --set-env-vars "DB_PASS=$DB_PASS" \
  --set-env-vars "CLOUD_SQL_INSTANCE=farmatodo-challenge:us-central1:farmatodo-postgres" \
  --set-env-vars "TOKENIZATION_REJECTION_PERCENTAGE=0" \
  --set-env-vars "PAYMENT_REJECTION_PERCENTAGE=35" \
  --set-env-vars "PAYMENT_MAX_RETRIES=3" \
  --set-env-vars "PRODUCT_MIN_STOCK=0" \
  --add-cloudsql-instances "farmatodo-challenge:us-central1:farmatodo-postgres"

# Get backend URL
BACKEND_URL=$(gcloud run services describe $BACKEND_SERVICE_NAME --region $REGION --format 'value(status.url)')
echo "Backend deployed at: $BACKEND_URL"

# Deploy Frontend to Cloud Run
echo ""
echo "========================================="
echo "Deploying Frontend to Cloud Run..."
echo "========================================="
gcloud run deploy $FRONTEND_SERVICE_NAME \
  --image $FRONTEND_IMAGE:latest \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  --port 3000 \
  --memory 512Mi \
  --cpu 1 \
  --min-instances 0 \
  --max-instances 10 \
  --timeout 300 \
  --set-env-vars "NODE_ENV=production" \
  --set-env-vars "NEXT_PUBLIC_API_BASE_URL=$BACKEND_URL" \
  --set-env-vars "NEXT_PUBLIC_API_KEY=SECRET123"

# Get frontend URL
FRONTEND_URL=$(gcloud run services describe $FRONTEND_SERVICE_NAME --region $REGION --format 'value(status.url)')

# Display summary
echo ""
echo "========================================="
echo "Deployment Successful!"
echo "========================================="
echo ""
echo "Backend Service:"
echo "  URL: $BACKEND_URL"
echo "  Health: $BACKEND_URL/actuator/health"
echo "  H2 Console: Disabled in production"
echo ""
echo "Frontend Service:"
echo "  URL: $FRONTEND_URL"
echo ""
echo "========================================="
echo "Testing Commands:"
echo "========================================="
echo "# Test backend health"
echo "curl $BACKEND_URL/actuator/health"
echo ""
echo "# Test frontend"
echo "curl $FRONTEND_URL"
echo ""
echo "========================================="
echo "View Logs:"
echo "========================================="
echo "# Backend logs"
echo "gcloud run services logs read $BACKEND_SERVICE_NAME --region $REGION --limit 50"
echo ""
echo "# Frontend logs"
echo "gcloud run services logs read $FRONTEND_SERVICE_NAME --region $REGION --limit 50"
echo ""
echo "========================================="
echo "Update Environment Variables:"
echo "========================================="
echo "# Update backend"
echo "gcloud run services update $BACKEND_SERVICE_NAME \\"
echo "  --set-env-vars APP_API_KEY=your-new-key \\"
echo "  --region $REGION"
echo ""
echo "# Update frontend"
echo "gcloud run services update $FRONTEND_SERVICE_NAME \\"
echo "  --set-env-vars NEXT_PUBLIC_API_BASE_URL=$BACKEND_URL \\"
echo "  --region $REGION"
echo "========================================="
