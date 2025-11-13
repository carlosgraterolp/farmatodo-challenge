"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
}

interface ExpandableProductCardProps {
  product: Product;
  onAddToCart: (product: Product, quantity: number) => void;
}

export function ExpandableProductCard({
  product,
  onAddToCart,
}: ExpandableProductCardProps) {
  const [active, setActive] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const ref = useRef<HTMLDivElement>(null);

  useOutsideClick(ref, () => {
    setActive(false);
  });

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActive(false);
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  // Generate a consistent placeholder image based on product ID
  const imageUrl = `https://placehold.co/400x400/404040/ffffff?text=${encodeURIComponent(
    product.name
  )}`;

  const handleQuantityChange = (delta: number) => {
    setQuantity((prev) => {
      const newQuantity = prev + delta;
      if (newQuantity < 1) return 1;
      if (newQuantity > product.stock) return product.stock;
      return newQuantity;
    });
  };

  const handleAddToCart = () => {
    if (quantity > 0 && quantity <= product.stock) {
      onAddToCart(product, quantity);
      setActive(false);
      setQuantity(1);
    }
  };

  return (
    <>
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/50"
          ></motion.div>
        )}
      </AnimatePresence>

      {active && (
        <div className="fixed inset-0 z-[100] grid place-items-center p-4">
          <motion.div
            layoutId={`card-${product.id}`}
            ref={ref}
            key={product.id}
            className="max-w-md rounded-2xl bg-white shadow-xl dark:bg-zinc-900/95 dark:backdrop-blur-sm dark:border dark:border-zinc-800/50 overflow-hidden"
          >
            <div className="relative">
              <motion.div layoutId={`image-${product.id}`}>
                <img
                  src={imageUrl}
                  alt={product.name}
                  width={500}
                  height={500}
                  className="h-60 w-full object-cover"
                />
              </motion.div>
              <button
                onClick={() => setActive(false)}
                className="absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 backdrop-blur-sm text-neutral-700 shadow-md transition-all hover:bg-white hover:scale-110 dark:bg-zinc-800/90 dark:text-neutral-200 dark:hover:bg-zinc-700/90 dark:border dark:border-zinc-700/50"
                aria-label="Cerrar"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            <div className="flex flex-col items-start p-6">
              <motion.p
                layoutId={`title-${product.id}`}
                className="text-lg font-bold text-neutral-800 dark:text-neutral-100"
              >
                {product.name}
              </motion.p>
              <motion.p
                layoutId={`price-${product.id}`}
                className="mt-2 text-xl font-bold text-neutral-800 dark:text-neutral-200"
              >
                ${product.price.toFixed(2)}
              </motion.p>
              <motion.div
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="mt-6 w-full space-y-6"
              >
                <div className="space-y-2">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                    Descripción
                  </h3>
                  <p className="text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
                    {product.description}
                  </p>
                </div>
                <div className="w-full space-y-4 border-t border-neutral-200 pt-4 dark:border-neutral-700">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                      Cantidad
                    </label>
                    {product.stock > 0 && (
                      <span className="text-xs text-neutral-500 dark:text-neutral-400">
                        {product.stock} disponibles
                      </span>
                    )}
                  </div>
                  <div className="flex w-full items-center gap-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleQuantityChange(-1)}
                        disabled={quantity <= 1}
                        className="flex h-11 w-11 items-center justify-center rounded-lg border-2 border-neutral-300 bg-white text-xl font-semibold text-neutral-700 transition-all hover:bg-neutral-50 hover:border-neutral-400 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white dark:border-zinc-700 dark:bg-zinc-800/80 dark:text-neutral-300 dark:hover:bg-zinc-700/80"
                        aria-label="Disminuir cantidad"
                      >
                        −
                      </button>
                      <input
                        type="number"
                        min="1"
                        max={product.stock}
                        value={quantity}
                        onChange={(e) => {
                          const val = parseInt(e.target.value) || 1;
                          setQuantity(Math.max(1, Math.min(product.stock, val)));
                        }}
                        className="h-11 w-24 rounded-lg border-2 border-neutral-300 px-3 text-center text-lg font-semibold focus:border-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-500/20 dark:border-zinc-700 dark:bg-zinc-800/80 dark:text-white dark:focus:border-zinc-600"
                      />
                      <button
                        onClick={() => handleQuantityChange(1)}
                        disabled={quantity >= product.stock}
                        className="flex h-11 w-11 items-center justify-center rounded-lg border-2 border-neutral-300 bg-white text-xl font-semibold text-neutral-700 transition-all hover:bg-neutral-50 hover:border-neutral-400 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white dark:border-zinc-700 dark:bg-zinc-800/80 dark:text-neutral-300 dark:hover:bg-zinc-700/80"
                        aria-label="Aumentar cantidad"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={handleAddToCart}
                      disabled={product.stock === 0}
                      className="flex-1 rounded-md bg-white px-6 py-3 text-sm font-bold text-black shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] transition duration-200 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-800/90 dark:text-white dark:backdrop-blur-sm dark:border dark:border-zinc-700/50"
                    >
                      {product.stock === 0 ? "Sin stock" : "Agregar al carrito"}
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      )}

      <motion.div
        layoutId={`card-${product.id}`}
        onClick={() => setActive(true)}
        key={product.id}
        className="cursor-pointer rounded-2xl bg-white shadow-md transition-shadow hover:shadow-lg dark:bg-zinc-900/95 dark:backdrop-blur-sm dark:border dark:border-zinc-800/50"
      >
        <motion.div layoutId={`image-${product.id}`}>
          <img
            src={imageUrl}
            alt={product.name}
            width={500}
            height={500}
            className="h-60 w-full rounded-t-2xl object-cover"
          />
        </motion.div>
        <div className="flex flex-col items-start p-6">
          <motion.p
            layoutId={`title-${product.id}`}
            className="text-lg font-bold text-neutral-800 dark:text-neutral-100"
          >
            {product.name}
          </motion.p>
          <motion.p
            layoutId={`price-${product.id}`}
            className="mt-2 text-xl font-bold text-neutral-800 dark:text-neutral-200"
          >
            ${product.price.toFixed(2)}
          </motion.p>
        </div>
      </motion.div>
    </>
  );
}

export const useOutsideClick = (
  ref: React.RefObject<HTMLDivElement | null>,
  callback: Function,
) => {
  useEffect(() => {
    const listener = (event: any) => {
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }
      callback(event);
    };
    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);
    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, callback]);
};

