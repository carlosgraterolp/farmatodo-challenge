/**
 * Authentication context provider for managing shared auth state
 * Follows Next.js best practices for client-side state management
 */

"use client";

import { createContext, useContext, useEffect, useState, startTransition } from "react";
import { Customer } from "@/types";
import {
  getCustomerFromStorage,
  saveCustomerToStorage,
  removeCustomerFromStorage,
} from "@/utils/auth";

interface AuthContextType {
  customer: Customer | null;
  loading: boolean;
  mounted: boolean;
  isAuthenticated: boolean;
  login: (customerData: Customer) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
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

  // Listen for storage changes (when auth is updated in other tabs/windows)
  useEffect(() => {
    const handleStorageChange = () => {
      const customerData = getCustomerFromStorage();
      setCustomer(customerData);
    };

    // Listen for storage events (cross-tab synchronization)
    window.addEventListener("storage", handleStorageChange);
    // Listen for custom authUpdated event (same-tab updates)
    window.addEventListener("authUpdated", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("authUpdated", handleStorageChange);
    };
  }, []);

  /** Login and save customer to localStorage */
  const login = (customerData: Customer) => {
    saveCustomerToStorage(customerData);
    setCustomer(customerData);
    // Dispatch event for other components listening to auth changes
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("authUpdated"));
    }
  };

  /** Logout and clear customer from localStorage */
  const logout = () => {
    removeCustomerFromStorage();
    setCustomer(null);
    // Dispatch event for other components listening to auth changes
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("authUpdated"));
    }
  };

  const isAuthenticated = !!customer;

  return (
    <AuthContext.Provider
      value={{
        customer,
        loading,
        mounted,
        isAuthenticated,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

