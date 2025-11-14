/**
 * Reusable page header component with title, description, and optional back button
 */

import React from "react";
import { motion } from "motion/react";
import { IconArrowLeft } from "@tabler/icons-react";
import { useRouter } from "next/navigation";

interface PageHeaderProps {
  title: string;
  description?: string;
  backButton?: {
    label: string;
    href: string;
  };
}

/** Page header with animated title, optional description, and back button */
export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  backButton,
}) => {
  const router = useRouter();

  return (
    <div className="mb-8 flex items-center justify-between">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold text-neutral-800 dark:text-neutral-100">
          {title}
        </h1>
        {description && (
          <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
            {description}
          </p>
        )}
      </motion.div>
      {backButton && (
        <motion.button
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          onClick={() => router.push(backButton.href)}
          className="flex items-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-bold text-black shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] transition duration-200 hover:-translate-y-0.5 dark:bg-zinc-800/90 dark:text-white dark:backdrop-blur-sm dark:border dark:border-zinc-700/50"
        >
          <IconArrowLeft className="h-4 w-4" />
          {backButton.label}
        </motion.button>
      )}
    </div>
  );
};

