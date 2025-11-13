// lib/api.ts

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080";

const API_KEY = process.env.NEXT_PUBLIC_API_KEY ?? "SECRET123";

function getDefaultHeaders(json: boolean = false): HeadersInit {
  const headers: HeadersInit = {
    "X-API-KEY": API_KEY,
  };
  if (json) {
    headers["Content-Type"] = "application/json";
  }
  return headers;
}

/* ---------- Tipos ---------- */

export interface CartItem {
  productId: number;
  productName: string;
  quantity: number;
}

export interface Cart {
  cartId: number;
  customerId: number;
  items: CartItem[];
}

export interface PaymentAttempt {
  attemptNumber: number;
  approved: boolean;
  message: string;
}

export interface OrderResponse {
  orderId: number;
  status: string;
  total: number;
  transactionUuid: string;
  attempts: PaymentAttempt[];
}

/* ---------- Endpoints ---------- */

export async function ping(): Promise<string> {
  console.log("API_BASE_URL en runtime:", API_BASE_URL);
  const res = await fetch(`${API_BASE_URL}/ping`, {
    method: "GET",
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`Error del servidor: ${res.status}`);
  }
  return res.text();
}

export async function getCart(customerId: number): Promise<Cart> {
  const res = await fetch(`${API_BASE_URL}/cart?customerId=${customerId}`, {
    method: "GET",
    headers: getDefaultHeaders(),
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Error al obtener carrito: ${res.status}`);
  }

  return res.json();
}

export async function addItemToCart(params: {
  customerId: number;
  productId: number;
  quantity: number;
}): Promise<Cart> {
  const res = await fetch(`${API_BASE_URL}/cart/items`, {
    method: "POST",
    headers: getDefaultHeaders(true),
    body: JSON.stringify(params),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Error al agregar item: ${res.status}`);
  }

  return res.json();
}

export async function tokenizeCard(params: {
  customerId: number;
  cardNumber: string;
  cvv: string;
  expDate: string;
}): Promise<{ token: string }> {
  const res = await fetch(`${API_BASE_URL}/tokens`, {
    method: "POST",
    headers: getDefaultHeaders(true),
    body: JSON.stringify(params),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Error al tokenizar tarjeta: ${res.status}`);
  }

  return res.json();
}

export async function checkoutCart(params: {
  customerId: number;
  deliveryAddress: string;
  cardToken: string;
}): Promise<OrderResponse> {
  const res = await fetch(`${API_BASE_URL}/cart/checkout`, {
    method: "POST",
    headers: getDefaultHeaders(true),
    body: JSON.stringify(params),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Error en checkout: ${res.status}`);
  }

  return res.json();
}
