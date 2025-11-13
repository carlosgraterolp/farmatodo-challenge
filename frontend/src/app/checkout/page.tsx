"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
}

interface CartItem {
  product: Product;
  quantity: number;
}

interface Customer {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  address: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [deliveryAddress, setDeliveryAddress] = useState("");
  
  // Card details
  const [cardNumber, setCardNumber] = useState("");
  const [cvv, setCvv] = useState("");
  const [expDate, setExpDate] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [orderDetails, setOrderDetails] = useState<any>(null);

  useEffect(() => {
    // Load customer and cart from localStorage
    const customerData = localStorage.getItem("customer");
    const cartData = localStorage.getItem("cart");

    if (!customerData) {
      router.push("/auth");
      return;
    }

    if (!cartData) {
      router.push("/tienda");
      return;
    }

    const parsedCustomer = JSON.parse(customerData);
    setCustomer(parsedCustomer);
    setDeliveryAddress(parsedCustomer.address || "");
    setCart(JSON.parse(cartData));
  }, [router]);

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!customer) {
      setError("No hay cliente autenticado");
      setLoading(false);
      return;
    }

    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";
      const API_KEY = process.env.NEXT_PUBLIC_API_KEY || "SECRET123";

      // Step 1: Tokenize card
      const tokenizeResponse = await fetch(`${API_BASE_URL}/tokens`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": API_KEY,
        },
        body: JSON.stringify({
          customerId: customer.id,
          cardNumber,
          cvv,
          expDate,
        }),
      });

      if (!tokenizeResponse.ok) {
        const errorData = await tokenizeResponse.json().catch(() => ({}));
        throw new Error(errorData.message || "Error al tokenizar la tarjeta");
      }

      const { token } = await tokenizeResponse.json();

      // Step 2: Create order
      const orderResponse = await fetch(`${API_BASE_URL}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": API_KEY,
        },
        body: JSON.stringify({
          customerId: customer.id,
          deliveryAddress,
          cardToken: token,
          items: cart.map(item => ({
            productId: item.product.id,
            quantity: item.quantity,
          })),
        }),
      });

      if (!orderResponse.ok) {
        const errorData = await orderResponse.json().catch(() => ({}));
        throw new Error(errorData.message || "Error al crear la orden");
      }

      const orderData = await orderResponse.json();
      setOrderDetails(orderData);
      setSuccess(true);

      // Clear cart
      localStorage.removeItem("cart");

      // Show success message and redirect after delay
      setTimeout(() => {
        router.push("/tienda");
      }, 5000);
    } catch (err) {
      console.error("Error processing payment:", err);
      setError(err instanceof Error ? err.message : "Error al procesar el pago");
    } finally {
      setLoading(false);
    }
  };

  if (!customer) {
    return null;
  }

  if (success && orderDetails) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-100 p-8 dark:from-gray-900 dark:to-gray-800">
        <div className="mx-auto max-w-2xl">
          <div className="rounded-lg border border-green-200 bg-white p-8 shadow-lg dark:border-green-800 dark:bg-gray-800">
            <div className="mb-4 text-center">
              <div className="mb-4 text-6xl">
                {orderDetails.status === "COMPLETED" ? "✅" : "⏳"}
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {orderDetails.status === "COMPLETED" 
                  ? "¡Pedido realizado con éxito!"
                  : "Pedido en proceso"}
              </h2>
            </div>

            <div className="space-y-4">
              <div className="border-t border-gray-200 pt-4 dark:border-gray-700">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Número de orden: <span className="font-semibold">{orderDetails.orderId}</span>
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  ID de transacción: <span className="font-mono text-xs">{orderDetails.transactionUuid}</span>
                </p>
                <p className="mt-2 text-lg font-bold text-gray-900 dark:text-white">
                  Total: ${orderDetails.total}
                </p>
              </div>

              {orderDetails.attempts && orderDetails.attempts.length > 0 && (
                <div className="border-t border-gray-200 pt-4 dark:border-gray-700">
                  <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
                    Intentos de pago:
                  </h3>
                  {orderDetails.attempts.map((attempt: any, idx: number) => (
                    <div key={idx} className="mb-2 text-sm">
                      <span className="font-medium">Intento {attempt.attemptNumber}:</span>{" "}
                      <span className={attempt.approved ? "text-green-600" : "text-red-600"}>
                        {attempt.approved ? "✓ Aprobado" : "✗ Rechazado"}
                      </span>
                      {attempt.message && <span className="text-gray-600"> - {attempt.message}</span>}
                    </div>
                  ))}
                </div>
              )}

              <p className="text-sm text-gray-600 dark:text-gray-400">
                Recibirás un correo electrónico de confirmación en breve.
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500">
                Redirigiendo a la tienda en 5 segundos...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100 p-4 dark:from-gray-900 dark:to-gray-800">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Checkout</h1>
          <button
            onClick={() => router.push("/tienda")}
            className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
          >
            ← Volver a la tienda
          </button>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Cart Summary */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
              Resumen del pedido
            </h2>
            <div className="space-y-4">
              {cart.map((item) => (
                <div key={item.product.id} className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {item.product.name}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Cantidad: {item.quantity} × ${item.product.price.toFixed(2)}
                    </p>
                  </div>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-6 border-t border-gray-200 pt-4 dark:border-gray-700">
              <div className="flex items-center justify-between text-xl font-bold">
                <span className="text-gray-900 dark:text-white">Total:</span>
                <span className="text-orange-500">${getTotalPrice().toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
              Información de pago
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                  Dirección de entrega
                </label>
                <input
                  type="text"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                  Número de tarjeta
                </label>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value.replace(/\s/g, ""))}
                  placeholder="1234 5678 9012 3456"
                  required
                  maxLength={16}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                    Fecha de expiración
                  </label>
                  <input
                    type="text"
                    value={expDate}
                    onChange={(e) => setExpDate(e.target.value)}
                    placeholder="MM/YY"
                    required
                    maxLength={5}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                    CVV
                  </label>
                  <input
                    type="text"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value)}
                    placeholder="123"
                    required
                    maxLength={4}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>

              {error && (
                <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-orange-500 px-6 py-3 font-semibold text-white hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Procesando pago..." : `Pagar $${getTotalPrice().toFixed(2)}`}
              </button>

              <p className="text-center text-xs text-gray-500 dark:text-gray-400">
                Tu información de pago está protegida y encriptada
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
