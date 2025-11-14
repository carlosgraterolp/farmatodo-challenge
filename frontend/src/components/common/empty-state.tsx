/**
 * Reusable empty state component for displaying when lists/collections are empty
 */

import React from "react";
import { IconShoppingCart } from "@tabler/icons-react";
import { motion } from "motion/react";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: React.ReactNode;
  onAction?: () => void;
}

/** Displays an empty state with icon, message, and optional action button */
export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5 }}
      className="rounded-2xl bg-white p-12 text-center shadow-md dark:bg-zinc-900/95 dark:backdrop-blur-sm dark:border dark:border-zinc-800/50"
    >
      <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-neutral-100 dark:bg-zinc-800/80 dark:border dark:border-zinc-700/30">
        {icon || (
          <IconShoppingCart className="h-12 w-12 text-neutral-400 dark:text-neutral-500" />
        )}
      </div>
      <h2 className="mb-2 text-2xl font-bold text-neutral-800 dark:text-neutral-100">
        {title}
      </h2>
      <p className="mb-8 text-neutral-600 dark:text-neutral-400">
        {description}
      </p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="rounded-md bg-white px-6 py-3 text-sm font-bold text-black shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] transition duration-200 hover:-translate-y-0.5 dark:bg-zinc-800/90 dark:text-white dark:backdrop-blur-sm dark:border dark:border-zinc-700/50"
        >
          {actionLabel}
        </button>
      )}
    </motion.div>
  );
};

