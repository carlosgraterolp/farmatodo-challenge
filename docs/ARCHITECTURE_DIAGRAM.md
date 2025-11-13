# Farmatodo Challenge - Architecture Diagram

## System Architecture Overview

```mermaid
graph TB
    subgraph "Client Layer"
        Browser[Web Browser]
        Mobile[Mobile Device]
        Postman[Postman/API Client]
    end

    subgraph "GCP Cloud Run - Frontend"
        Frontend[Next.js 16 Frontend<br/>React 19 + TypeScript<br/>TailwindCSS 4<br/>Port: 3000]
    end

    subgraph "GCP Cloud Run - Backend"
        API[Spring Boot 3.4 API<br/>Java 17<br/>Port: 8080]
        
        subgraph "Security Layer"
            ApiKeyFilter[API Key Filter<br/>Spring Security]
            CORS[CORS Configuration]
        end
        
        subgraph "Controllers"
            ProductCtrl[Product Controller]
            OrderCtrl[Order Controller]
            HealthCtrl[Health Controller]
        end
        
        subgraph "Services"
            ProductSvc[Product Service]
            OrderSvc[Order Service]
            PaymentSvc[Payment Service<br/>Retry Logic: 3 attempts]
            TokenSvc[Tokenization Service<br/>AES-128 Encryption]
            EmailSvc[Email Service<br/>SMTP]
        end
        
        subgraph "Data Access"
            ProductRepo[Product Repository<br/>JPA/Hibernate]
            OrderRepo[Order Repository]
            PaymentRepo[Payment Repository]
        end
    end

    subgraph "GCP Cloud SQL"
        PostgreSQL[(PostgreSQL 15<br/>Managed Database)]
    end

    subgraph "External Services"
        SMTP[SMTP Mail Server<br/>Gmail/SendGrid]
        PaymentGateway[Simulated Payment Gateway<br/>35% Rejection Rate]
    end

    subgraph "GCP Infrastructure"
        CloudBuild[Cloud Build<br/>CI/CD Pipeline]
        ArtifactRegistry[Artifact Registry<br/>Docker Images]
        CloudLogging[Cloud Logging<br/>Centralized Logs]
    end

    %% Client to Frontend
    Browser -->|HTTPS| Frontend
    Mobile -->|HTTPS| Frontend
    Postman -->|HTTPS/HTTP| API

    %% Frontend to Backend
    Frontend -->|REST API<br/>HTTPS<br/>X-API-Key Header| API

    %% API Internal Flow
    API --> ApiKeyFilter
    API --> CORS
    ApiKeyFilter --> ProductCtrl
    ApiKeyFilter --> OrderCtrl
    ApiKeyFilter --> HealthCtrl
    
    ProductCtrl --> ProductSvc
    OrderCtrl --> OrderSvc
    
    OrderSvc --> ProductSvc
    OrderSvc --> PaymentSvc
    OrderSvc --> TokenSvc
    OrderSvc --> EmailSvc
    
    ProductSvc --> ProductRepo
    OrderSvc --> OrderRepo
    PaymentSvc --> PaymentRepo
    
    %% Database Connections
    ProductRepo -->|JDBC<br/>HikariCP| PostgreSQL
    OrderRepo -->|JDBC<br/>HikariCP| PostgreSQL
    PaymentRepo -->|JDBC<br/>HikariCP| PostgreSQL
    
    %% External Service Connections
    PaymentSvc -->|HTTPS<br/>Simulated API| PaymentGateway
    EmailSvc -->|SMTP<br/>TLS| SMTP
    
    %% Infrastructure
    CloudBuild -->|Build & Push| ArtifactRegistry
    ArtifactRegistry -->|Pull Images| Frontend
    ArtifactRegistry -->|Pull Images| API
    Frontend -->|Send Logs| CloudLogging
    API -->|Send Logs| CloudLogging

    %% Styling
    classDef frontend fill:#61dafb,stroke:#333,stroke-width:2px,color:#000
    classDef backend fill:#6db33f,stroke:#333,stroke-width:2px,color:#fff
    classDef database fill:#336791,stroke:#333,stroke-width:2px,color:#fff
    classDef external fill:#ff9900,stroke:#333,stroke-width:2px,color:#000
    classDef infra fill:#4285f4,stroke:#333,stroke-width:2px,color:#fff

    class Frontend frontend
    class API,ApiKeyFilter,CORS,ProductCtrl,OrderCtrl,HealthCtrl,ProductSvc,OrderSvc,PaymentSvc,TokenSvc,EmailSvc,ProductRepo,OrderRepo,PaymentRepo backend
    class PostgreSQL database
    class SMTP,PaymentGateway external
    class CloudBuild,ArtifactRegistry,CloudLogging infra
```

## Component Details

### Frontend Layer (Next.js)
- **Technology**: Next.js 16 with App Router
- **Framework**: React 19
- **Language**: TypeScript
- **Styling**: TailwindCSS 4
- **Port**: 3000
- **Features**:
  - Server-side rendering (SSR)
  - Product catalog with animations
  - Shopping cart management
  - Order checkout flow
  - Real-time stock updates

### Backend Layer (Spring Boot)
- **Technology**: Spring Boot 3.4
- **Language**: Java 17
- **Port**: 8080
- **Key Components**:
  - **API Key Filter**: Validates X-API-Key header for all protected endpoints
  - **CORS**: Configured for frontend domain access
  - **Controllers**: REST endpoints for products, orders, health
  - **Services**: Business logic layer with transaction management
  - **Repositories**: JPA/Hibernate data access layer

### Security & Authentication
- **Protocol**: API Key based authentication
- **Header**: `X-API-Key: SECRET123`
- **Encryption**: AES-128 for card tokenization
- **HTTPS**: All external communications encrypted

