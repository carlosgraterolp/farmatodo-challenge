// src/lib/api.ts
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080";

const API_KEY = process.env.NEXT_PUBLIC_API_KEY ?? "SECRET123";

export type CustomerPayload = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  password: string;
};

export type CustomerResponse = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  createdAt: string;
};

export async function registerCustomer(
  payload: CustomerPayload
): Promise<CustomerResponse> {
  const res = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-KEY": API_KEY, // 👈 AQUI se envía
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
      // ignore parse error
    }
    throw new Error(errorMessage);
  }

  return (await res.json()) as CustomerResponse;
}
