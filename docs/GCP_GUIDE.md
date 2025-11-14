# GCP Deployment Guide

Complete guide for deploying the Farmatodo Challenge application to Google Cloud Platform.

## Table of Contents

- [Quick Start](#quick-start)
- [Prerequisites & Setup](#prerequisites--setup)
- [Deployment Options](#deployment-options)
  - [Cloud Run (Recommended)](#cloud-run-recommended)
  - [Google Kubernetes Engine (GKE)](#google-kubernetes-engine-gke)
  - [App Engine Flexible](#app-engine-flexible)
- [Database Setup (Cloud SQL)](#database-setup-cloud-sql)
- [Secrets Management](#secrets-management)
- [CI/CD with Cloud Build](#cicd-with-cloud-build)
- [Monitoring and Logging](#monitoring-and-logging)
- [Cost Optimization](#cost-optimization)
- [Troubleshooting](#troubleshooting)
- [Quick Reference](#quick-reference)

---

## Quick Start

Get your backend running on GCP in minutes.

### One-Command Deployment

```bash
./deploy-cloud-run.sh YOUR_PROJECT_ID us-central1
```

This script will:
1. Enable required GCP APIs
2. Build the Docker image using Cloud Build
3. Deploy to Cloud Run
4. Return your service URL

### Manual Quick Deploy

```bash
# 1. Set project and region
export PROJECT_ID=$(gcloud config get-value project)
export REGION=us-central1

# 2. Build and push image
gcloud builds submit --config cloudbuild.yaml

# 3. Deploy to Cloud Run
gcloud run deploy farmatodo-backend \
  --image us-central1-docker.pkg.dev/$PROJECT_ID/backend-repo/farmatodo-backend:latest \
  --region $REGION \
  --allow-unauthenticated \
  --port 8080

# 4. Get service URL
gcloud run services describe farmatodo-backend \
  --region $REGION \
  --format 'value(status.url)'
```

---

## Prerequisites & Setup

### 1. Install Google Cloud SDK

```bash
# macOS
brew install google-cloud-sdk

# Linux/Windows
curl https://sdk.cloud.google.com | bash
exec -l $SHELL

# Verify installation
gcloud --version
```

### 2. Authenticate and Configure

```bash
# Login to your Google account
gcloud auth login

# Set your project ID
gcloud config set project YOUR_PROJECT_ID

# Set default region
gcloud config set run/region us-central1

# Set environment variables
export PROJECT_ID=$(gcloud config get-value project)
export REGION=us-central1
```

### 3. Enable Required APIs

```bash
gcloud services enable \
  cloudbuild.googleapis.com \
  run.googleapis.com \
  sqladmin.googleapis.com \
  secretmanager.googleapis.com \
  artifactregistry.googleapis.com \
  containerregistry.googleapis.com
```

### 4. Create Artifact Registry Repositories

```bash
# Backend repository
gcloud artifacts repositories create backend-repo \
  --repository-format=docker \
  --location=$REGION \
  --description="Backend Docker images"

# Frontend repository
gcloud artifacts repositories create frontend-repo \
  --repository-format=docker \
  --location=$REGION \
  --description="Frontend Docker images"

# Configure Docker authentication
gcloud auth configure-docker $REGION-docker.pkg.dev
```

### 5. Verify IAM Permissions

Your account needs these roles:
- Cloud Run Admin
- Artifact Registry Admin
- Cloud Build Editor
- Secret Manager Admin (if using secrets)

```bash
# Check your permissions
gcloud projects get-iam-policy $PROJECT_ID \
  --flatten="bindings[].members" \
  --filter="bindings.members:user:YOUR_EMAIL"

# Add roles if needed (requires project owner)
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="user:YOUR_EMAIL" \
  --role="roles/run.admin"
```

### 6. Update cloudbuild.yaml

Before deploying, update the image paths in `cloudbuild.yaml` with your project ID:

```yaml
# Replace 'farmatodo-challenge' with your project ID
- 'us-central1-docker.pkg.dev/YOUR_PROJECT_ID/backend-repo/farmatodo-backend:latest'
- 'us-central1-docker.pkg.dev/YOUR_PROJECT_ID/frontend-repo/farmatodo-frontend:latest'
```

---

## Deployment Options

### Cloud Run (Recommended)

Cloud Run is the simplest and most cost-effective option for containerized applications.

#### Build and Push Docker Image

**Option A: Build with Cloud Build (recommended)**
```bash
gcloud builds submit --config cloudbuild.yaml
```

**Option B: Build locally and push**
```bash
cd backend
docker build -t us-central1-docker.pkg.dev/$PROJECT_ID/backend-repo/farmatodo-backend:latest .
docker push us-central1-docker.pkg.dev/$PROJECT_ID/backend-repo/farmatodo-backend:latest
```

#### Deploy to Cloud Run

```bash
gcloud run deploy farmatodo-backend \
  --image us-central1-docker.pkg.dev/$PROJECT_ID/backend-repo/farmatodo-backend:latest \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  --port 8080 \
  --memory 512Mi \
  --cpu 1 \
  --min-instances 0 \
  --max-instances 10 \
  --set-env-vars "SPRING_PROFILES_ACTIVE=gcp" \
  --set-env-vars "APP_API_KEY=your-api-key" \
  --set-env-vars "ENCRYPTION_SECRET=1234567890123456" \
  --set-env-vars "TOKENIZATION_REJECTION_PERCENTAGE=0" \
  --set-env-vars "PAYMENT_REJECTION_PERCENTAGE=35" \
  --set-env-vars "PAYMENT_MAX_RETRIES=3" \
  --set-env-vars "PRODUCT_MIN_STOCK=0" \
  --set-env-vars "SPRING_H2_CONSOLE_ENABLED=false"
```

#### Get Service URL

```bash
gcloud run services describe farmatodo-backend --region $REGION --format 'value(status.url)'
```

### Google Kubernetes Engine (GKE)

For more control and advanced deployment scenarios.

#### Create GKE Cluster

```bash
gcloud container clusters create farmatodo-cluster \
  --zone $REGION-a \
  --num-nodes 2 \
  --machine-type n1-standard-2 \
  --enable-autoscaling \
  --min-nodes 1 \
  --max-nodes 5
```

#### Get Cluster Credentials

```bash
gcloud container clusters get-credentials farmatodo-cluster --zone $REGION-a
```

#### Deploy with Kubernetes

Use the existing `k8s/deployment.yaml` file:

```bash
# Create secrets
kubectl create secret generic app-secrets \
  --from-literal=api-key='your-api-key' \
  --from-literal=encryption-secret='1234567890123456'

kubectl create secret generic db-secrets \
  --from-literal=username='farmatodo-user' \
  --from-literal=password='your-db-password'

# Deploy
kubectl apply -f k8s/deployment.yaml
kubectl get services
```

### App Engine Flexible

#### Deploy

```bash
# From project root (app.yaml must be at root)
gcloud app deploy app.yaml --project $PROJECT_ID

# View the application
gcloud app browse
```

---

## Database Setup (Cloud SQL)

### Create PostgreSQL Instance

```bash
gcloud sql instances create farmatodo-db \
  --database-version=POSTGRES_14 \
  --tier=db-f1-micro \
  --region=$REGION \
  --root-password=YOUR_ROOT_PASSWORD
```

### Create Database and User

```bash
# Create database
gcloud sql databases create farmatodo --instance=farmatodo-db

# Create user
gcloud sql users create farmatodo-user \
  --instance=farmatodo-db \
  --password=YOUR_USER_PASSWORD
```

### Connect Cloud Run to Cloud SQL

```bash
gcloud run services update farmatodo-backend \
  --add-cloudsql-instances $PROJECT_ID:$REGION:farmatodo-db \
  --set-env-vars "DB_URL=jdbc:postgresql://localhost:5432/farmatodo" \
  --set-env-vars "DB_USER=farmatodo-user" \
  --set-secrets "DB_PASS=db-password:latest" \
  --region $REGION
```

### Local Testing with Cloud SQL Proxy

```bash
# Install Cloud SQL Proxy
curl -o cloud_sql_proxy https://dl.google.com/cloudsql/cloud_sql_proxy.darwin.amd64
chmod +x cloud_sql_proxy

# Run proxy
./cloud_sql_proxy -instances=$PROJECT_ID:$REGION:farmatodo-db=tcp:5432
```

---

## Secrets Management

Use Google Secret Manager for sensitive data.

### Create Secrets

```bash
# API key
echo -n "your-secret-api-key" | gcloud secrets create APP_API_KEY --data-file=-

# Encryption secret (must be 16 characters)
echo -n "1234567890123456" | gcloud secrets create ENCRYPTION_SECRET --data-file=-

# Database credentials
echo -n "jdbc:postgresql://localhost:5432/farmatodo" | gcloud secrets create DB_URL --data-file=-
echo -n "farmatodo-user" | gcloud secrets create DB_USER --data-file=-
echo -n "your-db-password" | gcloud secrets create DB_PASS --data-file=-
```

### Grant Access to Secrets

```bash
PROJECT_NUMBER=$(gcloud projects describe $PROJECT_ID --format="value(projectNumber)")

gcloud secrets add-iam-policy-binding APP_API_KEY \
  --member="serviceAccount:${PROJECT_NUMBER}-compute@developer.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"

# Repeat for other secrets
```

### Use Secrets in Cloud Run

```bash
gcloud run services update farmatodo-backend \
  --set-secrets APP_API_KEY=APP_API_KEY:latest,ENCRYPTION_SECRET=ENCRYPTION_SECRET:latest,DB_URL=DB_URL:latest,DB_USER=DB_USER:latest,DB_PASS=DB_PASS:latest \
  --region $REGION
```

---

## CI/CD with Cloud Build

### Setup Build Triggers

1. **Connect Repository**:
   ```bash
   gcloud source repos create farmatodo-challenge
   git remote add google https://source.developers.google.com/p/$PROJECT_ID/r/farmatodo-challenge
   git push google main
   ```

2. **Create Build Trigger**:
   ```bash
   gcloud builds triggers create cloud-source-repositories \
     --repo=farmatodo-challenge \
     --branch-pattern="^main$" \
     --build-config=cloudbuild.yaml
   ```

3. **Enable Auto-Deploy**: Uncomment the Cloud Run deployment step in `cloudbuild.yaml`

### Manual Build

```bash
gcloud builds submit --config cloudbuild.yaml
```

---

## Monitoring and Logging

### View Logs

**Cloud Run:**
```bash
# View logs
gcloud run services logs read farmatodo-backend --region $REGION

# Tail logs (follow)
gcloud run services logs tail farmatodo-backend --region $REGION
```

**GKE:**
```bash
kubectl logs -l app=farmatodo-backend -f
```

### Cloud Monitoring

1. Navigate to **Cloud Console > Monitoring**
2. Create dashboards for:
   - Request latency
   - Error rates
   - Instance count
   - Database connections

### Set Up Alerts

```bash
# Example: Alert on high error rate
gcloud alpha monitoring policies create \
  --notification-channels=CHANNEL_ID \
  --display-name="High Error Rate" \
  --condition-display-name="Error rate > 5%" \
  --condition-threshold-value=0.05
```

---

## Cost Optimization

### Cloud Run
- Use `--min-instances 0` for dev/staging
- Use `--min-instances 1` for production (faster response)
- Set appropriate `--memory` and `--cpu` limits

### Cloud SQL
- Use `db-f1-micro` for development (~$7-10/month)
- Use `db-n1-standard-1` or higher for production
- Enable automatic backups
- Use read replicas for high traffic

### Estimated Costs

**Cloud Run (Development):**
- Free tier: 2M requests/month, 360k GB-seconds/month
- After free tier: ~$0.40 per million requests
- Typical dev usage: **$0-5/month**

**Cloud SQL (db-f1-micro):**
- ~$7-10/month for small PostgreSQL instance

**Cloud Build:**
- Free tier: 120 build-minutes/day
- After free tier: $0.003 per build-minute

### Best Practices
- Use Cloud CDN for static content
- Enable request/response compression
- Use connection pooling for database
- Implement caching (Redis/Memorystore)
- Set budget alerts

### Set Budget Alerts

```bash
gcloud billing budgets create \
  --billing-account=YOUR_BILLING_ACCOUNT_ID \
  --display-name="Cloud Run Budget" \
  --budget-amount=50USD \
  --threshold-rule=percent=50 \
  --threshold-rule=percent=90 \
  --threshold-rule=percent=100
```

---

## Troubleshooting

### Check Service Status

```bash
# Cloud Run
gcloud run services describe farmatodo-backend --region $REGION

# GKE
kubectl get pods
kubectl describe pod POD_NAME
```

### View Recent Logs

```bash
# Cloud Run
gcloud run services logs tail farmatodo-backend --region $REGION

# GKE
kubectl logs -l app=farmatodo-backend --tail=100
```

### Common Issues

1. **Permission Denied**
   ```bash
   # Re-authenticate
   gcloud auth login
   gcloud auth application-default login
   
   # Grant yourself Cloud Run Admin role
   gcloud projects add-iam-policy-binding $PROJECT_ID \
     --member="user:your-email@example.com" \
     --role="roles/run.admin"
   ```

2. **Build Failed**
   ```bash
   # Check Cloud Build logs
   gcloud builds list --limit 5
   gcloud builds log BUILD_ID
   ```

3. **Service Unavailable**
   ```bash
   # Check if all environment variables are set correctly
   gcloud run services describe farmatodo-backend --region $REGION
   ```

4. **Repository Not Found**
   ```bash
   # List repositories
   gcloud artifacts repositories list --location=$REGION
   
   # Create if missing
   gcloud artifacts repositories create REPO_NAME \
     --repository-format=docker \
     --location=$REGION
   ```

5. **Database Connection Issues**
   ```bash
   # Test database connection (with Cloud SQL Proxy running)
   psql "host=localhost port=5432 dbname=farmatodo user=farmatodo-user"
   ```

---

## Quick Reference

### Common Operations

**Update Environment Variables**
```bash
gcloud run services update farmatodo-backend \
  --set-env-vars "PAYMENT_REJECTION_PERCENTAGE=20" \
  --region $REGION
```

**Scale the Service**
```bash
gcloud run services update farmatodo-backend \
  --min-instances 1 \
  --max-instances 20 \
  --region $REGION
```

**Redeploy Latest Image**
```bash
gcloud builds submit --config cloudbuild.yaml
gcloud run services update farmatodo-backend \
  --image us-central1-docker.pkg.dev/$PROJECT_ID/backend-repo/farmatodo-backend:latest \
  --region $REGION
```

**Rollback to Previous Version**
```bash
# List revisions
gcloud run revisions list --service farmatodo-backend --region $REGION

# Route traffic to specific revision
gcloud run services update-traffic farmatodo-backend \
  --to-revisions REVISION_NAME=100 \
  --region $REGION
```

**Test Deployment**
```bash
# Get service URL
SERVICE_URL=$(gcloud run services describe farmatodo-backend --region $REGION --format 'value(status.url)')

# Health check
curl $SERVICE_URL/actuator/health

# Test API (with API key)
curl -H "X-API-Key: your-api-key" $SERVICE_URL/products
```

### Cleanup (When Done Testing)

```bash
# Delete Cloud Run services
gcloud run services delete farmatodo-backend --region $REGION
gcloud run services delete farmatodo-frontend --region $REGION

# Delete Artifact Registry repositories
gcloud artifacts repositories delete backend-repo --location=$REGION
gcloud artifacts repositories delete frontend-repo --location=$REGION

# Delete Cloud SQL instance
gcloud sql instances delete farmatodo-db

# Delete GKE cluster
gcloud container clusters delete farmatodo-cluster --zone $REGION-a

# Delete secrets
gcloud secrets delete APP_API_KEY
gcloud secrets delete ENCRYPTION_SECRET
gcloud secrets delete DB_URL
gcloud secrets delete DB_USER
gcloud secrets delete DB_PASS
```

---

## Additional Resources

- [Cloud Run Documentation](https://cloud.google.com/run/docs)
- [GKE Documentation](https://cloud.google.com/kubernetes-engine/docs)
- [Cloud SQL Documentation](https://cloud.google.com/sql/docs)
- [Secret Manager Documentation](https://cloud.google.com/secret-manager/docs)
- [Cloud Build Documentation](https://cloud.google.com/build/docs)
- [Artifact Registry Documentation](https://cloud.google.com/artifact-registry/docs)
- [gcloud CLI Reference](https://cloud.google.com/sdk/gcloud/reference)

