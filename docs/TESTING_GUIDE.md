# Testing Guide

This guide explains how to run tests for the Farmatodo Challenge project.

---

## Backend Tests (Spring Boot)

### Run All Tests

```bash
cd backend
./gradlew test
```

### Run Tests with Coverage Report

```bash
cd backend
./gradlew test jacocoTestReport
```

### View Coverage Report

```bash
# macOS/Linux
open build/reports/jacoco/test/html/index.html

# Windows
start build/reports/jacoco/test/html/index.html
```

### Run Specific Test Class

```bash
cd backend
./gradlew test --tests "com.farmatodo.reto.service.impl.OrderServiceImplTest"
```

### Run Tests in Watch Mode (continuous)

```bash
cd backend
./gradlew test --continuous
```

---

## Frontend Tests (Next.js/React)

### Run All Tests

```bash
cd frontend
npm test
```

### Run Tests in Watch Mode

```bash
cd frontend
npm run test:watch
```

### Run Tests with Coverage

```bash
cd frontend
npm run test:coverage
```

### View Coverage Report

```bash
# macOS/Linux
open coverage/lcov-report/index.html

# Windows
start coverage/lcov-report/index.html
```

### Run Tests in CI Mode

```bash
cd frontend
npm test -- --ci --passWithNoTests
```

---

## Run All Tests (Full Stack)

### Quick Test Script

```bash
# From project root
cd backend && ./gradlew test && cd ../frontend && npm test
```

### With Coverage Reports

```bash
# Backend with coverage
cd backend && ./gradlew test jacocoTestReport

# Frontend with coverage
cd ../frontend && npm run test:coverage
```

---

## Test Configuration

### Backend Test Configuration

- **Framework:** JUnit 5
- **Mocking:** Mockito
- **Coverage Tool:** JaCoCo
- **Build Tool:** Gradle

**Configuration File:** `backend/build.gradle`

### Frontend Test Configuration

- **Framework:** Jest
- **Testing Library:** React Testing Library
- **Coverage Tool:** Jest built-in

**Configuration Files:**
- `frontend/jest.config.js`
- `frontend/jest.setup.js`

---

## Test Structure

### Backend Tests

```
backend/src/test/java/com/farmatodo/reto/
├── service/
│   └── impl/
│       ├── CartServiceImplTest.java
│       ├── OrderServiceImplTest.java
│       ├── PaymentServiceImplTest.java
│       ├── ProductServiceImplTest.java
│       └── TokenizationServiceImplTest.java
└── util/
    └── CryptoUtilTest.java
```

### Frontend Tests

```
frontend/src/lib/__tests__/
├── api.test.ts
└── utils.test.ts
```

---

## Common Issues & Solutions

### Backend

**Issue:** `./gradlew: Permission denied`
```bash
chmod +x gradlew
```

**Issue:** Tests fail due to missing dependencies
```bash
./gradlew clean build
```

### Frontend

**Issue:** `jest: command not found`
```bash
npm install
```

**Issue:** Tests timeout
```bash
npm test -- --testTimeout=10000
```

---

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Tests

on: [push, pull_request]

jobs:
  backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-java@v3
        with:
          java-version: '17'
      - name: Run tests
        run: cd backend && ./gradlew test

  frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - name: Install dependencies
        run: cd frontend && npm ci
      - name: Run tests
        run: cd frontend && npm test -- --ci
```

---

## Best Practices

1. **Run tests before committing**
   ```bash
   git add .
   cd backend && ./gradlew test && cd ../frontend && npm test
   git commit -m "Your message"
   ```

2. **Check coverage regularly**
   - Backend: Aim for >80% on service layer
   - Frontend: Aim for >70% on business logic

3. **Keep tests fast**
   - Backend tests should complete in <30s
   - Frontend tests should complete in <5s

4. **Write tests for new features**
   - Add test cases alongside feature code
   - Follow existing test patterns

---

## Quick Reference

| Action | Backend | Frontend |
|--------|---------|----------|
| Run tests | `./gradlew test` | `npm test` |
| Watch mode | `./gradlew test --continuous` | `npm run test:watch` |
| Coverage | `./gradlew jacocoTestReport` | `npm run test:coverage` |
| Clean | `./gradlew clean` | `rm -rf coverage` |
| Specific test | `--tests "ClassName"` | `-- FileName.test.ts` |

---

For more information, see [TESTING_README.md](./TESTING_README.md).
