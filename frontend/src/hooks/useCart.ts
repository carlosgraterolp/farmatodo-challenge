/**
 * Custom hook for managing shopping cart state
 * Handles localStorage persistence and prevents hydration mismatches
 */

import { useState, useEffect, useCallback, startTransition } from "react";
import { CartItem, Product } from "@/types";
import {
  getCartFromStorage,
  addToCart as addToCartUtil,
  updateCartItemQuantity as updateCartItemQuantityUtil,
  removeFromCart as removeFromCartUtil,
  dispatchCartUpdated,
} from "@/utils/cart";

export const useCart = () => {
  // Start with empty cart to avoid hydration mismatch (server renders empty)
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  // Load cart from localStorage after mount (client-side only)
  // Using startTransition to batch updates and prevent hydration mismatch
  useEffect(() => {
    startTransition(() => {
      setMounted(true);
      const savedCart = getCartFromStorage();
      setCart(savedCart);
      setLoading(false);
    });
  }, []);

  // Dispatch cart updated event after cart state changes (for navbar badge)
  useEffect(() => {
    dispatchCartUpdated();
  }, [cart]);

  /** Add product to cart or update quantity if already exists */
  const addToCart = useCallback((product: Product, quantity: number) => {
    setCart((prevCart) => addToCartUtil(prevCart, product, quantity));
  }, []);

  /** Update quantity of a cart item */
  const updateQuantity = useCallback(
    (productId: number, newQuantity: number) => {
      setCart((prevCart) =>
        updateCartItemQuantityUtil(prevCart, productId, newQuantity)
      );
    },
    []
  );

  /** Remove item from cart */
  const removeItem = useCallback((productId: number) => {
    setCart((prevCart) => removeFromCartUtil(prevCart, productId));
  }, []);

  /** Clear entire cart */
  const clearCart = useCallback(() => {
    setCart([]);
    if (typeof window !== "undefined") {
      localStorage.removeItem("cart");
    }
  }, []);

  return {
    cart,
    loading,
    mounted, // Indicates when hook has hydrated (prevents SSR/client mismatch)
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
  };
};
