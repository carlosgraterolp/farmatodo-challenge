/**
 * Store page - displays product catalog with search functionality
 */

"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ExpandableProductCard } from "@/components/ui/expandable-product-card";
import { Input } from "@/components/ui/input";
import { IconSearch } from "@tabler/icons-react";
import { motion, AnimatePresence } from "motion/react";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { Product } from "@/types";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { API_BASE_URL } from "@/constants";
import { ROUTES } from "@/constants";

export default function StorePage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const { addToCart } = useCart();
  const { isAuthenticated, loading: authLoading, mounted: authMounted } = useAuth();

  /** Fetch products from API with optional search query */
  const fetchProducts = useCallback(async (query: string) => {
    setLoading(true);
    const startTime = Date.now();

    try {
      const url = `${API_BASE_URL}/products?q=${encodeURIComponent(query)}`;
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

  // Redirect to auth if not authenticated, then load products
  useEffect(() => {
    if (authMounted && !isAuthenticated) {
      router.push(ROUTES.AUTH);
      return;
    }

    if (authMounted && isAuthenticated) {
      fetchProducts("");
    }
  }, [router, fetchProducts, isAuthenticated, authMounted]);

  // Debounced search - fetch products 300ms after user stops typing
  useEffect(() => {
    if (!isAuthenticated) return;

    const timeoutId = setTimeout(() => {
      fetchProducts(searchQuery);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, fetchProducts, isAuthenticated]);

  /** Add product to cart with validation */
  const handleAddToCart = (product: Product, quantity: number) => {
    if (quantity <= 0 || quantity > product.stock) {
      alert(`Por favor selecciona una cantidad válida (1-${product.stock})`);
      return;
    }
    addToCart(product, quantity);
  };

  return (
    <>
      <AuroraBackground className="-z-10 overflow-hidden" />
      <div className="relative min-h-screen">
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
                        onAddToCart={handleAddToCart}
                      />
                    </motion.div>
                  ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </>
  );
}

/** Skeleton loader component for product cards during loading */
function ProductCardSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      layout
      className="rounded-2xl bg-white shadow-md dark:bg-zinc-900/95 dark:backdrop-blur-sm dark:border dark:border-zinc-800/50"
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
