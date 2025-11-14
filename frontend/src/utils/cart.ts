/**
 * Cart utility functions for managing cart state and localStorage persistence
 */

import { CartItem, Product } from "@/types";
import { STORAGE_KEYS } from "@/constants";

/** Retrieve cart from localStorage (returns empty array on server) */
export const getCartFromStorage = (): CartItem[] => {
  if (typeof window === "undefined") return [];
  const savedCart = localStorage.getItem(STORAGE_KEYS.CART);
  return savedCart ? JSON.parse(savedCart) : [];
};

/** Save cart to localStorage */
export const saveCartToStorage = (cart: CartItem[]): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
};

/** Clear cart from localStorage */
export const clearCartFromStorage = (): void => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEYS.CART);
};

/** Calculate total price of all items in cart */
export const getTotalPrice = (cart: CartItem[]): number => {
  return cart.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );
};

/** Calculate total quantity of all items in cart */
export const getTotalItems = (cart: CartItem[]): number => {
  return cart.reduce((total, item) => total + item.quantity, 0);
};

/** Add product to cart or update quantity if already exists */
export const addToCart = (
  cart: CartItem[],
  product: Product,
  quantity: number
): CartItem[] => {
  const existingItem = cart.find((item) => item.product.id === product.id);
  let updatedCart: CartItem[];

  if (existingItem) {
    // Update existing item quantity (respecting stock limit)
    updatedCart = cart.map((item) =>
      item.product.id === product.id
        ? {
            ...item,
            quantity: Math.min(item.quantity + quantity, product.stock),
          }
        : item
    );
  } else {
    // Add new item to cart
    updatedCart = [...cart, { product, quantity }];
  }

  saveCartToStorage(updatedCart);
  return updatedCart;
};

/** Update quantity of a cart item (removes if quantity <= 0) */
export const updateCartItemQuantity = (
  cart: CartItem[],
  productId: number,
  newQuantity: number
): CartItem[] => {
  if (newQuantity <= 0) {
    return removeFromCart(cart, productId);
  }

  const updatedCart = cart.map((item) => {
    if (item.product.id === productId) {
      const validQuantity = Math.min(newQuantity, item.product.stock);
      return { ...item, quantity: validQuantity };
    }
    return item;
  });

  saveCartToStorage(updatedCart);
  return updatedCart;
};

/** Remove item from cart */
export const removeFromCart = (
  cart: CartItem[],
  productId: number
): CartItem[] => {
  const updatedCart = cart.filter((item) => item.product.id !== productId);
  saveCartToStorage(updatedCart);
  return updatedCart;
};

/** Dispatch cart updated event (used for navbar badge updates) */
export const dispatchCartUpdated = (): void => {
  if (typeof window === "undefined") return;
  // Defer event dispatch to after render completes
  setTimeout(() => {
    window.dispatchEvent(new Event("cartUpdated"));
  }, 0);
};

