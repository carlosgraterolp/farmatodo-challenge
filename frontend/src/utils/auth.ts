/**
 * Authentication utility functions for managing customer session in localStorage
 */

import { Customer } from "@/types";
import { STORAGE_KEYS } from "@/constants";

/** Retrieve customer from localStorage (returns null on server) */
export const getCustomerFromStorage = (): Customer | null => {
  if (typeof window === "undefined") return null;
  const customerData = localStorage.getItem(STORAGE_KEYS.CUSTOMER);
  return customerData ? JSON.parse(customerData) : null;
};

/** Save customer to localStorage */
export const saveCustomerToStorage = (customer: Customer): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.CUSTOMER, JSON.stringify(customer));
};

/** Remove customer from localStorage (logout) */
export const removeCustomerFromStorage = (): void => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEYS.CUSTOMER);
};

