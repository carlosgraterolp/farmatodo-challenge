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
      // Dispatch custom event to update navbar
      window.dispatchEvent(new Event("cartUpdated"));
      return updatedCart;
    });
  };

  const removeFromCart = (productId: number) => {
    setCart((prevCart) => {
      const updatedCart = prevCart.filter((item) => item.product.id !== productId);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      // Dispatch custom event to update navbar
      window.dispatchEvent(new Event("cartUpdated"));
      return updatedCart;
    });
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const handleProceedToCheckout = () => {
    if (cart.length === 0) {
      alert("Tu carrito está vacío");
      return;
    }
    router.push("/checkout");
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-600 dark:text-gray-400">Cargando carrito...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Carrito de Compras
          </h1>
          <button
            onClick={() => router.push("/tienda")}
            className="text-sm text-orange-500 hover:text-orange-600"
          >
            ← Continuar comprando
          </button>
        </div>

        {cart.length === 0 ? (
          <div className="rounded-lg border border-gray-200 bg-white p-12 text-center dark:border-gray-700 dark:bg-gray-800">
            <p className="mb-4 text-lg text-gray-600 dark:text-gray-400">
              Tu carrito está vacío
            </p>
            <button
              onClick={() => router.push("/tienda")}
              className="rounded-lg bg-orange-500 px-6 py-3 font-semibold text-white hover:bg-orange-600"
            >
              Ir a la tienda
            </button>
          </div>
        ) : (
          <>
            <div className="mb-6 rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
              {cart.map((item, index) => (
                <div
                  key={item.product.id}
                  className={`p-6 ${
                    index !== cart.length - 1 ? "border-b border-gray-200 dark:border-gray-700" : ""
                  }`}
                >
                  <div className="flex gap-4">
                    <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-700">
                      <img
                        src={`https://placehold.co/200x200/ff6b35/ffffff?text=${encodeURIComponent(item.product.name)}`}
                        alt={item.product.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex flex-1 flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                              {item.product.name}
                            </h3>
                            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                              {item.product.description}
                            </p>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.product.id)}
                            className="ml-4 text-red-500 hover:text-red-700"
                          >
                            ✕
                          </button>
                        </div>
                        <p className="mt-2 text-lg font-bold text-orange-500">
                          ${item.product.price.toFixed(2)}
                        </p>
                      </div>
                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="rounded border border-gray-300 px-3 py-1 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700"
                          >
                            −
                          </button>
                          <input
                            type="number"
                            min="1"
                            max={item.product.stock}
                            value={item.quantity}
                            onChange={(e) =>
                              updateQuantity(item.product.id, parseInt(e.target.value) || 1)
                            }
                            className="w-16 rounded border border-gray-300 px-2 py-1 text-center dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                          />
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            disabled={item.quantity >= item.product.stock}
                            className="rounded border border-gray-300 px-3 py-1 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:hover:bg-gray-700"
                          >
                            +
                          </button>
                          <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                            (Stock: {item.product.stock})
                          </span>
                        </div>
                        <p className="text-lg font-semibold text-gray-900 dark:text-white">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
              <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
                Resumen del Pedido
              </h2>
              <div className="space-y-2 border-b border-gray-200 pb-4 dark:border-gray-700">
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Productos ({getTotalItems()})</span>
                  <span>${getTotalPrice().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Envío</span>
                  <span>Gratis</span>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-xl font-bold text-gray-900 dark:text-white">Total</span>
                <span className="text-2xl font-bold text-orange-500">
                  ${getTotalPrice().toFixed(2)}
                </span>
              </div>
              <button
                onClick={handleProceedToCheckout}
                className="mt-6 w-full rounded-lg bg-orange-500 px-6 py-4 text-lg font-semibold text-white hover:bg-orange-600"
              >
                Proceder al Pago
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