### Database Layer
- **Database**: PostgreSQL 15 (Cloud SQL)
- **Connection Pool**: HikariCP
- **ORM**: JPA/Hibernate
- **Features**:
  - Transactional integrity
  - Optimistic locking for concurrent access
  - Auto-schema updates

### External Services
1. **Payment Gateway** (Simulated)
   - Protocol: HTTPS
   - Retry Logic: Up to 3 attempts
   - Configurable rejection rate: 35%

2. **Email Service** (SMTP)
   - Protocol: SMTP with TLS
   - Purpose: Order confirmations
   - Provider: Gmail/SendGrid

### GCP Infrastructure
1. **Cloud Run**
   - Serverless container platform
   - Auto-scaling: 0-10 instances
   - Pay-per-use pricing

2. **Cloud Build**
   - Automated CI/CD pipeline
   - Multi-stage Docker builds
   - Artifact Registry integration

3. **Artifact Registry**
   - Docker image storage
   - Separate repos for frontend/backend
   - Image versioning with tags

4. **Cloud Logging**
   - Centralized log aggregation
   - Real-time monitoring
   - Log retention and analysis

## Data Flow

### Order Creation Flow
```mermaid
sequenceDiagram
    participant Client
    participant Frontend
    participant API
    participant TokenSvc
    participant PaymentSvc
    participant OrderSvc
    participant Database
    participant EmailSvc

    Client->>Frontend: Add items to cart
    Client->>Frontend: Proceed to checkout
    Frontend->>API: POST /api/orders<br/>(email, card, items)
    API->>TokenSvc: Tokenize card data
    TokenSvc-->>API: Card token
    API->>PaymentSvc: Process payment (with retry)
    PaymentSvc-->>API: Payment approved
    API->>OrderSvc: Create order
    OrderSvc->>Database: Insert order + items
    OrderSvc->>Database: Update product stock
    OrderSvc->>EmailSvc: Send confirmation
    EmailSvc-->>Client: Email confirmation
    API-->>Frontend: Order created response
    Frontend-->>Client: Success message
```

## Network Protocols

| Communication | Protocol | Port | Security |
|--------------|----------|------|----------|
| Browser ↔ Frontend | HTTPS | 443 | TLS 1.3 |
| Frontend ↔ Backend | HTTPS | 443 | TLS 1.3 + API Key |
| Backend ↔ Database | JDBC over TCP | 5432 | Cloud SQL Proxy |
| Backend ↔ SMTP | SMTP/TLS | 587 | TLS |
| Backend ↔ Payment API | HTTPS | 443 | TLS 1.3 |

## Deployment Architecture

```mermaid
graph LR
    subgraph "Developer Workflow"
        Dev[Developer]
        Git[Git Repository]
    end

    subgraph "CI/CD Pipeline"
        Trigger[Cloud Build Trigger]
        Build[Build Docker Images]
        Test[Run Tests]
        Push[Push to Artifact Registry]
    end

    subgraph "Production Environment"
        FE[Frontend<br/>Cloud Run]
        BE[Backend<br/>Cloud Run]
        DB[(Cloud SQL<br/>PostgreSQL)]
    end

    Dev -->|git push| Git
    Git -->|webhook| Trigger
    Trigger --> Build
    Build --> Test
    Test -->|success| Push
    Push -->|deploy| FE
    Push -->|deploy| BE
    BE -->|connect| DB

    classDef devOps fill:#ff6b6b,stroke:#333,stroke-width:2px
    classDef prod fill:#51cf66,stroke:#333,stroke-width:2px
    
    class Dev,Git,Trigger,Build,Test,Push devOps
    class FE,BE,DB prod
```

## Technology Stack Summary

### Frontend
- **Runtime**: Node.js 20
- **Framework**: Next.js 16
- **UI Library**: React 19
- **Styling**: TailwindCSS 4
- **Animation**: Framer Motion
- **HTTP Client**: Fetch API
- **Testing**: Jest + React Testing Library

### Backend
- **Runtime**: Java 17 (Eclipse Temurin)
- **Framework**: Spring Boot 3.4
- **Security**: Spring Security 6.5
- **Data Access**: Spring Data JPA
- **Connection Pool**: HikariCP
- **Testing**: JUnit 5 + Mockito
- **Build Tool**: Gradle 8.10

### Database
- **RDBMS**: PostgreSQL 15
- **Hosting**: GCP Cloud SQL
- **Connection**: JDBC with SSL
- **ORM**: Hibernate 6.x

### Infrastructure
- **Container Platform**: GCP Cloud Run
- **Container Registry**: Google Artifact Registry
- **CI/CD**: Google Cloud Build
- **Monitoring**: Google Cloud Logging
- **Container**: Docker (multi-stage builds)

## Scalability & Performance

- **Auto-scaling**: 0-10 instances per service
- **Cold start**: ~2-3 seconds
- **Response time**: <200ms (p95)
- **Concurrent requests**: Handled by Cloud Run auto-scaling
- **Database connections**: Pooled with HikariCP (max 10)
- **Rate limiting**: Configurable per service

## Security Features

1. **API Authentication**: X-API-Key header validation
2. **Card Tokenization**: AES-128 encryption
3. **HTTPS**: All communications encrypted
4. **SQL Injection**: Prevented by JPA/Hibernate
5. **CORS**: Configured for trusted origins
6. **Secrets Management**: Environment variables (upgradeable to Secret Manager)
7. **Container Security**: Non-root user execution
8. **Database**: Private IP, Cloud SQL Auth Proxy

---

**Note**: This architecture is designed for the Farmatodo technical challenge and demonstrates cloud-native best practices with containerization, microservices patterns, and automated CI/CD.
