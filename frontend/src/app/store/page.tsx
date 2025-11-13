"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ExpandableProductCard } from "@/components/ui/expandable-product-card";
import { Input } from "@/components/ui/input";
import { IconSearch } from "@tabler/icons-react";
import { motion, AnimatePresence } from "motion/react";

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

export default function StorePage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [customerId, setCustomerId] = useState<number | null>(null);

  const fetchProducts = useCallback(async (query: string) => {
    setLoading(true);
    const startTime = Date.now();

    try {
      // Fetch all products with optional search query
      const url = `${
        process.env.NEXT_PUBLIC_API_BASE_URL
      }/products?q=${encodeURIComponent(query)}`;

      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        // Deduplicate products by ID
        const uniqueProducts = data.filter(
          (product: Product, index: number, self: Product[]) =>
            index === self.findIndex((p) => p.id === product.id)
        );
        setProducts(uniqueProducts);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      // Ensure minimum 1 second loading time
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, 1000 - elapsedTime);
      await new Promise((resolve) => setTimeout(resolve, remainingTime));
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Get customer info from localStorage
    const customerData = localStorage.getItem("customer");
    if (customerData) {
      const customer = JSON.parse(customerData);
      setCustomerId(customer.id);
    } else {
      // Redirect to auth if no customer logged in
      router.push("/auth");
      return;
    }

    // Load cart from localStorage
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }

    // Load products
    fetchProducts("");
  }, [router, fetchProducts]);

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchProducts(searchQuery);
    }, 300); // 300ms delay

    return () => clearTimeout(timeoutId);
  }, [searchQuery, fetchProducts]);

  const addToCart = (product: Product, quantity: number) => {
    if (quantity <= 0 || quantity > product.stock) {
      alert(`Por favor selecciona una cantidad válida (1-${product.stock})`);
      return;
    }

    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (item) => item.product.id === product.id
      );
      let updatedCart;
      if (existingItem) {
        updatedCart = prevCart.map((item) =>
          item.product.id === product.id
            ? {
                ...item,
                quantity: Math.min(item.quantity + quantity, product.stock),
              }
            : item
        );
      } else {
        updatedCart = [...prevCart, { product, quantity }];
      }
      // Save to localStorage
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-neutral-500">
              <IconSearch className="h-5 w-5" />
            </div>
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar productos..."
              className="pl-10"
            />
          </div>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <AnimatePresence mode="popLayout">
            {loading
              ? [...Array(8)].map((_, index) => (
                  <ProductCardSkeleton key={`skeleton-${index}`} />
                ))
              : products.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -20 }}
                    transition={{
                      duration: 0.7,
                      ease: [0.4, 0, 0.2, 1],
                      delay: index * 0.08,
                    }}
                    layout
                  >
                    <ExpandableProductCard
                      product={product}
                      onAddToCart={addToCart}
                    />
                  </motion.div>
                ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// Skeleton loader component matching the collapsed product card size
function ProductCardSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      layout
      className="rounded-2xl bg-white shadow-md dark:bg-neutral-900"
    >
      {/* Image skeleton */}
      <motion.div
        animate={{
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="h-60 w-full rounded-t-2xl bg-gradient-to-br from-neutral-200 to-neutral-300 dark:from-neutral-800 dark:to-neutral-700"
      />

      {/* Content skeleton */}
      <div className="flex flex-col items-start p-6">
        {/* Title skeleton */}
        <motion.div
          animate={{
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.1,
          }}
          className="h-6 w-3/4 rounded-md bg-gradient-to-r from-neutral-200 to-neutral-300 dark:from-neutral-800 dark:to-neutral-700"
        />

        {/* Price skeleton */}
        <motion.div
          animate={{
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.2,
          }}
          className="mt-2 h-7 w-1/3 rounded-md bg-gradient-to-r from-neutral-200 to-neutral-300 dark:from-neutral-800 dark:to-neutral-700"
        />
      </div>
    </motion.div>
  );
}
