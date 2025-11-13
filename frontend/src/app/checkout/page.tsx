"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import {
  IconArrowLeft,
  IconCreditCard,
  IconMapPin,
  IconCheck,
  IconX,
  IconLoader,
  IconShoppingBag,
  IconCalendar,
  IconLock,
} from "@tabler/icons-react";
import { Input } from "@/components/ui/input";

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
  const [loading, setLoading] = useState(true);

  // Card details
  const [cardNumber, setCardNumber] = useState("");
  const [cvv, setCvv] = useState("");
  const [expDate, setExpDate] = useState("");

  const [processing, setProcessing] = useState(false);
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
      router.push("/store");
      return;
    }

    const parsedCustomer = JSON.parse(customerData);
    setCustomer(parsedCustomer);
    setDeliveryAddress(parsedCustomer.address || "");
    setCart(JSON.parse(cartData));
    setLoading(false);
  }, [router]);

  // Format card number with spaces every 4 digits
  const formatCardNumber = (value: string) => {
    // Remove all non-digits
    const cleaned = value.replace(/\D/g, "");
    // Limit to 16 digits
    const limited = cleaned.slice(0, 16);
    // Add space every 4 digits using a more reliable method
    const parts: string[] = [];
    for (let i = 0; i < limited.length; i += 4) {
      parts.push(limited.slice(i, i + 4));
    }
    return parts.join(" ");
  };

  // Handle card number input change
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    setCardNumber(formatted);
  };

  // Format expiration date as MM/YY
  const formatExpDate = (value: string) => {
    // Remove all non-digits
    const cleaned = value.replace(/\D/g, "");

    // Limit to 4 digits
    const limited = cleaned.slice(0, 4);

    if (limited.length === 0) {
      return "";
    } else if (limited.length === 1) {
      // Single digit: return as is
      return limited;
    } else if (limited.length === 2) {
      // Two digits: format as MM/
      return `${limited}/`;
    } else {
      // 3 or 4 digits: format as MM/YY
      const month = limited.slice(0, 2);
      const year = limited.slice(2, 4);
      return `${month}/${year}`;
    }
  };

  // Handle expiration date input change
  const handleExpDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpDate(e.target.value);
    setExpDate(formatted);
  };

  const getTotalPrice = () => {
    return cart.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const getImageUrl = (productName: string) => {
    return `https://placehold.co/400x400/404040/ffffff?text=${encodeURIComponent(
      productName
    )}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setProcessing(true);

    if (!customer) {
      setError("No hay cliente autenticado");
      setProcessing(false);
      return;
    }

    // Validate card number (must be 16 digits)
    const cleanCardNumber = cardNumber.replace(/\s/g, "");
    if (cleanCardNumber.length !== 16 || !/^\d{16}$/.test(cleanCardNumber)) {
      setError("El número de tarjeta debe tener 16 dígitos");
      setProcessing(false);
      return;
    }

    // Validate expiration date (MM/YY format, month 01-12)
    if (!/^\d{2}\/\d{2}$/.test(expDate)) {
      setError("La fecha de expiración debe tener el formato MM/YY");
      setProcessing(false);
      return;
    }
    const month = parseInt(expDate.slice(0, 2), 10);
    if (month < 1 || month > 12) {
      setError("El mes debe estar entre 01 y 12");
      setProcessing(false);
      return;
    }

    // Validate CVV (must be 3 or 4 digits)
    if (!/^\d{3,4}$/.test(cvv)) {
      setError("El CVV debe tener 3 o 4 dígitos");
      setProcessing(false);
      return;
    }

    try {
      const API_BASE_URL =
        process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";
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
          cardNumber: cleanCardNumber,
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
          items: cart.map((item) => ({
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

      // Clear cart and dispatch event
      localStorage.removeItem("cart");
      window.dispatchEvent(new Event("cartUpdated"));

      // Redirect after delay
      setTimeout(() => {
        router.push("/store");
      }, 5000);
    } catch (err) {
      console.error("Error processing payment:", err);
      setError(
        err instanceof Error ? err.message : "Error al procesar el pago"
      );
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <div className="mb-4 inline-block animate-spin rounded-full h-8 w-8 border-4 border-neutral-300 border-t-neutral-800 dark:border-neutral-700 dark:border-t-neutral-200"></div>
          <p className="text-neutral-600 dark:text-neutral-400">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!customer || cart.length === 0) {
    return null;
  }

  if (success && orderDetails) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="rounded-2xl bg-white p-8 shadow-md dark:bg-neutral-900"
          >
            <div className="mb-6 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30"
              >
                {orderDetails.status === "COMPLETED" ? (
                  <IconCheck className="h-10 w-10 text-green-600 dark:text-green-400" />
                ) : (
                  <IconLoader className="h-10 w-10 animate-spin text-orange-600 dark:text-orange-400" />
                )}
              </motion.div>
              <h2 className="mb-2 text-3xl font-bold text-neutral-800 dark:text-neutral-100">
                {orderDetails.status === "COMPLETED"
                  ? "¡Pedido realizado con éxito!"
                  : "Pedido en proceso"}
              </h2>
              <p className="text-neutral-600 dark:text-neutral-400">
                {orderDetails.status === "COMPLETED"
                  ? "Tu pedido ha sido confirmado y procesado correctamente"
                  : "Estamos procesando tu pedido, por favor espera..."}
              </p>
            </div>

            <div className="space-y-6 border-t border-neutral-200 pt-6 dark:border-neutral-700">
              <div className="rounded-lg bg-neutral-50 p-4 dark:bg-neutral-800">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-600 dark:text-neutral-400">
                      Número de orden:
                    </span>
                    <span className="font-semibold text-neutral-800 dark:text-neutral-100">
                      {orderDetails.orderId}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-600 dark:text-neutral-400">
                      ID de transacción:
                    </span>
                    <span className="font-mono text-xs text-neutral-800 dark:text-neutral-100">
                      {orderDetails.transactionUuid}
                    </span>
                  </div>
                  <div className="mt-4 flex items-center justify-between border-t border-neutral-200 pt-4 dark:border-neutral-700">
                    <span className="text-lg font-bold text-neutral-800 dark:text-neutral-100">
                      Total:
                    </span>
                    <span className="text-2xl font-bold text-neutral-800 dark:text-neutral-100">
                      ${orderDetails.total}
                    </span>
                  </div>
                </div>
              </div>

              {orderDetails.attempts && orderDetails.attempts.length > 0 && (
                <div className="rounded-lg bg-neutral-50 p-4 dark:bg-neutral-800">
                  <h3 className="mb-3 text-sm font-semibold text-neutral-800 dark:text-neutral-100">
                    Intentos de pago:
                  </h3>
                  <div className="space-y-2">
                    {orderDetails.attempts.map((attempt: any, idx: number) => (
                      <div
                        key={idx}
                        className="rounded-lg bg-white p-3 dark:bg-neutral-900"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                            Intento {attempt.attemptNumber}
                          </span>
                          <div className="flex items-center gap-2">
                            {attempt.approved ? (
                              <IconCheck className="h-5 w-5 text-green-600 dark:text-green-400" />
                            ) : (
                              <IconX className="h-5 w-5 text-red-600 dark:text-red-400" />
                            )}
                            <span
                              className={`text-sm font-semibold ${
                                attempt.approved
                                  ? "text-green-600 dark:text-green-400"
                                  : "text-red-600 dark:text-red-400"
                              }`}
                            >
                              {attempt.approved ? "Aprobado" : "Rechazado"}
                            </span>
                          </div>
                        </div>
                        {attempt.message && (
                          <p className="mt-2 text-xs text-neutral-500 dark:text-neutral-400">
                            {attempt.message}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  Recibirás un correo electrónico de confirmación en breve.
                </p>
              </div>

              <div className="text-center">
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  Redirigiendo a la tienda en 5 segundos...
                </p>
                <button
                  onClick={() => router.push("/store")}
                  className="mt-4 rounded-md bg-white px-6 py-3 text-sm font-bold text-black shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] transition duration-200 hover:-translate-y-0.5 dark:bg-neutral-800 dark:text-white"
                >
                  <IconShoppingBag className="mr-2 inline h-4 w-4" />
                  Volver a la tienda
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-bold text-neutral-800 dark:text-neutral-100">
              Checkout
            </h1>
            <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
              Completa tu información de pago para finalizar tu pedido
            </p>
          </motion.div>
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            onClick={() => router.push("/cart")}
            className="flex items-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-bold text-black shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] transition duration-200 hover:-translate-y-0.5 dark:bg-neutral-800 dark:text-white"
          >
            <IconArrowLeft className="h-4 w-4" />
            Volver al carrito
          </motion.button>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Payment Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="rounded-2xl bg-white p-6 shadow-md dark:bg-neutral-900">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-100 dark:bg-neutral-800">
                  <IconCreditCard className="h-5 w-5 text-neutral-600 dark:text-neutral-400" />
                </div>
                <h2 className="text-2xl font-bold text-neutral-800 dark:text-neutral-100">
                  Información de pago
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                    <IconMapPin className="h-4 w-4" />
                    Dirección de entrega
                  </label>
                  <Input
                    type="text"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder="Ingresa tu dirección de entrega"
                    required
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                    <IconCreditCard className="h-4 w-4" />
                    Número de tarjeta
                  </label>
                  <Input
                    type="tel"
                    inputMode="numeric"
                    value={cardNumber}
                    onChange={handleCardNumberChange}
                    placeholder="1234 5678 9012 3456"
                    required
                    maxLength={19}
                    pattern="[0-9\s]{13,19}"
                    className="w-full tracking-wider"
                  />
                  <p className="mt-1 pl-[14px] text-xs text-neutral-500 dark:text-neutral-400">
                    Formato: 4 dígitos seguidos de un espacio
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                      <IconCalendar className="h-4 w-4" />
                      Fecha de expiración
                    </label>
                    <Input
                      type="tel"
                      inputMode="numeric"
                      value={expDate}
                      onChange={handleExpDateChange}
                      placeholder="MM/YY"
                      required
                      maxLength={5}
                      pattern="(0[1-9]|1[0-2])\/[0-9]{2}"
                      className="w-full"
                    />
                    <p className="mt-1 pl-[14px] text-xs text-neutral-500 dark:text-neutral-400">
                      Formato: MM/YY
                    </p>
                  </div>
                  <div>
                    <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                      <IconLock className="h-4 w-4" />
                      CVV
                    </label>
                    <Input
                      type="password"
                      inputMode="numeric"
                      value={cvv}
                      onChange={(e) =>
                        setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))
                      }
                      placeholder="123"
                      required
                      maxLength={4}
                      pattern="[0-9]{3,4}"
                      className="w-full"
                    />
                    <p className="mt-1 pl-[14px] text-xs text-neutral-500 dark:text-neutral-400">
                      3 o 4 dígitos
                    </p>
                  </div>
                </div>

                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex items-center gap-3 rounded-lg bg-red-50 p-4 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400"
                    >
                      <IconX className="h-5 w-5 shrink-0" />
                      <span>{error}</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                <button
                  type="submit"
                  disabled={processing}
                  className="w-full rounded-md bg-white px-6 py-4 text-sm font-bold text-black shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] transition duration-200 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 dark:bg-neutral-800 dark:text-white"
                >
                  {processing ? (
                    <span className="flex items-center justify-center gap-2">
                      <IconLoader className="h-5 w-5 animate-spin" />
                      Procesando pago...
                    </span>
                  ) : (
                    `Pagar $${getTotalPrice().toFixed(2)}`
                  )}
                </button>

                <p className="text-center text-xs text-neutral-500 dark:text-neutral-400">
                  🔒 Tu información de pago está protegida y encriptada
                </p>
              </form>
            </div>
          </motion.div>

          {/* Order Summary */}
          <div className="lg:sticky lg:top-24 lg:h-fit">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="rounded-2xl bg-white p-6 shadow-md dark:bg-neutral-900"
            >
              <h2 className="mb-6 text-xl font-bold text-neutral-800 dark:text-neutral-100">
                Resumen del Pedido
              </h2>

              <div className="mb-4 space-y-3 max-h-96 overflow-y-auto">
                <AnimatePresence>
                  {cart.map((item, index) => (
                    <motion.div
                      key={item.product.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex gap-3 rounded-lg bg-neutral-50 p-3 dark:bg-neutral-800"
                    >
                      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-neutral-100 dark:bg-neutral-700">
                        <img
                          src={getImageUrl(item.product.name)}
                          alt={item.product.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-neutral-800 dark:text-neutral-100 truncate">
                          {item.product.name}
                        </h3>
                        <p className="text-xs text-neutral-600 dark:text-neutral-400">
                          {item.quantity} × ${item.product.price.toFixed(2)}
                        </p>
                        <p className="mt-1 text-sm font-bold text-neutral-800 dark:text-neutral-100">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              <div className="space-y-4 border-t border-neutral-200 pt-4 dark:border-neutral-700">
                <div className="flex justify-between text-sm text-neutral-600 dark:text-neutral-400">
                  <span>Productos ({getTotalItems()})</span>
                  <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                    ${getTotalPrice().toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm text-neutral-600 dark:text-neutral-400">
                  <span>Envío</span>
                  <span className="font-semibold text-green-600 dark:text-green-400">
                    Gratis
                  </span>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-neutral-200 pt-4 dark:border-neutral-700">
                <span className="text-lg font-bold text-neutral-800 dark:text-neutral-100">
                  Total
                </span>
                <span className="text-2xl font-bold text-neutral-800 dark:text-neutral-100">
                  ${getTotalPrice().toFixed(2)}
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
