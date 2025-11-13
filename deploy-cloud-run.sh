#!/bin/bash

# Quick deployment script for GCP Cloud Run
# Usage: ./deploy-cloud-run.sh [PROJECT_ID] [REGION]

set -e

# Configuration
PROJECT_ID=${1:-$(gcloud config get-value project)}
REGION=${2:-us-central1}
SERVICE_NAME="farmatodo-backend"
IMAGE_NAME="gcr.io/$PROJECT_ID/$SERVICE_NAME"

echo "====================================="
echo "GCP Cloud Run Deployment Script"
echo "====================================="
echo "Project ID: $PROJECT_ID"
echo "Region: $REGION"
echo "Service: $SERVICE_NAME"
echo "====================================="

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
  containerregistry.googleapis.com

# Build with Cloud Build
echo "Building Docker image with Cloud Build..."
gcloud builds submit --config cloudbuild.yaml

# Deploy to Cloud Run
echo "Deploying to Cloud Run..."
gcloud run deploy $SERVICE_NAME \
  --image $IMAGE_NAME:latest \
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
  --set-env-vars "TOKENIZATION_REJECTION_PERCENTAGE=0" \
  --set-env-vars "PAYMENT_REJECTION_PERCENTAGE=35" \
  --set-env-vars "PAYMENT_MAX_RETRIES=3" \
  --set-env-vars "PRODUCT_MIN_STOCK=0" \
  --set-env-vars "SPRING_H2_CONSOLE_ENABLED=false"

# Get the service URL
echo ""
echo "====================================="
echo "Deployment successful!"
echo "====================================="
SERVICE_URL=$(gcloud run services describe $SERVICE_NAME --region $REGION --format 'value(status.url)')
echo "Service URL: $SERVICE_URL"
echo ""
echo "Test the service:"
echo "  curl $SERVICE_URL/actuator/health"
echo ""
echo "View logs:"
echo "  gcloud run services logs read $SERVICE_NAME --region $REGION"
echo ""
echo "IMPORTANT: Update secrets using:"
echo "  gcloud run services update $SERVICE_NAME \\"
echo "    --set-env-vars APP_API_KEY=your-api-key \\"
echo "    --set-env-vars ENCRYPTION_SECRET=your-16-char-secret \\"
echo "    --region $REGION"
echo "====================================="
