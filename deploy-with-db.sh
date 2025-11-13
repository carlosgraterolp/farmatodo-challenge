#!/bin/bash

# Deployment script for Cloud Run with PostgreSQL
# Usage: DB_PASS="your-password" ./deploy-with-db.sh

set -e

# Check if DB_PASS is set
if [ -z "$DB_PASS" ]; then
    echo "Error: DB_PASS environment variable is not set"
    echo "Usage: DB_PASS=\"your-password\" ./deploy-with-db.sh"
    echo "Or: export DB_PASS=\"your-password\" && ./deploy-with-db.sh"
    exit 1
fi

# Configuration
PROJECT_ID="farmatodo-challenge"
REGION="us-central1"
SERVICE_NAME="farmatodo-backend"
IMAGE="us-central1-docker.pkg.dev/$PROJECT_ID/backend-repo/$SERVICE_NAME:latest"
CLOUD_SQL_INSTANCE="$PROJECT_ID:$REGION:farmatodo-postgres"

echo "====================================="
echo "Deploying to Cloud Run with PostgreSQL"
echo "====================================="
echo "Project: $PROJECT_ID"
echo "Region: $REGION"
echo "Service: $SERVICE_NAME"
echo "Cloud SQL: $CLOUD_SQL_INSTANCE"
echo "====================================="

# Deploy to Cloud Run
gcloud run deploy $SERVICE_NAME \
  --image $IMAGE \
  --region $REGION \
  --platform managed \
  --allow-unauthenticated \
  --port 8080 \
  --memory 1Gi \
  --cpu 1 \
  --min-instances 0 \
  --max-instances 10 \
  --timeout 300 \
  --cpu-boost \
  --add-cloudsql-instances $CLOUD_SQL_INSTANCE \
  --set-env-vars "\
SPRING_PROFILES_ACTIVE=gcp,\
CLOUD_SQL_INSTANCE=$CLOUD_SQL_INSTANCE,\
DB_NAME=farmatodo,\
DB_USER=farmatodo_user,\
DB_PASS=$DB_PASS,\
TOKENIZATION_REJECTION_PERCENTAGE=0,\
PAYMENT_REJECTION_PERCENTAGE=35,\
PAYMENT_MAX_RETRIES=3,\
PRODUCT_MIN_STOCK=0,\
APP_API_KEY=SECRET123,\
ENCRYPTION_SECRET=1234567890123456"

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
echo "  curl -H \"X-API-Key: SECRET123\" $SERVICE_URL/products"
echo "====================================="
