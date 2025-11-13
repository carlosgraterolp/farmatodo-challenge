# GCP Deployment Quick Start

Get your backend running on Google Cloud Platform in minutes.

## 🚀 Fastest Path: Cloud Run

### Prerequisites
```bash
# Install gcloud CLI (if not installed)
curl https://sdk.cloud.google.com | bash

# Login and set project
gcloud auth login
gcloud config set project YOUR_PROJECT_ID
```

### Deploy in One Command
```bash
./deploy-cloud-run.sh YOUR_PROJECT_ID us-central1
```

That's it! The script will:
1. Enable required GCP APIs
2. Build the Docker image using Cloud Build
3. Deploy to Cloud Run
4. Return your service URL

### Manual Deployment

If you prefer manual control:

```bash
# 1. Build and push image
gcloud builds submit --config cloudbuild.yaml

# 2. Deploy to Cloud Run
export PROJECT_ID=$(gcloud config get-value project)
gcloud run deploy farmatodo-backend \
  --image gcr.io/$PROJECT_ID/farmatodo-backend:latest \
  --region us-central1 \
  --allow-unauthenticated

# 3. Get service URL
gcloud run services describe farmatodo-backend \
  --region us-central1 \
  --format 'value(status.url)'
```

## 🔐 Configure Secrets

For production, use Secret Manager:

```bash
# Create secrets
echo -n "your-secret-api-key" | gcloud secrets create APP_API_KEY --data-file=-
echo -n "1234567890123456" | gcloud secrets create ENCRYPTION_SECRET --data-file=-

# Update Cloud Run to use secrets
gcloud run services update farmatodo-backend \
  --set-secrets APP_API_KEY=APP_API_KEY:latest,ENCRYPTION_SECRET=ENCRYPTION_SECRET:latest \
  --region us-central1
```

## 💾 Add PostgreSQL Database

```bash
# 1. Create Cloud SQL instance
gcloud sql instances create farmatodo-db \
  --database-version=POSTGRES_14 \
  --tier=db-f1-micro \
  --region=us-central1

# 2. Create database and user
gcloud sql databases create farmatodo --instance=farmatodo-db
gcloud sql users create farmatodo-user \
  --instance=farmatodo-db \
  --password=YOUR_PASSWORD

# 3. Store DB credentials in Secret Manager
echo -n "jdbc:postgresql://localhost:5432/farmatodo" | gcloud secrets create DB_URL --data-file=-
echo -n "farmatodo-user" | gcloud secrets create DB_USER --data-file=-
echo -n "YOUR_PASSWORD" | gcloud secrets create DB_PASS --data-file=-

# 4. Connect Cloud Run to Cloud SQL
gcloud run services update farmatodo-backend \
  --add-cloudsql-instances $PROJECT_ID:us-central1:farmatodo-db \
  --set-secrets DB_URL=DB_URL:latest,DB_USER=DB_USER:latest,DB_PASS=DB_PASS:latest \
  --region us-central1
```

## 📊 Monitor Your Service

```bash
# View logs
gcloud run services logs read farmatodo-backend --region us-central1

# Tail logs (follow)
gcloud run services logs tail farmatodo-backend --region us-central1

# Check service status
gcloud run services describe farmatodo-backend --region us-central1
```

## 🧪 Test Your Deployment

```bash
# Get service URL
SERVICE_URL=$(gcloud run services describe farmatodo-backend --region us-central1 --format 'value(status.url)')

# Health check
curl $SERVICE_URL/actuator/health

# Test API (with API key)
curl -H "X-API-Key: your-api-key" $SERVICE_URL/products
```

## 🎛️ Common Operations

### Update Environment Variables
```bash
gcloud run services update farmatodo-backend \
  --set-env-vars "PAYMENT_REJECTION_PERCENTAGE=20" \
  --region us-central1
```

### Scale the Service
```bash
gcloud run services update farmatodo-backend \
  --min-instances 1 \
  --max-instances 20 \
  --region us-central1
```

### Redeploy Latest Image
```bash
gcloud builds submit --config cloudbuild.yaml
gcloud run services update farmatodo-backend \
  --image gcr.io/$PROJECT_ID/farmatodo-backend:latest \
  --region us-central1
```

### Rollback to Previous Version
```bash
# List revisions
gcloud run revisions list --service farmatodo-backend --region us-central1

# Route traffic to specific revision
gcloud run services update-traffic farmatodo-backend \
  --to-revisions REVISION_NAME=100 \
  --region us-central1
```

## 🔄 Set Up CI/CD

Enable automatic deployments on every push:

```bash
# Connect your GitHub/GitLab repo in Cloud Build
# Then create a trigger:
gcloud builds triggers create github \
  --repo-name=farmatodo-challenge \
  --repo-owner=YOUR_GITHUB_USERNAME \
  --branch-pattern="^main$" \
  --build-config=cloudbuild.yaml
```

Uncomment the Cloud Run deployment step in `cloudbuild.yaml` to enable auto-deploy.

## 🌍 Other Deployment Options

- **GKE (Kubernetes)**: See `k8s/deployment.yaml` and full guide in `docs/GCP_DEPLOYMENT.md`
- **App Engine**: Use `app.yaml` with `gcloud app deploy`

## 💰 Estimated Costs

**Cloud Run (Development):**
- Free tier: 2M requests/month, 360k GB-seconds/month
- After free tier: ~$0.40 per million requests
- Typical dev usage: **$0-5/month**

**Cloud SQL (db-f1-micro):**
- ~$7-10/month for small PostgreSQL instance

**Cloud Build:**
- Free tier: 120 build-minutes/day
- After free tier: $0.003 per build-minute

## 📚 Full Documentation

For detailed information on all deployment options, database setup, monitoring, and troubleshooting, see:
- [`docs/GCP_DEPLOYMENT.md`](docs/GCP_DEPLOYMENT.md) - Complete deployment guide

## ❓ Need Help?

**Common Issues:**

1. **"Permission denied"**: Grant yourself the Cloud Run Admin role
   ```bash
   gcloud projects add-iam-policy-binding $PROJECT_ID \
     --member="user:your-email@example.com" \
     --role="roles/run.admin"
   ```

2. **"Build failed"**: Check Cloud Build logs
   ```bash
   gcloud builds list --limit 5
   gcloud builds log BUILD_ID
   ```

3. **"Service unavailable"**: Check if all environment variables are set correctly
   ```bash
   gcloud run services describe farmatodo-backend --region us-central1
   ```
