/**
 * Application-wide constants
 */

/** Backend API base URL */
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080";

/** API key for authenticated requests */
export const API_KEY = process.env.NEXT_PUBLIC_API_KEY ?? "SECRET123";

/** localStorage keys for persisting data */
export const STORAGE_KEYS = {
  CUSTOMER: "customer",
  CART: "cart",
} as const;

/** Application route paths */
export const ROUTES = {
  HOME: "/",
  AUTH: "/auth",
  STORE: "/store",
  CART: "/cart",
  CHECKOUT: "/checkout",
} as const;
