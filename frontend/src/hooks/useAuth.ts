/**
 * Custom hook for managing authentication state
 * Handles customer session persistence in localStorage
 */

import { useState, useEffect, startTransition } from "react";
import { Customer } from "@/types";
import {
  getCustomerFromStorage,
  saveCustomerToStorage,
  removeCustomerFromStorage,
} from "@/utils/auth";

export const useAuth = () => {
  // Start with null to avoid hydration mismatch (server renders null)
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  // Load customer from localStorage after mount (client-side only)
  // Using startTransition to batch updates and prevent hydration mismatch
  useEffect(() => {
    startTransition(() => {
      setMounted(true);
      const customerData = getCustomerFromStorage();
      setCustomer(customerData);
      setLoading(false);
    });
  }, []);

  /** Login and save customer to localStorage */
  const login = (customerData: Customer) => {
    saveCustomerToStorage(customerData);
    setCustomer(customerData);
  };

  /** Logout and clear customer from localStorage */
  const logout = () => {
    removeCustomerFromStorage();
    setCustomer(null);
  };

  const isAuthenticated = !!customer;

  return {
    customer,
    loading,
    mounted, // Indicates when hook has hydrated (prevents SSR/client mismatch)
    isAuthenticated,
    login,
    logout,
  };
};

