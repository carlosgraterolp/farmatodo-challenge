# Full-Stack Deployment Guide

This guide covers deploying both the backend (Spring Boot) and frontend (Next.js) to Google Cloud Platform (GCP) using Cloud Run, as well as running the full stack locally with Docker Compose.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Local Deployment with Docker Compose](#local-deployment-with-docker-compose)
- [GCP Cloud Run Deployment](#gcp-cloud-run-deployment)
- [Environment Variables](#environment-variables)
- [Troubleshooting](#troubleshooting)

---

## Prerequisites

### For Local Development
- Docker Desktop installed and running
- Docker Compose v3.9 or higher

### For GCP Deployment
- Google Cloud SDK (`gcloud`) installed
- GCP project with billing enabled
- Appropriate IAM permissions (Cloud Run Admin, Artifact Registry Admin, Cloud Build Editor)

---

## Local Deployment with Docker Compose

### Quick Start

1. **Build and start all services:**
   ```bash
   docker-compose up --build
   ```

2. **Access the applications:**
   - **Frontend**: http://localhost:3000
   - **Backend API**: http://localhost:8080
   - **Backend Health**: http://localhost:8080/actuator/health
   - **H2 Console**: http://localhost:8080/h2-console
     - JDBC URL: `jdbc:h2:mem:testdb`
     - Username: `sa`
     - Password: (leave empty)

3. **Stop services:**
   ```bash
   docker-compose down
   ```

### Docker Compose Architecture

The `docker-compose.yml` defines two services:

- **api** (Backend)
  - Port: 8080
  - Built from: `./backend`
  - Health check enabled
  
- **frontend**
  - Port: 3000
  - Built from: `./frontend`
  - Depends on: api (waits for health check)
  - Connects to backend via internal network

Both services are connected via a bridge network (`farmatodo-network`), allowing the frontend to communicate with the backend using the service name `api` as hostname.

### Useful Commands

```bash
# Build without starting
docker-compose build

# Start in detached mode
docker-compose up -d

# View logs
docker-compose logs -f

# View logs for specific service
docker-compose logs -f frontend
docker-compose logs -f api

# Restart a specific service
docker-compose restart frontend

# Remove volumes (clean slate)
docker-compose down -v
```

---

## GCP Cloud Run Deployment

### One-Command Deployment

Deploy both backend and frontend to Cloud Run:

```bash
./deploy-full-stack.sh [PROJECT_ID] [REGION]
```

**Example:**
```bash
./deploy-full-stack.sh farmatodo-challenge us-central1
```

If PROJECT_ID is omitted, it uses your current gcloud project.

### What the Script Does

1. **Enables required GCP APIs:**
   - Cloud Build
   - Cloud Run
   - Artifact Registry

2. **Creates Artifact Registry repositories:**
   - `backend-repo` for backend Docker images
   - `frontend-repo` for frontend Docker images

3. **Builds Docker images** using Cloud Build (reads `cloudbuild.yaml`)

4. **Deploys backend** to Cloud Run with configuration:
   - 512Mi memory, 1 CPU
   - Auto-scaling: 0-10 instances
   - Environment variables for Spring Boot

5. **Deploys frontend** to Cloud Run:
   - 512Mi memory, 1 CPU
   - Auto-scaling: 0-10 instances
   - Configured with backend URL

6. **Outputs service URLs** for both frontend and backend

### Manual Deployment Steps

If you prefer manual control:

#### 1. Configure gcloud

```bash
gcloud config set project YOUR_PROJECT_ID
gcloud auth login
```

#### 2. Enable APIs

```bash
gcloud services enable \
  cloudbuild.googleapis.com \
  run.googleapis.com \
  artifactregistry.googleapis.com
```

#### 3. Create Artifact Registry Repositories

```bash
gcloud artifacts repositories create backend-repo \
  --repository-format=docker \
  --location=us-central1 \
  --description="Backend Docker repository"

gcloud artifacts repositories create frontend-repo \
  --repository-format=docker \
  --location=us-central1 \
  --description="Frontend Docker repository"
```

#### 4. Build Images

```bash
gcloud builds submit --config cloudbuild.yaml
```

#### 5. Deploy Backend

```bash
gcloud run deploy farmatodo-backend \
  --image us-central1-docker.pkg.dev/YOUR_PROJECT_ID/backend-repo/farmatodo-backend:latest \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --port 8080 \
  --memory 512Mi \
  --set-env-vars "SPRING_PROFILES_ACTIVE=gcp" \
  --set-env-vars "APP_API_KEY=YOUR_SECRET_KEY" \
  --set-env-vars "ENCRYPTION_SECRET=YOUR_16_CHAR_SECRET"
```

#### 6. Get Backend URL

```bash
BACKEND_URL=$(gcloud run services describe farmatodo-backend \
  --region us-central1 \
  --format 'value(status.url)')
echo $BACKEND_URL
```

#### 7. Deploy Frontend

```bash
gcloud run deploy farmatodo-frontend \
  --image us-central1-docker.pkg.dev/YOUR_PROJECT_ID/frontend-repo/farmatodo-frontend:latest \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --port 3000 \
  --memory 512Mi \
  --set-env-vars "NEXT_PUBLIC_API_BASE_URL=$BACKEND_URL" \
  --set-env-vars "NEXT_PUBLIC_API_KEY=YOUR_SECRET_KEY"
```

---

## Environment Variables

### Backend Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `APP_API_KEY` | API key for authentication | `SECRET123` | Yes |
| `ENCRYPTION_SECRET` | 16-char AES encryption key | `1234567890123456` | Yes |
| `SPRING_PROFILES_ACTIVE` | Spring profile (local/gcp) | `local` | No |
| `TOKENIZATION_REJECTION_PERCENTAGE` | Simulate tokenization failures (0-100) | `0` | No |
| `PAYMENT_REJECTION_PERCENTAGE` | Simulate payment failures (0-100) | `35` | No |
| `PAYMENT_MAX_RETRIES` | Max payment retry attempts | `3` | No |
| `PRODUCT_MIN_STOCK` | Minimum stock threshold | `0` | No |
| `SPRING_H2_CONSOLE_ENABLED` | Enable H2 console | `true` (local), `false` (gcp) | No |

### Frontend Environment Variables

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `NEXT_PUBLIC_API_BASE_URL` | Backend API URL | `http://localhost:8080` | Yes |
| `NEXT_PUBLIC_API_KEY` | API key for backend | `SECRET123` | Yes |
| `NODE_ENV` | Node environment | `production` | No |

### Updating Environment Variables in GCP

**Backend:**
```bash
gcloud run services update farmatodo-backend \
  --set-env-vars APP_API_KEY=new-secret-key \
  --region us-central1
```

**Frontend:**
```bash
gcloud run services update farmatodo-frontend \
  --set-env-vars NEXT_PUBLIC_API_KEY=new-secret-key \
  --region us-central1
```

---

## Architecture Overview

### Local (Docker Compose)

```
┌─────────────────┐         ┌─────────────────┐
│                 │         │                 │
│  Frontend       │────────▶│  Backend API    │
│  (Next.js)      │  HTTP   │  (Spring Boot)  │
│  Port: 3000     │         │  Port: 8080     │
│                 │         │                 │
└─────────────────┘         └─────────────────┘
        │                            │
        └────────────────────────────┘
              farmatodo-network
                 (bridge)
```

### GCP Cloud Run

```
┌─────────────────┐         ┌─────────────────┐
│                 │         │                 │
│  Frontend       │────────▶│  Backend API    │
│  Cloud Run      │  HTTPS  │  Cloud Run      │
│                 │         │                 │
└─────────────────┘         └─────────────────┘
        │                            │
        │                            │
        ▼                            ▼
┌─────────────────┐         ┌─────────────────┐
│  Artifact       │         │  Artifact       │
│  Registry       │         │  Registry       │
│  frontend-repo  │         │  backend-repo   │
└─────────────────┘         └─────────────────┘
```

---

## Troubleshooting

### Docker Compose Issues

**Problem:** Frontend can't connect to backend
```bash
# Check if services are running
docker-compose ps

# Check backend health
curl http://localhost:8080/actuator/health

# Check network connectivity
docker-compose exec frontend curl http://api:8080/actuator/health
```

**Problem:** Port already in use
```bash
# Find and kill process using port 3000 or 8080
lsof -ti:3000 | xargs kill -9
lsof -ti:8080 | xargs kill -9
```

**Problem:** Changes not reflected
```bash
# Rebuild and restart
docker-compose down
docker-compose build --no-cache
docker-compose up
```

### GCP Deployment Issues

**Problem:** Permission denied
```bash
# Check your permissions
gcloud projects get-iam-policy YOUR_PROJECT_ID \
  --flatten="bindings[].members" \
  --filter="bindings.members:user:YOUR_EMAIL"
```

**Problem:** Build fails
```bash
# Check Cloud Build logs
gcloud builds list --limit=5
gcloud builds log BUILD_ID
```

**Problem:** Service not accessible
```bash
# Check service status
gcloud run services describe farmatodo-frontend --region us-central1

# Check logs
gcloud run services logs read farmatodo-frontend --region us-central1 --limit=50
```

**Problem:** Frontend shows "API connection error"
- Verify backend URL in frontend environment variables
- Check if backend is deployed and accessible
- Verify CORS settings in backend
- Check API key matches between frontend and backend

### View Logs

**Docker Compose:**
```bash
docker-compose logs -f
```

**GCP Cloud Run:**
```bash
# Backend
gcloud run services logs read farmatodo-backend --region us-central1 --limit=50

# Frontend
gcloud run services logs read farmatodo-frontend --region us-central1 --limit=50
```

---

## Testing the Deployment

### Local (Docker Compose)

```bash
# Test backend health
curl http://localhost:8080/actuator/health

# Test frontend
curl http://localhost:3000

# Get all products
curl -H "X-API-Key: SECRET123" http://localhost:8080/api/products
```

### GCP Cloud Run

Replace `YOUR_BACKEND_URL` and `YOUR_FRONTEND_URL` with actual URLs:

```bash
# Test backend health
curl https://YOUR_BACKEND_URL/actuator/health

# Test frontend
curl https://YOUR_FRONTEND_URL

# Get all products
curl -H "X-API-Key: SECRET123" https://YOUR_BACKEND_URL/api/products
```

---

## Cost Optimization

Cloud Run charges only for actual usage. With the current configuration:
- Min instances: 0 (no idle charges)
- Max instances: 10 (controls max cost)
- Memory: 512Mi per instance
- CPU: 1 per instance

**Estimated costs** (with minimal traffic):
- ~$5-10/month for both services
- First 2 million requests/month are free
- Idle services cost $0

---

## Security Considerations

### For Production

1. **Update secrets** - Change default API keys and encryption secrets
2. **Enable HTTPS** - Cloud Run provides HTTPS by default
3. **Use Secret Manager** - Store secrets in GCP Secret Manager instead of env vars
4. **Enable authentication** - Consider using Cloud IAM for backend-to-frontend auth
5. **Add CORS** - Configure proper CORS origins in backend
6. **Use custom domain** - Map custom domains to your Cloud Run services
7. **Enable Cloud Armor** - Add DDoS protection

```bash
# Example: Using Secret Manager
gcloud secrets create app-api-key --data-file=-
# (paste your secret, press Ctrl+D)

gcloud run services update farmatodo-backend \
  --set-secrets="APP_API_KEY=app-api-key:latest" \
  --region us-central1
```

---

## Next Steps

- Set up CI/CD pipeline with Cloud Build triggers
- Configure custom domains
- Add monitoring and alerting
- Set up Cloud SQL for production database
- Implement caching with Memorystore
- Add CDN for frontend assets

---

For more information, refer to:
- [WARP.md](./WARP.md) - Project overview and build commands
- [GCP_QUICKSTART.md](./GCP_QUICKSTART.md) - GCP setup guide
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Cloud Run Documentation](https://cloud.google.com/run/docs)
