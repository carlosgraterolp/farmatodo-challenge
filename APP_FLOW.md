# Farmatodo Challenge - Complete Application Flow

## ✅ Implemented Features

### 1. Landing Page (`/`)
- **Hero section** with animated beams
- **Dynamic navigation** - Shows "Iniciar sesión" when logged out, "Cerrar sesión" when logged in
- **Call-to-action buttons**:
  - "Ir a la tienda" - Links to product catalog
  - "Registrarse" - Links to auth page (only shown when not logged in)

### 2. Authentication (`/auth`)
- **Toggle between Login and Signup** forms
- **Login Form**:
  - Email and password only
  - Validates credentials against backend
  - Stores customer data in localStorage
  - Redirects to landing page on success
- **Signup Form**:
  - All required fields: firstName, lastName, email, phone, address, password
  - Validates unique email and phone number
  - Shows clear error messages
  - Redirects to landing page on success

### 3. Products/Shop Page (`/tienda`)
- **Product Grid** with search functionality
- **Add to Cart** with quantity selection (within stock limits)
- **Cart Summary** sticky footer showing:
  - All items with quantities and prices
  - Remove item functionality
  - Total price calculation
- **Proceed to Checkout** button
- **Logout** functionality in header

### 4. Checkout Page (`/checkout`)
- **Order Summary** section:
  - Lists all cart items with quantities and prices
  - Shows total amount
- **Payment Form** section:
  - Delivery address (pre-filled from customer profile)
  - Credit card details:
    - Card number (16 digits)
    - Expiration date (MM/YY)
    - CVV (3-4 digits)
- **Payment Processing Flow**:
  1. **Tokenization** - Sends card data to `/tokens` endpoint with API Key
  2. **Order Creation** - Sends order with tokenized card to `/orders` endpoint
  3. **Success Page** - Shows order details including:
     - Order ID
     - Transaction UUID
     - Payment attempts with approval/rejection status
     - Total amount
     - Email confirmation message
  4. **Auto-redirect** to shop after 5 seconds

## 🔧 Backend Configuration

### Environment Variables (Already Configured)
```bash
SPRING_PROFILES_ACTIVE=gcp
DB_URL=jdbc:postgresql://...
DB_USER=farmatodo_user
DB_PASS=@v0Te+<[%PIeD%sX
APP_API_KEY=SECRET123
ENCRYPTION_SECRET=1234567890123456
TOKENIZATION_REJECTION_PERCENTAGE=0
PAYMENT_REJECTION_PERCENTAGE=35
PAYMENT_MAX_RETRIES=3
```

### Key Backend Features
- ✅ **Card Tokenization** with configurable rejection rate
- ✅ **Payment Processing** with automatic retry logic (up to 3 attempts)
- ✅ **Email Notifications** for order success/failure
- ✅ **Transaction Logging** with unique UUID for each transaction
- ✅ **Stock Management** - Deducts from inventory on successful order
- ✅ **PostgreSQL Database** (Cloud SQL) with proper schema

## 🧪 Testing Guide

### Test the Complete Flow

1. **Start Frontend** (in `/frontend` directory):
   ```bash
   npm run dev
   ```
   Frontend runs on `http://localhost:3000`

2. **Backend is Live**:
   - URL: `https://farmatodo-backend-o7qbkd6ghq-uc.a.run.app`
   - API Key: `SECRET123`

### Test Scenarios

#### Scenario 1: New Customer Registration and Purchase
1. Open `http://localhost:3000`
2. Click "Registrarse"
3. Fill signup form with new email/phone
4. After registration, you're redirected to landing page (logged in)
5. Click "Ir a la tienda"
6. Search for "aspirina" or browse products
7. Add 2-3 products to cart
8. Click "Proceder al pago"
9. Fill payment form:
   - Card: `4111111111111111`
   - CVV: `123`
   - Exp: `12/25`
10. Submit payment
11. Observe payment attempts (may retry up to 3 times if rejected)
12. Check email for confirmation

#### Scenario 2: Returning Customer Login
1. Open `http://localhost:3000/auth`
2. Should see **Login form** by default
3. Enter email and password
4. Click "Iniciar sesión"
5. Redirected to landing page
6. Navbar shows "Cerrar sesión"

#### Scenario 3: Logout
1. When logged in, click "Cerrar sesión" (top right or in shop)
2. Customer data cleared from localStorage
3. Navbar now shows "Iniciar sesión"

#### Scenario 4: Payment Rejection and Retry
1. Complete a purchase (backend configured with 35% rejection rate)
2. On checkout success page, observe "Intentos de pago" section
3. You may see multiple attempts:
   - Attempt 1: ✗ Rechazado
   - Attempt 2: ✗ Rechazado
   - Attempt 3: ✓ Aprobado
4. Email sent with final status

### Testing Edge Cases

**Duplicate Email/Phone**:
- Try registering with existing email → Shows error
- Try registering with existing phone → Shows error

