/**
 * Reusable loading spinner component
 */

import React from "react";

interface LoadingSpinnerProps {
  message?: string;
  className?: string;
}

/** Centered loading spinner with optional message */
export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message = "Cargando...",
  className = "",
}) => {
  return (
    <div className={`flex min-h-screen items-center justify-center ${className}`}>
      <div className="text-center">
        <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-neutral-300 border-t-neutral-800 dark:border-neutral-700 dark:border-t-neutral-200"></div>
        <p className="text-neutral-600 dark:text-neutral-400">{message}</p>
      </div>
    </div>
  );
};

