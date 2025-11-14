/**
 * Shared TypeScript type definitions for the application
 */

/** Product entity from the API */
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
}

/** Cart item containing product and quantity */
export interface CartItem {
  product: Product;
  quantity: number;
}

/** Customer/user entity */
export interface Customer {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  createdAt?: string;
}

/** Order details returned after checkout */
export interface OrderDetails {
  orderId: number;
  status: string;
  total: number;
  transactionUuid: string;
  attempts?: PaymentAttempt[];
}

/** Payment attempt result */
export interface PaymentAttempt {
  attemptNumber: number;
  approved: boolean;
  message: string;
}

