# Testing Guide - Farmatodo Challenge

## Overview

This project includes comprehensive unit tests for both backend and frontend components, achieving strong coverage of business logic and critical functionality.

## Test Statistics

### Backend
- **Test Files**: 6
- **Test Cases**: 39 (all passing)
- **Framework**: JUnit 5, Mockito, Spring Test
- **Coverage**: ~70-80% of critical business logic

### Frontend
- **Test Files**: 2
- **Test Cases**: 12 (all passing)
- **Framework**: Jest, React Testing Library
- **Coverage**: 100% of API and utility functions

## Running Tests

### Backend Tests

```bash
# Navigate to backend directory
cd backend

# Run all tests
./gradlew test

# Run tests with info
./gradlew test --info

# Run specific test class
./gradlew test --tests "OrderServiceImplTest"

# Clean and test
./gradlew clean test
```

### Frontend Tests

```bash
# Navigate to frontend directory
cd frontend

# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## Test Files

### Backend (`backend/src/test/java/`)

```
com/farmatodo/reto/
├── service/impl/
│   ├── OrderServiceImplTest.java      (9 tests)
│   ├── CartServiceImplTest.java       (11 tests)
│   ├── ProductServiceImplTest.java    (6 tests)
│   ├── TokenizationServiceImplTest.java (5 tests)
│   └── PaymentServiceImplTest.java    (3 tests)
└── util/
    └── CryptoUtilTest.java            (5 tests)
```

### Frontend (`frontend/src/`)

```
lib/__tests__/
├── api.test.ts    (7 tests - authentication API)
└── utils.test.ts  (5 tests - utility functions)
```

## What's Tested

### Backend ✅

#### OrderServiceImpl
- ✅ Order creation with successful payment on first attempt
- ✅ Order creation with payment failures and retry logic
- ✅ Payment success on Nth retry
- ✅ Product validation (not found, insufficient stock)
- ✅ Stock deduction after successful order
- ✅ Multi-item order total calculation
- ✅ Notification triggers (success/failure)
- ✅ Transaction logging

#### CartServiceImpl
- ✅ Cart retrieval (existing cart)
- ✅ Cart creation (new cart)
- ✅ Item upsert (add new item)
- ✅ Item upsert (update existing item)
- ✅ Item removal
- ✅ Cart clearing
- ✅ Checkout flow
- ✅ Error handling (cart not found, product not found, empty cart)

#### ProductServiceImpl
- ✅ Product search with matching terms
- ✅ Null query handling
- ✅ Empty results
- ✅ Minimum stock filtering
- ✅ Search term trimming
- ✅ Async search logging

#### TokenizationServiceImpl
- ✅ Successful tokenization
- ✅ Card data encryption
- ✅ Customer ID persistence
- ✅ Rejection simulation (configurable)
- ✅ Unique token generation

#### PaymentServiceImpl
- ✅ Payment with 0% rejection (always approves)
- ✅ Payment with 100% rejection (always rejects)
- ✅ Probabilistic behavior with partial rejection

#### CryptoUtil
- ✅ AES encryption functionality
- ✅ Different outputs for different inputs
- ✅ Consistent outputs for same inputs
- ✅ Base64 encoding validation
- ✅ Invalid secret error handling

### Frontend ✅

#### API Functions (`api.ts`)
- ✅ Customer registration success
- ✅ Customer registration failure with error message
- ✅ Network error handling during registration
- ✅ Customer login success
- ✅ Login failure with error message
- ✅ Server error handling during login
- ✅ Fetch API integration

#### Utilities (`utils.ts`)
- ✅ Class name merging
- ✅ Conditional class handling
- ✅ Tailwind class conflict resolution
- ✅ Empty input handling
- ✅ Null/undefined value handling

## Coverage Details

### Backend Coverage
The backend tests focus on the service layer where all business logic resides:

- **OrderService**: ~95% - All order creation paths, payment retries, validations
- **CartService**: ~90% - Cart operations, checkout flow, error scenarios
- **ProductService**: ~85% - Search, filtering, logging
- **TokenizationService**: ~90% - Tokenization, encryption, rejection simulation
- **PaymentService**: ~80% - Payment processing with various rejection rates
- **CryptoUtil**: ~100% - Encryption utility

**Note**: Controller tests were not included due to Spring Security configuration complexity in the test environment. The service layer tests provide comprehensive coverage of business logic.

### Frontend Coverage
The frontend tests achieve 100% coverage of non-UI code:

- **API functions**: 100% statements, 91.66% branches
- **Utility functions**: 100% coverage

**Note**: UI components (pages, forms) are not tested as they would require extensive mocking of Next.js router, React hooks, and localStorage.

## Test Quality

### Backend
- ✅ Unit tests with mocked dependencies (Mockito)
- ✅ Positive and negative test scenarios
- ✅ Edge case handling
- ✅ Error condition testing
- ✅ Async operation verification
- ✅ Transactional behavior testing

### Frontend
- ✅ Mocked fetch API
- ✅ Success and failure scenarios
- ✅ Error message verification
- ✅ Network error simulation
- ✅ Function behavior validation

## Continuous Integration

These tests are designed to run in CI/CD pipelines:

```yaml
# Example CI configuration
backend-tests:
  script:
    - cd backend
    - ./gradlew test

frontend-tests:
  script:
    - cd frontend
    - npm ci
    - npm test
```

## Future Enhancements

### Backend
1. Integration tests with `@SpringBootTest`
2. Repository tests with H2 database
3. Controller tests with security mocking
4. Performance/load tests

### Frontend
1. Component tests (LoginForm, SignupForm, etc.)
2. Page tests with Next.js router mocking
3. E2E tests with Cypress/Playwright
4. Accessibility tests

## Troubleshooting

### Backend

**Issue**: Tests fail to compile
```bash
# Solution: Clean build
./gradlew clean build
```

**Issue**: Tests pass locally but fail in CI
```bash
# Solution: Check Java version
./gradlew --version
```

### Frontend

**Issue**: Jest configuration errors
```bash
# Solution: Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

**Issue**: Module resolution errors
```bash
# Solution: Clear Jest cache
npm test -- --clearCache
```

## Contact & Support

For questions about the tests or to report issues, refer to the main project documentation.
