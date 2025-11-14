/**
 * Image utility functions
 */

/** Generate placeholder image URL for products */
export const getImageUrl = (productName: string): string => {
  return `https://placehold.co/400x400/404040/ffffff?text=${encodeURIComponent(
    productName
  )}`;
};

