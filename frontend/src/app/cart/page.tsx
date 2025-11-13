"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import {
  IconShoppingBag,
  IconX,
  IconTrash,
  IconArrowLeft,
  IconShoppingCart,
} from "@tabler/icons-react";
import { AuroraBackground } from "@/components/ui/aurora-background";

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

export default function CartPage() {
  const router = useRouter();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const customerData = localStorage.getItem("customer");
    if (!customerData) {
      router.push("/auth");
      return;
    }

    // Load cart from localStorage
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
    setLoading(false);
  }, [router]);

  const updateQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart((prevCart) => {
      const updatedCart = prevCart.map((item) => {
        if (item.product.id === productId) {
          const validQuantity = Math.min(newQuantity, item.product.stock);
          return { ...item, quantity: validQuantity };
        }
        return item;
      });
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      return updatedCart;
    });
  };

  const removeFromCart = (productId: number) => {
    setCart((prevCart) => {
      const updatedCart = prevCart.filter(
        (item) => item.product.id !== productId
      );
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      return updatedCart;
    });
  };

  // Dispatch cart updated event after cart state changes
  useEffect(() => {
    // Use setTimeout to defer the event dispatch to after render completes
    const timeoutId = setTimeout(() => {
      window.dispatchEvent(new Event("cartUpdated"));
    }, 0);
    return () => clearTimeout(timeoutId);
  }, [cart]);

  const getTotalPrice = () => {
    return cart.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const handleProceedToCheckout = () => {
    if (cart.length === 0) {
      return;
    }
    router.push("/checkout");
  };

  // Generate placeholder image URL
  const getImageUrl = (productName: string) => {
    return `https://placehold.co/400x400/404040/ffffff?text=${encodeURIComponent(
      productName
    )}`;
  };

  if (loading) {
    return (
      <>
        <AuroraBackground className="overflow-hidden -z-10" />
        <div className="relative flex min-h-screen items-center justify-center">
          <div className="text-center">
            <div className="mb-4 inline-block animate-spin rounded-full h-8 w-8 border-4 border-neutral-300 border-t-neutral-800 dark:border-neutral-700 dark:border-t-neutral-200"></div>
            <p className="text-neutral-600 dark:text-neutral-400">
              Cargando carrito...
            </p>
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
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-bold text-neutral-800 dark:text-neutral-100">
              Carrito de Compras
            </h1>
            <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
              {cart.length > 0
                ? `${getTotalItems()} ${
                    getTotalItems() === 1 ? "producto" : "productos"
                  } en tu carrito`
                : "Tu carrito está vacío"}
            </p>
          </motion.div>
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            onClick={() => router.push("/store")}
            className="flex items-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-bold text-black shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] transition duration-200 hover:-translate-y-0.5 dark:bg-zinc-800/90 dark:text-white dark:backdrop-blur-sm dark:border dark:border-zinc-700/50"
          >
            <IconArrowLeft className="h-4 w-4" />
            Continuar comprando
          </motion.button>
        </div>

        <AnimatePresence mode="wait">
          {cart.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5 }}
              className="rounded-2xl bg-white p-12 text-center shadow-md dark:bg-zinc-900/95 dark:backdrop-blur-sm dark:border dark:border-zinc-800/50"
            >
              <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-neutral-100 dark:bg-zinc-800/80 dark:border dark:border-zinc-700/30">
                <IconShoppingCart className="h-12 w-12 text-neutral-400 dark:text-neutral-500" />
              </div>
              <h2 className="mb-2 text-2xl font-bold text-neutral-800 dark:text-neutral-100">
                Tu carrito está vacío
              </h2>
              <p className="mb-8 text-neutral-600 dark:text-neutral-400">
                Agrega productos a tu carrito para continuar
              </p>
              <button
                onClick={() => router.push("/store")}
                className="rounded-md bg-white px-6 py-3 text-sm font-bold text-black shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] transition duration-200 hover:-translate-y-0.5 dark:bg-zinc-800/90 dark:text-white dark:backdrop-blur-sm dark:border dark:border-zinc-700/50"
              >
                <IconShoppingBag className="mr-2 inline h-5 w-5" />
                Ir a la tienda
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="cart"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="grid gap-6 lg:grid-cols-3"
            >
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                <AnimatePresence>
                  {cart.map((item, index) => (
                    <motion.div
                      key={item.product.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, x: -100 }}
                      transition={{
                        duration: 0.5,
                        delay: index * 0.1,
                        layout: { duration: 0.3 },
                      }}
                      className="rounded-2xl bg-white p-6 shadow-md dark:bg-zinc-900/95 dark:backdrop-blur-sm dark:border dark:border-zinc-800/50"
                    >
                      <div className="flex gap-6">
                        {/* Product Image */}
                        <div className="relative h-32 w-32 flex-shrink-0 overflow-hidden rounded-xl bg-neutral-100 dark:bg-zinc-800/80 dark:border dark:border-zinc-700/30">
                          <img
                            src={getImageUrl(item.product.name)}
                            alt={item.product.name}
                            className="h-full w-full object-cover"
                          />
                        </div>

                        {/* Product Details */}
                        <div className="flex flex-1 flex-col justify-between">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="text-lg font-bold text-neutral-800 dark:text-neutral-100">
                                {item.product.name}
                              </h3>
                              <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2">
                                {item.product.description}
                              </p>
                              <p className="mt-2 text-xl font-bold text-neutral-800 dark:text-neutral-200">
                                ${item.product.price.toFixed(2)}
                              </p>
                            </div>
                            <button
                              onClick={() => removeFromCart(item.product.id)}
                              className="ml-4 flex h-8 w-8 items-center justify-center rounded-lg text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-red-500 dark:hover:bg-neutral-800 dark:hover:text-red-400"
                              aria-label="Eliminar producto"
                            >
                              <IconTrash className="h-5 w-5" />
                            </button>
                          </div>

                          {/* Quantity Controls */}
                          <div className="mt-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() =>
                                    updateQuantity(
                                      item.product.id,
                                      item.quantity - 1
                                    )
                                  }
                                  disabled={item.quantity <= 1}
                                  className="flex h-10 w-10 items-center justify-center rounded-lg border-2 border-neutral-300 bg-white text-xl font-semibold text-neutral-700 transition-all hover:bg-neutral-50 hover:border-neutral-400 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white dark:border-zinc-700 dark:bg-zinc-800/80 dark:text-neutral-300 dark:hover:bg-zinc-700/80"
                                  aria-label="Disminuir cantidad"
                                >
                                  −
                                </button>
                                <input
                                  type="number"
                                  min="1"
                                  max={item.product.stock}
                                  value={item.quantity}
                                  onChange={(e) =>
                                    updateQuantity(
                                      item.product.id,
                                      parseInt(e.target.value) || 1
                                    )
                                  }
                                  className="h-10 w-20 rounded-lg border-2 border-neutral-300 px-3 text-center text-sm font-semibold focus:border-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-500/20 dark:border-zinc-700 dark:bg-zinc-800/80 dark:text-white dark:focus:border-zinc-600"
                                />
                                <button
                                  onClick={() =>
                                    updateQuantity(
                                      item.product.id,
                                      item.quantity + 1
                                    )
                                  }
                                  disabled={item.quantity >= item.product.stock}
                                  className="flex h-10 w-10 items-center justify-center rounded-lg border-2 border-neutral-300 bg-white text-xl font-semibold text-neutral-700 transition-all hover:bg-neutral-50 hover:border-neutral-400 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white dark:border-zinc-700 dark:bg-zinc-800/80 dark:text-neutral-300 dark:hover:bg-zinc-700/80"
                                  aria-label="Aumentar cantidad"
                                >
                                  +
                                </button>
                              </div>
                              <span className="text-xs text-neutral-500 dark:text-neutral-400">
                                Stock: {item.product.stock}
                              </span>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                Subtotal
                              </p>
                              <p className="text-xl font-bold text-neutral-800 dark:text-neutral-100">
                                $
                                {(item.product.price * item.quantity).toFixed(
                                  2
                                )}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Order Summary */}
              <div className="lg:sticky lg:top-24 lg:h-fit">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="rounded-2xl bg-white p-6 shadow-md dark:bg-slate-800/90 dark:backdrop-blur-sm"
                >
                  <h2 className="mb-6 text-xl font-bold text-neutral-800 dark:text-neutral-100">
                    Resumen del Pedido
                  </h2>

                  <div className="space-y-4 border-b border-neutral-200 pb-4 dark:border-neutral-700">
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

                  <button
                    onClick={handleProceedToCheckout}
                    className="mt-6 w-full rounded-md bg-white px-6 py-4 text-sm font-bold text-black shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] transition duration-200 hover:-translate-y-0.5 dark:bg-zinc-800/90 dark:text-white dark:backdrop-blur-sm dark:border dark:border-zinc-700/50"
                  >
                    Proceder al Pago
                  </button>

                  <button
                    onClick={() => router.push("/store")}
                    className="mt-3 w-full rounded-md border-2 border-neutral-300 bg-transparent px-6 py-3 text-sm font-semibold text-neutral-700 transition-colors hover:bg-neutral-50 dark:border-neutral-600 dark:text-neutral-300 dark:hover:bg-neutral-800"
                  >
                    Continuar comprando
                  </button>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      </div>
    </>
  );
}
