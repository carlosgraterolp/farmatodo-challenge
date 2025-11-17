/**
 * Order summary component displaying cart totals and checkout actions
 */

import React from "react";
import { motion } from "motion/react";
import { CartItem } from "@/types";
import { getTotalPrice, getTotalItems } from "@/utils/cart";

interface OrderSummaryProps {
  cart: CartItem[];
  onCheckout?: () => void;
  onContinueShopping?: () => void;
  checkoutLabel?: string;
  showContinueShopping?: boolean;
}

/** Displays order summary with totals, shipping, and checkout/continue shopping buttons */
export const OrderSummary: React.FC<OrderSummaryProps> = ({
  cart,
  onCheckout,
  onContinueShopping,
  checkoutLabel = "Proceder al Pago",
  showContinueShopping = true,
}) => {
  const totalPrice = getTotalPrice(cart);
  const totalItems = getTotalItems(cart);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="rounded-2xl bg-white p-4 sm:p-6 shadow-md dark:bg-zinc-900/95 dark:backdrop-blur-sm dark:border dark:border-zinc-800/50"
    >
      <h2 className="mb-4 sm:mb-6 text-lg sm:text-xl font-bold text-neutral-800 dark:text-neutral-100">
        Resumen del Pedido
      </h2>

      <div className="space-y-4 border-b border-neutral-200 pb-4 dark:border-neutral-700">
        <div className="flex justify-between text-sm text-neutral-600 dark:text-neutral-400">
          <span>Productos ({totalItems})</span>
          <span className="font-semibold text-neutral-800 dark:text-neutral-200">
            ${totalPrice.toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between text-sm text-neutral-600 dark:text-neutral-400">
          <span>Envío</span>
          <span className="font-semibold text-green-600 dark:text-green-400">
            Gratis
          </span>
        </div>
      </div>

      <div className="mt-4 sm:mt-6 flex items-center justify-between border-t border-neutral-200 pt-4 dark:border-neutral-700">
        <span className="text-base sm:text-lg font-bold text-neutral-800 dark:text-neutral-100">
          Total
        </span>
        <span className="text-xl sm:text-2xl font-bold text-neutral-800 dark:text-neutral-100">
          ${totalPrice.toFixed(2)}
        </span>
      </div>

      {onCheckout && (
        <button
          onClick={onCheckout}
          className="mt-4 sm:mt-6 w-full rounded-md bg-white px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-bold text-black shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] transition duration-200 hover:-translate-y-0.5 dark:bg-zinc-800/90 dark:text-white dark:backdrop-blur-sm dark:border dark:border-zinc-700/50"
        >
          {checkoutLabel}
        </button>
      )}

      {showContinueShopping && onContinueShopping && (
        <button
          onClick={onContinueShopping}
          className="mt-3 w-full rounded-md border-2 border-neutral-300 bg-transparent px-4 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm font-semibold text-neutral-700 transition-colors hover:bg-neutral-50 dark:border-neutral-600 dark:text-neutral-300 dark:hover:bg-neutral-800"
        >
          Continuar comprando
        </button>
      )}
    </motion.div>
  );
};

