# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

Farmatodo Technical Challenge - A Spring Boot REST API for an e-commerce platform with shopping cart, payment processing, and order management functionality. The application uses H2 in-memory database for local development, Spring Security for API protection, and includes features like card tokenization, payment retry logic, and transaction logging.

## Build & Run Commands

### Local Development (Backend)
```bash
# Build the application
cd backend && ./gradlew clean build

# Run tests
cd backend && ./gradlew test

# Run a single test
cd backend && ./gradlew test --tests "ClassName.methodName"

# Run the application locally
cd backend && ./gradlew bootRun

# Build JAR
cd backend && ./gradlew bootJar
```

### Docker
```bash
# Build and run with Docker Compose (from root)
docker-compose up --build

# Stop containers
docker-compose down
```

The API runs on port 8080. H2 Console is accessible at `http://localhost:8080/h2-console` (JDBC URL: `jdbc:h2:mem:testdb`, username: `sa`, no password).

## Architecture Overview

### Package Structure
The application follows a layered architecture pattern:

- **`controller/`** - REST API endpoints (CartController, OrderController, ProductController, CustomerController, TokenController, TransactionLogController, HealthController)
- **`service/`** - Business logic layer (interfaces) with implementations in `service/impl/`
- **`repository/`** - JPA repositories for data access
- **`entity/`** - JPA entities (Customer, Product, Cart, CartItem, Order, OrderItem, CardToken, PaymentAttempt, TransactionLog, ProductSearchLog)
- **`dto/`** - Data Transfer Objects for API requests/responses
- **`config/`** - Spring configuration (SecurityConfig)
- **`security/`** - Security-related components
- **`util/`** - Utility classes (CryptoUtil for encryption)

### Key Domain Flows

**Order Creation Flow**: The order process involves multiple coordinated steps:
1. Cart validation and stock verification
2. Card tokenization (simulated with configurable rejection rate)
3. Payment processing with automatic retry logic (configurable max retries and rejection percentage)
4. Stock deduction and order persistence
5. Email notifications (async)
6. Transaction logging for audit trail

**Security Model**: The API uses Spring Security with stateless session management. Public endpoints include `/auth/**` and `GET /products/**`. Other endpoints require authentication. CSRF is disabled for API-first design.

**Data Encryption**: Card numbers are encrypted using AES before tokenization. The encryption secret is configurable via `encryption.secret` property (16 chars for AES-128).

### Configuration

Key environment variables/properties:
- `app.api-key` - API key for authentication
- `encryption.secret` - AES encryption key (must be 16 characters)
- `tokenization.rejection-percentage` - Simulate tokenization failures (0-100)
- `payment.rejection-percentage` - Simulate payment failures (0-100)
- `payment.max-retries` - Maximum payment retry attempts
- `product.min-stock` - Minimum stock threshold
- `spring.h2.console.enabled` - Enable/disable H2 console

Application profiles:
- Default (local) - Uses H2 in-memory database
- `gcp` - Production profile (configured in `application-gcp.properties`)

### Database Initialization

The application uses `data.sql` for initial data seeding. JPA is configured with `ddl-auto=update` and deferred datasource initialization to ensure schema exists before data loading.

## Testing Approach

The project uses JUnit Platform with Spring Boot Test. Run tests with `./gradlew test` from the backend directory. Use `--tests` flag to run specific test classes or methods.
