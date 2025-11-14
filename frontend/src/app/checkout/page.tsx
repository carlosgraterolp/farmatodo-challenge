/**
 * Checkout page - payment form and order processing
 */

"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import {
  IconCreditCard,
  IconMapPin,
  IconX,
  IconLoader,
  IconCalendar,
  IconLock,
} from "@tabler/icons-react";
import { Input } from "@/components/ui/input";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { LoadingSpinner } from "@/components/common/loading-spinner";
import { PageHeader } from "@/components/common/page-header";
import { OrderSummary } from "@/components/cart/order-summary";
import { OrderSuccess } from "@/components/checkout/order-success";
import { OrderDetails } from "@/types";
import {
  formatCardNumber,
  formatExpDate,
  validateCardNumber,
  validateExpDate,
  validateCVV,
} from "@/utils/payment";
import { getTotalPrice, clearCartFromStorage } from "@/utils/cart";
import { API_BASE_URL, API_KEY, ROUTES } from "@/constants";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, loading: cartLoading, mounted: cartMounted } = useCart();
  const { customer, loading: authLoading, mounted: authMounted } = useAuth();
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [loading, setLoading] = useState(true);

  // Payment form state
  const [cardNumber, setCardNumber] = useState("");
  const [cvv, setCvv] = useState("");
  const [expDate, setExpDate] = useState("");

  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);

  // Initialize delivery address and validate authentication/cart
  useEffect(() => {
    if (authMounted && !customer) {
      router.push(ROUTES.AUTH);
      return;
    }

    if (cartMounted && cart.length === 0) {
      router.push(ROUTES.STORE);
      return;
    }

    if (authMounted && cartMounted && customer) {
      setDeliveryAddress(customer.address || "");
      setLoading(false);
    }
  }, [router, customer, cart, authMounted, cartMounted]);

  /** Format card number input as user types */
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    setCardNumber(formatted);
  };

  /** Format expiration date input as user types */
  const handleExpDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpDate(e.target.value);
    setExpDate(formatted);
  };

  /** Process payment: tokenize card, create order, handle response */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setProcessing(true);

    if (!customer) {
      setError("No hay cliente autenticado");
      setProcessing(false);
      return;
    }

    // Validate card number
    const cleanCardNumber = cardNumber.replace(/\s/g, "");
    if (!validateCardNumber(cardNumber)) {
      setError("El número de tarjeta debe tener 16 dígitos");
      setProcessing(false);
      return;
    }

    // Validate expiration date
    const expDateValidation = validateExpDate(expDate);
    if (!expDateValidation.valid) {
      setError(expDateValidation.error || "Fecha de expiración inválida");
      setProcessing(false);
      return;
    }

    // Validate CVV
    if (!validateCVV(cvv)) {
      setError("El CVV debe tener 3 o 4 dígitos");
      setProcessing(false);
      return;
    }

    try {
      // Step 1: Tokenize card for secure payment processing
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

      // Step 2: Create order with tokenized card
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
      clearCartFromStorage();
      window.dispatchEvent(new Event("cartUpdated"));

      // Redirect after delay
      setTimeout(() => {
        router.push(ROUTES.STORE);
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

  // Show loading until both hooks have mounted to prevent hydration mismatch
  if (loading || authLoading || cartLoading || !authMounted || !cartMounted) {
    return (
      <>
        <AuroraBackground className="-z-10 overflow-hidden" />
        <LoadingSpinner message="Cargando..." />
      </>
    );
  }

  if (!customer || cart.length === 0) {
    return null;
  }

  if (success && orderDetails) {
    return (
      <>
        <AuroraBackground className="-z-10 overflow-hidden" />
        <div className="relative min-h-screen">
          <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
            <OrderSuccess orderDetails={orderDetails} />
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <AuroraBackground className="overflow-hidden -z-10" />
      <div className="relative min-h-screen">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <PageHeader
            title="Checkout"
            description="Completa tu información de pago para finalizar tu pedido"
            backButton={{
              label: "Volver al carrito",
              href: ROUTES.CART,
            }}
          />

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Payment Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="rounded-2xl bg-white p-6 shadow-md dark:bg-zinc-900/95 dark:backdrop-blur-sm dark:border dark:border-zinc-800/50">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-100 dark:bg-zinc-800/80 dark:border dark:border-zinc-700/30">
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
                  className="w-full rounded-md bg-white px-6 py-4 text-sm font-bold text-black shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] transition duration-200 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 dark:bg-zinc-800/90 dark:text-white dark:backdrop-blur-sm dark:border dark:border-zinc-700/50"
                >
                  {processing ? (
                    <span className="flex items-center justify-center gap-2">
                      <IconLoader className="h-5 w-5 animate-spin" />
                      Procesando pago...
                    </span>
                  ) : (
                    `Pagar $${getTotalPrice(cart).toFixed(2)}`
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
            <OrderSummary
              cart={cart}
              showContinueShopping={false}
            />
          </div>
        </div>
      </div>
      </div>
    </>
  );
}
