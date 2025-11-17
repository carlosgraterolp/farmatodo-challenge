/**
 * Shopping cart page - displays cart items with quantity controls and order summary
 */

"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence } from "motion/react";
import { IconShoppingBag } from "@tabler/icons-react";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { LoadingSpinner } from "@/components/common/loading-spinner";
import { EmptyState } from "@/components/common/empty-state";
import { PageHeader } from "@/components/common/page-header";
import { CartItemCard } from "@/components/cart/cart-item-card";
import { OrderSummary } from "@/components/cart/order-summary";
import { getTotalItems } from "@/utils/cart";
import { ROUTES } from "@/constants";

export default function CartPage() {
  const router = useRouter();
  const { cart, loading, mounted: cartMounted, updateQuantity, removeItem } = useCart();
  const { isAuthenticated, loading: authLoading, mounted: authMounted } = useAuth();

  // Redirect to auth if not authenticated
  useEffect(() => {
    if (authMounted && !isAuthenticated) {
      router.push(ROUTES.AUTH);
    }
  }, [isAuthenticated, authMounted, router]);

  /** Navigate to checkout page */
  const handleProceedToCheckout = () => {
    if (cart.length === 0) {
      return;
    }
    router.push(ROUTES.CHECKOUT);
  }

  // Show loading until both hooks have mounted to prevent hydration mismatch
  if (loading || authLoading || !cartMounted || !authMounted) {
    return (
      <>
        <AuroraBackground className="-z-10 overflow-hidden" />
        <LoadingSpinner message="Cargando carrito..." />
      </>
    );
  }

  return (
    <>
      <AuroraBackground className="-z-10 overflow-hidden" />
      <div className="relative min-h-screen">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <PageHeader
            title="Carrito de Compras"
            description={
              cart.length > 0
                ? `${getTotalItems(cart)} ${
                    getTotalItems(cart) === 1 ? "producto" : "productos"
                  } en tu carrito`
                : "Tu carrito está vacío"
            }
            backButton={{
              label: "Continuar comprando",
              href: ROUTES.STORE,
            }}
          />

          <AnimatePresence mode="wait">
            {cart.length === 0 ? (
              <EmptyState
                title="Tu carrito está vacío"
                description="Agrega productos a tu carrito para continuar"
                actionLabel="Ir a la tienda"
                onAction={() => router.push(ROUTES.STORE)}
              />
            ) : (
              <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
                {/* Cart Items */}
                <div className="space-y-4 lg:col-span-2">
                  <AnimatePresence>
                    {cart.map((item, index) => (
                      <CartItemCard
                        key={item.product.id}
                        item={item}
                        index={index}
                        onUpdateQuantity={updateQuantity}
                        onRemove={removeItem}
                      />
                    ))}
                  </AnimatePresence>
                </div>

                {/* Order Summary */}
                <div className="lg:sticky lg:top-24 lg:h-fit">
                  <OrderSummary
                    cart={cart}
                    onCheckout={handleProceedToCheckout}
                    onContinueShopping={() => router.push(ROUTES.STORE)}
                  />
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}