**Invalid Login**:
- Wrong password → Shows "Credenciales inválidas"
- Non-existent email → Shows "Credenciales inválidas"

**Empty Cart**:
- Navigate to `/checkout` without items → Redirects to `/tienda`

**Not Logged In**:
- Navigate to `/tienda` without auth → Redirects to `/auth`
- Navigate to `/checkout` without auth → Redirects to `/auth`

**Stock Validation**:
- Try adding more quantity than available stock → Alert shown
- Order creation validates stock before processing

## 📊 Payment Flow Details

### Tokenization (`POST /tokens`)
**Request**:
```json
{
  "customerId": 1,
  "cardNumber": "4111111111111111",
  "cvv": "123",
  "expDate": "12/25"
}
```

**Response**:
```json
{
  "token": "tok_abc123xyz"
}
```

**Rejection Logic**: Configured at 0% (always succeeds unless changed)

### Order Creation (`POST /orders`)
**Request**:
```json
{
  "customerId": 1,
  "deliveryAddress": "Calle 123, Caracas",
  "cardToken": "tok_abc123xyz",
  "items": [
    { "productId": 1, "quantity": 2 },
    { "productId": 4, "quantity": 1 }
  ]
}
```

**Response**:
```json
{
  "orderId": 42,
  "status": "COMPLETED",
  "total": 35.50,
  "transactionUuid": "550e8400-e29b-41d4-a716-446655440000",
  "attempts": [
    { "attemptNumber": 1, "approved": false, "message": "Pago rechazado" },
    { "attemptNumber": 2, "approved": true, "message": "Pago aprobado" }
  ]
}
```

**Payment Retry Logic**:
- Max retries: 3 (configurable via `PAYMENT_MAX_RETRIES`)
- Rejection rate: 35% (configurable via `PAYMENT_REJECTION_PERCENTAGE`)
- If all attempts fail → Order status = "FAILED", email sent
- If any attempt succeeds → Order status = "COMPLETED", stock deducted, email sent

## 🔐 Security Features

- ✅ **API Key Authentication** for sensitive endpoints
- ✅ **Password stored in plain text** (demo - production should use BCrypt)
- ✅ **Card number encryption** before tokenization (AES-128)
- ✅ **CORS configured** for frontend access
- ✅ **Spring Security** with stateless sessions
- ✅ **Public endpoints**: `/auth/**`, `GET /products/**`, `/actuator/health`
- ✅ **Protected endpoints**: `/orders`, `/tokens`, `/cart/**`

## 📧 Email Notifications

The backend sends emails via SMTP on:
- ✅ **Order Success**: Order confirmation with details
- ✅ **Order Failure**: All payment attempts failed notification

**SMTP Configuration** (from `application.properties`):
```properties
spring.mail.host=localhost
spring.mail.port=2525
```

For production, configure with real SMTP service (SendGrid, Mailgun, etc.)

## 🗄️ Database Schema

### Key Tables
- **customers**: User accounts (firstName, lastName, email, phone, address, password)
- **products**: Product catalog (name, description, price, stock)
- **orders**: Order records with status and total
- **order_items**: Line items for each order
- **card_tokens**: Encrypted card tokens
- **payment_attempts**: All payment attempts with approval status
- **transaction_logs**: Audit trail with UUIDs

### Unique Constraints
- `customers.email` - Unique
- `customers.phone` - Unique

## 🚀 Deployment Status

- ✅ **Backend**: Deployed to GCP Cloud Run
  - URL: `https://farmatodo-backend-o7qbkd6ghq-uc.a.run.app`
  - Database: Cloud SQL PostgreSQL
  - Health: `https://farmatodo-backend-o7qbkd6ghq-uc.a.run.app/actuator/health`

- ⏳ **Frontend**: Running locally on port 3000
  - To deploy: Use Vercel, Netlify, or Cloud Run

## 📝 Next Steps

1. **Test end-to-end flow** with real orders
2. **Verify email notifications** are being sent
3. **Check transaction logs** in database
4. **Deploy frontend** to production
5. **Configure production SMTP** for emails
6. **Add password hashing** (BCrypt) for production
7. **Set up monitoring** and alerts
8. **Add frontend loading states** and error boundaries
9. **Implement order history** page for customers
10. **Add admin dashboard** for order management

## 🐛 Known Issues / TODOs

- [ ] Email notifications may fail if SMTP not configured
- [ ] Password stored in plain text (demo only)
- [ ] No order history page yet
- [ ] No admin interface
- [ ] No product images (using gradient placeholders)
- [ ] No real-time stock updates
- [ ] Cart persists only in localStorage (lost on logout)

## 📞 Support

For issues or questions:
1. Check backend logs: `gcloud run services logs read farmatodo-backend --region us-central1`
2. Check frontend console for errors
3. Verify API_BASE_URL in `.env.local`
4. Test backend health endpoint
