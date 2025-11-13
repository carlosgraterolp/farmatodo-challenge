# GCP Deployment Guide

This guide covers deploying the Farmatodo Challenge backend to Google Cloud Platform (GCP) using various services.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Option 1: Cloud Run (Recommended)](#option-1-cloud-run-recommended)
- [Option 2: Google Kubernetes Engine (GKE)](#option-2-google-kubernetes-engine-gke)
- [Option 3: App Engine Flexible](#option-3-app-engine-flexible)
- [Database Setup (Cloud SQL)](#database-setup-cloud-sql)
- [Secrets Management](#secrets-management)
- [CI/CD with Cloud Build](#cicd-with-cloud-build)
- [Monitoring and Logging](#monitoring-and-logging)

---

## Prerequisites

1. **Google Cloud SDK installed**:
   ```bash
   # Install gcloud CLI
   curl https://sdk.cloud.google.com | bash
   exec -l $SHELL
   gcloud init
   ```

2. **Authenticate with GCP**:
   ```bash
   gcloud auth login
   gcloud config set project YOUR_PROJECT_ID
   ```

3. **Enable required APIs**:
   ```bash
   gcloud services enable cloudbuild.googleapis.com \
     run.googleapis.com \
     sqladmin.googleapis.com \
     secretmanager.googleapis.com \
     containerregistry.googleapis.com \
     artifactregistry.googleapis.com
   ```

4. **Set environment variables**:
   ```bash
   export PROJECT_ID=$(gcloud config get-value project)
   export REGION=us-central1
   ```

---

## Option 1: Cloud Run (Recommended)

Cloud Run is the simplest and most cost-effective option for containerized applications.

### Step 1: Build and Push Docker Image

**Option A: Build locally and push**
```bash
# Build the Docker image
cd backend
docker build -t gcr.io/$PROJECT_ID/farmatodo-backend:latest .

# Push to Google Container Registry
docker push gcr.io/$PROJECT_ID/farmatodo-backend:latest
```

**Option B: Build with Cloud Build (recommended)**
```bash
# From project root
gcloud builds submit --config cloudbuild.yaml
```

### Step 2: Deploy to Cloud Run

```bash
gcloud run deploy farmatodo-backend \
  --image gcr.io/$PROJECT_ID/farmatodo-backend:latest \
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

### Step 3: Connect to Cloud SQL (if using PostgreSQL)

```bash
# Add Cloud SQL connection
gcloud run services update farmatodo-backend \
  --add-cloudsql-instances YOUR_PROJECT_ID:$REGION:farmatodo-db \
  --set-env-vars "DB_URL=jdbc:postgresql://localhost:5432/farmatodo" \
  --set-env-vars "DB_USER=farmatodo-user" \
  --set-secrets "DB_PASS=db-password:latest" \
  --region $REGION
```

### Step 4: Get the Service URL

```bash
gcloud run services describe farmatodo-backend --region $REGION --format 'value(status.url)'
```

---

## Option 2: Google Kubernetes Engine (GKE)

For more control and advanced deployment scenarios.

### Step 1: Create GKE Cluster

```bash
gcloud container clusters create farmatodo-cluster \
  --zone $REGION-a \
  --num-nodes 2 \
  --machine-type n1-standard-2 \
  --enable-autoscaling \
  --min-nodes 1 \
  --max-nodes 5
```

### Step 2: Get Cluster Credentials

```bash
gcloud container clusters get-credentials farmatodo-cluster --zone $REGION-a
```

### Step 3: Create Kubernetes Resources

Create `k8s/deployment.yaml`:
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: farmatodo-backend
spec:
  replicas: 2
  selector:
    matchLabels:
      app: farmatodo-backend
  template:
    metadata:
      labels:
        app: farmatodo-backend
    spec:
      containers:
      - name: backend
        image: gcr.io/YOUR_PROJECT_ID/farmatodo-backend:latest
        ports:
        - containerPort: 8080
        env:
        - name: SPRING_PROFILES_ACTIVE
          value: "gcp"
        - name: APP_API_KEY
          valueFrom:
            secretKeyRef:
              name: app-secrets
              key: api-key
        - name: ENCRYPTION_SECRET
          valueFrom:
            secretKeyRef:
              name: app-secrets
              key: encryption-secret
        - name: DB_URL
          value: "jdbc:postgresql://localhost:5432/farmatodo"
        - name: DB_USER
          valueFrom:
            secretKeyRef:
              name: db-secrets
              key: username
        - name: DB_PASS
          valueFrom:
            secretKeyRef:
              name: db-secrets
              key: password
        resources:
          requests:
            memory: "512Mi"
            cpu: "250m"
          limits:
            memory: "1Gi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /actuator/health
            port: 8080
          initialDelaySeconds: 60
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /actuator/health
            port: 8080
          initialDelaySeconds: 30
          periodSeconds: 5
---
apiVersion: v1
kind: Service
metadata:
  name: farmatodo-backend-service
spec:
  type: LoadBalancer
  selector:
    app: farmatodo-backend
  ports:
  - protocol: TCP
    port: 80
    targetPort: 8080
```

### Step 4: Create Secrets

```bash
kubectl create secret generic app-secrets \
  --from-literal=api-key='your-api-key' \
  --from-literal=encryption-secret='1234567890123456'

kubectl create secret generic db-secrets \
  --from-literal=username='farmatodo-user' \
  --from-literal=password='your-db-password'
```

### Step 5: Deploy

```bash
kubectl apply -f k8s/deployment.yaml
kubectl get services
```

---

## Option 3: App Engine Flexible

### Step 1: Prepare app.yaml

The `app.yaml` file is already in the project root. Update it with your configuration.

### Step 2: Deploy

```bash
# From project root (app.yaml must be at root)
gcloud app deploy app.yaml --project $PROJECT_ID
```

### Step 3: View the Application

```bash
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

### Connection Methods

**For Cloud Run and App Engine:**
- Use Cloud SQL Proxy (automatic with `--add-cloudsql-instances`)
- Connection string: `jdbc:postgresql://localhost:5432/farmatodo`

**For GKE:**
- Use Cloud SQL Proxy sidecar container
- Or use Workload Identity with Cloud SQL Auth Proxy

**For local testing:**
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
# Create API key secret
echo -n "your-secret-api-key" | gcloud secrets create APP_API_KEY \
  --data-file=-

# Create encryption secret
echo -n "1234567890123456" | gcloud secrets create ENCRYPTION_SECRET \
  --data-file=-

# Create DB password secret
echo -n "your-db-password" | gcloud secrets create DB_PASS \
  --data-file=-

# Create DB URL secret
echo -n "jdbc:postgresql://localhost:5432/farmatodo" | gcloud secrets create DB_URL \
  --data-file=-

# Create DB user secret
echo -n "farmatodo-user" | gcloud secrets create DB_USER \
  --data-file=-
```

### Grant Access to Secrets

```bash
# For Cloud Run
gcloud secrets add-iam-policy-binding APP_API_KEY \
  --member=serviceAccount:$PROJECT_ID@$PROJECT_ID.iam.gserviceaccount.com \
  --role=roles/secretmanager.secretAccessor

# Repeat for other secrets
```

### Use Secrets in Cloud Run

```bash
gcloud run services update farmatodo-backend \
  --set-secrets DB_URL=DB_URL:latest,DB_USER=DB_USER:latest,DB_PASS=DB_PASS:latest \
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
gcloud run services logs read farmatodo-backend --region $REGION
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
- Use `db-f1-micro` for development
- Use `db-n1-standard-1` or higher for production
- Enable automatic backups
- Use read replicas for high traffic

### Best Practices
- Use Cloud CDN for static content
- Enable request/response compression
- Use connection pooling for database
- Implement caching (Redis/Memorystore)

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

### Test Database Connection
```bash
# From Cloud Shell or local with Cloud SQL Proxy running
psql "host=localhost port=5432 dbname=farmatodo user=farmatodo-user"
```

---

## Quick Reference Commands

```bash
# Build and deploy to Cloud Run (fastest path)
gcloud builds submit --config cloudbuild.yaml && \
gcloud run deploy farmatodo-backend \
  --image gcr.io/$PROJECT_ID/farmatodo-backend:latest \
  --region $REGION

# Update environment variables
gcloud run services update farmatodo-backend \
  --set-env-vars "KEY=VALUE" \
  --region $REGION

# Scale Cloud Run
gcloud run services update farmatodo-backend \
  --min-instances 1 \
  --max-instances 20 \
  --region $REGION

# Delete resources
gcloud run services delete farmatodo-backend --region $REGION
gcloud sql instances delete farmatodo-db
gcloud container clusters delete farmatodo-cluster --zone $REGION-a
```

---

## Additional Resources

- [Cloud Run Documentation](https://cloud.google.com/run/docs)
- [GKE Documentation](https://cloud.google.com/kubernetes-engine/docs)
- [Cloud SQL Documentation](https://cloud.google.com/sql/docs)
- [Secret Manager Documentation](https://cloud.google.com/secret-manager/docs)
- [Cloud Build Documentation](https://cloud.google.com/build/docs)
