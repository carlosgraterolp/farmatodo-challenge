/**
 * API client functions for backend communication
 */

import { API_BASE_URL, API_KEY } from "@/constants";

/** Customer registration payload */
export type CustomerPayload = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  password: string;
};

/** Customer response from API */
export type CustomerResponse = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  createdAt: string;
};

/** Register a new customer */
export async function registerCustomer(
  payload: CustomerPayload
): Promise<CustomerResponse> {
  const res = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    let errorMessage = `Error al registrarse. Código ${res.status}`;
    try {
      const data = await res.json();
      if (data.message) {
        errorMessage = data.message;
      }
    } catch {
      // Ignore JSON parse errors
    }
    throw new Error(errorMessage);
  }

  return (await res.json()) as CustomerResponse;
}

/** Login payload */
export type LoginPayload = {
  email: string;
  password: string;
};

/** Login existing customer */
export async function loginCustomer(
  payload: LoginPayload
): Promise<CustomerResponse> {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    let errorMessage = `Error al iniciar sesión. Código ${res.status}`;
    try {
      const data = await res.json();
      if (data.message) {
        errorMessage = data.message;
      }
    } catch {
      // Ignore JSON parse errors
    }
    throw new Error(errorMessage);
  }

  return (await res.json()) as CustomerResponse;
}
