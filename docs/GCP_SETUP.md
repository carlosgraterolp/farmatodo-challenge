# GCP Setup Checklist

Complete these steps before deploying to Google Cloud Platform.

## 1. Prerequisites

- [ ] Google Cloud account created
- [ ] Billing enabled on your project
- [ ] gcloud CLI installed ([Download](https://cloud.google.com/sdk/docs/install))

## 2. Install and Configure gcloud

```bash
# Install gcloud CLI (if not already installed)
# macOS
brew install google-cloud-sdk

# Verify installation
gcloud --version

# Login to your Google account
gcloud auth login

# Set your project ID (replace with your actual project ID)
gcloud config set project farmatodo-challenge

# Set default region
gcloud config set run/region us-central1
```

## 3. Enable Required APIs

```bash
gcloud services enable \
  cloudbuild.googleapis.com \
  run.googleapis.com \
  artifactregistry.googleapis.com \
  secretmanager.googleapis.com
```

## 4. Create Artifact Registry Repositories

```bash
# Backend repository
gcloud artifacts repositories create backend-repo \
  --repository-format=docker \
  --location=us-central1 \
  --description="Backend Docker images"

# Frontend repository
gcloud artifacts repositories create frontend-repo \
  --repository-format=docker \
  --location=us-central1 \
  --description="Frontend Docker images"

# Verify repositories
gcloud artifacts repositories list --location=us-central1
```

## 5. Configure Docker Authentication

```bash
# Configure Docker to use gcloud as credential helper
gcloud auth configure-docker us-central1-docker.pkg.dev
```

## 6. Set Up Secrets (Optional but Recommended)

```bash
# Create API Key secret
echo -n "YOUR_SECURE_API_KEY" | gcloud secrets create app-api-key --data-file=-

# Create Encryption Secret (must be 16 characters)
echo -n "YOUR_16_CHAR_KEY!" | gcloud secrets create encryption-secret --data-file=-

# Grant Cloud Run access to secrets
PROJECT_NUMBER=$(gcloud projects describe $(gcloud config get-value project) --format="value(projectNumber)")

gcloud secrets add-iam-policy-binding app-api-key \
  --member="serviceAccount:${PROJECT_NUMBER}-compute@developer.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"

gcloud secrets add-iam-policy-binding encryption-secret \
  --member="serviceAccount:${PROJECT_NUMBER}-compute@developer.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"
```

## 7. Verify IAM Permissions

Your account needs these roles:
- Cloud Run Admin
- Artifact Registry Admin
- Cloud Build Editor
- Secret Manager Admin (if using secrets)

```bash
# Check your permissions
gcloud projects get-iam-policy $(gcloud config get-value project) \
  --flatten="bindings[].members" \
  --filter="bindings.members:user:YOUR_EMAIL"

# Add roles if needed (requires project owner)
gcloud projects add-iam-policy-binding $(gcloud config get-value project) \
  --member="user:YOUR_EMAIL" \
  --role="roles/run.admin"

gcloud projects add-iam-policy-binding $(gcloud config get-value project) \
  --member="user:YOUR_EMAIL" \
  --role="roles/artifactregistry.admin"
```

## 8. Update cloudbuild.yaml

Before running the deployment, update the image paths in `cloudbuild.yaml` if your project ID is different:

```yaml
# Replace 'farmatodo-challenge' with your project ID in these lines:
- 'us-central1-docker.pkg.dev/YOUR_PROJECT_ID/backend-repo/farmatodo-backend:$COMMIT_SHA'
- 'us-central1-docker.pkg.dev/YOUR_PROJECT_ID/frontend-repo/farmatodo-frontend:$COMMIT_SHA'
```

## 9. Test Local Build First

Before deploying to GCP, test locally:

```bash
# Test with docker-compose
docker-compose up --build

# Verify services are running
curl http://localhost:8080/actuator/health
curl http://localhost:3000
```

## 10. Deploy to GCP

Once everything is set up:

```bash
# Option 1: Automated deployment (recommended)
./deploy-full-stack.sh

# Option 2: Manual deployment
# Build images
gcloud builds submit --config cloudbuild.yaml

# Deploy backend
gcloud run deploy farmatodo-backend \
  --image us-central1-docker.pkg.dev/$(gcloud config get-value project)/backend-repo/farmatodo-backend:latest \
  --region us-central1 \
  --allow-unauthenticated

# Deploy frontend
gcloud run deploy farmatodo-frontend \
  --image us-central1-docker.pkg.dev/$(gcloud config get-value project)/frontend-repo/farmatodo-frontend:latest \
  --region us-central1 \
  --allow-unauthenticated
```

## 11. Post-Deployment

After successful deployment:

```bash
# Get service URLs
BACKEND_URL=$(gcloud run services describe farmatodo-backend --region us-central1 --format='value(status.url)')
FRONTEND_URL=$(gcloud run services describe farmatodo-frontend --region us-central1 --format='value(status.url)')

echo "Backend: $BACKEND_URL"
echo "Frontend: $FRONTEND_URL"

# Test backend health
curl $BACKEND_URL/actuator/health

# Update frontend with correct backend URL (if needed)
gcloud run services update farmatodo-frontend \
  --set-env-vars NEXT_PUBLIC_API_BASE_URL=$BACKEND_URL \
  --region us-central1
```

## 12. Cost Management

### Set Budget Alerts

```bash
# Create a budget (optional but recommended)
gcloud billing budgets create \
  --billing-account=YOUR_BILLING_ACCOUNT_ID \
  --display-name="Cloud Run Budget" \
  --budget-amount=50USD \
  --threshold-rule=percent=50 \
  --threshold-rule=percent=90 \
  --threshold-rule=percent=100
```

### Enable Cost Optimization

- Set min-instances to 0 (already configured in deployment script)
- Use appropriate CPU and memory limits
- Monitor usage in GCP Console

## Troubleshooting

### Permission Denied
```bash
# Re-authenticate
gcloud auth login
gcloud auth application-default login
```

### Build Fails
```bash
# Check Cloud Build logs
gcloud builds list --limit=5
gcloud builds log BUILD_ID
```

### Repository Not Found
```bash
# List repositories
gcloud artifacts repositories list --location=us-central1

# Create if missing
gcloud artifacts repositories create REPO_NAME \
  --repository-format=docker \
  --location=us-central1
```

### Service Won't Start
```bash
# Check service logs
gcloud run services logs read SERVICE_NAME --region us-central1 --limit=100

# Check service description
gcloud run services describe SERVICE_NAME --region us-central1
```

## Cleanup (When Done Testing)

To avoid charges, delete resources:

```bash
# Delete Cloud Run services
gcloud run services delete farmatodo-backend --region us-central1
gcloud run services delete farmatodo-frontend --region us-central1

# Delete Artifact Registry repositories
gcloud artifacts repositories delete backend-repo --location=us-central1
gcloud artifacts repositories delete frontend-repo --location=us-central1

# Delete secrets (if created)
gcloud secrets delete app-api-key
gcloud secrets delete encryption-secret
```

## Resources

- [Cloud Run Documentation](https://cloud.google.com/run/docs)
- [Cloud Build Documentation](https://cloud.google.com/build/docs)
- [Artifact Registry Documentation](https://cloud.google.com/artifact-registry/docs)
- [gcloud CLI Reference](https://cloud.google.com/sdk/gcloud/reference)

---

**Ready to deploy?** Run `./deploy-full-stack.sh` and follow the prompts!
