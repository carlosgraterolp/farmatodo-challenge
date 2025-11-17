/**
 * Cart item card component displaying product details with quantity controls
 */

import React from "react";
import { motion } from "motion/react";
import { IconTrash } from "@tabler/icons-react";
import { CartItem } from "@/types";
import { getImageUrl } from "@/utils/images";

interface CartItemCardProps {
  item: CartItem;
  index: number;
  onUpdateQuantity: (productId: number, quantity: number) => void;
  onRemove: (productId: number) => void;
}

/** Individual cart item card with image, details, quantity controls, and remove button */
export const CartItemCard: React.FC<CartItemCardProps> = ({
  item,
  index,
  onUpdateQuantity,
  onRemove,
}) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, x: -100 }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        layout: { duration: 0.3 },
      }}
      className="rounded-2xl bg-white p-4 sm:p-6 shadow-md dark:bg-zinc-900/95 dark:backdrop-blur-sm dark:border dark:border-zinc-800/50"
    >
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
        {/* Product Image */}
        <div className="relative h-24 w-24 sm:h-32 sm:w-32 shrink-0 overflow-hidden rounded-xl bg-neutral-100 dark:bg-zinc-800/80 dark:border dark:border-zinc-700/30 mx-auto sm:mx-0">
          <img
            src={getImageUrl(item.product.name)}
            alt={item.product.name}
            className="h-full w-full object-cover"
          />
        </div>

        {/* Product Details */}
        <div className="flex flex-1 flex-col justify-between">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h3 className="text-base sm:text-lg font-bold text-neutral-800 dark:text-neutral-100">
                {item.product.name}
              </h3>
              <p className="mt-1 line-clamp-2 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
                {item.product.description}
              </p>
              <p className="mt-2 text-lg sm:text-xl font-bold text-neutral-800 dark:text-neutral-200">
                ${item.product.price.toFixed(2)}
              </p>
            </div>
            <button
              onClick={() => onRemove(item.product.id)}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-red-500 dark:hover:bg-neutral-800 dark:hover:text-red-400"
              aria-label="Eliminar producto"
            >
              <IconTrash className="h-5 w-5" />
            </button>
          </div>

          {/* Quantity Controls */}
          <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    onUpdateQuantity(item.product.id, item.quantity - 1)
                  }
                  disabled={item.quantity <= 1}
                  className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-lg border-2 border-neutral-300 bg-white text-lg sm:text-xl font-semibold text-neutral-700 transition-all hover:bg-neutral-50 hover:border-neutral-400 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white dark:border-zinc-700 dark:bg-zinc-800/80 dark:text-neutral-300 dark:hover:bg-zinc-700/80"
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
                    onUpdateQuantity(
                      item.product.id,
                      parseInt(e.target.value) || 1
                    )
                  }
                  className="h-9 w-16 sm:h-10 sm:w-20 rounded-lg border-2 border-neutral-300 px-2 sm:px-3 text-center text-xs sm:text-sm font-semibold focus:border-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-500/20 dark:border-zinc-700 dark:bg-zinc-800/80 dark:text-white dark:focus:border-zinc-600"
                />
                <button
                  onClick={() =>
                    onUpdateQuantity(item.product.id, item.quantity + 1)
                  }
                  disabled={item.quantity >= item.product.stock}
                  className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-lg border-2 border-neutral-300 bg-white text-lg sm:text-xl font-semibold text-neutral-700 transition-all hover:bg-neutral-50 hover:border-neutral-400 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white dark:border-zinc-700 dark:bg-zinc-800/80 dark:text-neutral-300 dark:hover:bg-zinc-700/80"
                  aria-label="Aumentar cantidad"
                >
                  +
                </button>
              </div>
              <span className="text-xs text-neutral-500 dark:text-neutral-400">
                Stock: {item.product.stock}
              </span>
            </div>
            <div className="text-left sm:text-right w-full sm:w-auto">
              <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
                Subtotal
              </p>
              <p className="text-lg sm:text-xl font-bold text-neutral-800 dark:text-neutral-100">
                ${(item.product.price * item.quantity).toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

