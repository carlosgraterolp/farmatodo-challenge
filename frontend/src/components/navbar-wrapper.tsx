"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Navbar,
  NavBody,
  NavItems,
  NavbarButton,
  MobileNav,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
  NavbarLogo,
} from "@/components/ui/resizable-navbar";

export function NavbarWrapper() {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    // Check auth status
    const customer = localStorage.getItem("customer");
    setIsLoggedIn(!!customer);

    // Update cart count
    const updateCartCount = () => {
      const cart = localStorage.getItem("cart");
      if (cart) {
        const items = JSON.parse(cart);
        // Count total items (sum of quantities)
        const total = items.reduce((sum: number, item: any) => sum + item.quantity, 0);
        setCartCount(total);
      } else {
        setCartCount(0);
      }
    };

    updateCartCount();

    // Listen for storage changes (when cart is updated in other tabs/windows)
    window.addEventListener("storage", updateCartCount);
    // Custom event for same-tab updates
    window.addEventListener("cartUpdated", updateCartCount);

    return () => {
      window.removeEventListener("storage", updateCartCount);
      window.removeEventListener("cartUpdated", updateCartCount);
    };
  }, []);

  const handleAuth = () => {
    if (isLoggedIn) {
      localStorage.removeItem("customer");
      localStorage.removeItem("cart");
      setIsLoggedIn(false);
      setCartCount(0);
      router.push("/");
    } else {
      router.push("/auth");
    }
  };

  const navItems = [
    {
      name: "Productos",
      link: "/tienda",
    },
  ];

  return (
    <div className="sticky top-0 left-0 right-0 z-50 w-full bg-white/95 backdrop-blur-sm dark:bg-neutral-950/95 py-2">
      <Navbar>
        {/* Desktop Navigation */}
        <NavBody>
          <Link className="font-bold" href="/">
            Farma
          </Link>
          <NavItems items={navItems} />
          <div className="flex items-center gap-4">
            <Link href="/cart" className="relative">
              <span className="text-2xl">🛒</span>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-orange-500 text-xs text-white">
                  {cartCount}
                </span>
              )}
            </Link>
            <button
              onClick={handleAuth}
              className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600"
            >
              {isLoggedIn ? "Cerrar sesión" : "Iniciar sesión"}
            </button>
          </div>
        </NavBody>

        {/* Mobile Navigation */}
        <MobileNav>
          <MobileNavHeader>
            <Link className="font-bold" href="/">
              Farma
            </Link>
            <MobileNavToggle
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
          </MobileNavHeader>

          <MobileNavMenu
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
          >
            {navItems.map((item, idx) => (
              <Link
                key={`mobile-link-${idx}`}
                href={item.link}
                onClick={() => setIsMobileMenuOpen(false)}
                className="relative text-slate-600 dark:text-slate-300"
              >
                <span className="block">{item.name}</span>
              </Link>
            ))}
            <Link
              href="/cart"
              onClick={() => setIsMobileMenuOpen(false)}
              className="relative flex items-center gap-2 text-slate-600 dark:text-slate-300"
            >
              <span className="text-2xl">🛒</span>
              <span>Carrito ({cartCount})</span>
            </Link>
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                handleAuth();
              }}
              className="w-full rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600"
            >
              {isLoggedIn ? "Cerrar sesión" : "Iniciar sesión"}
            </button>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>
    </div>
  );
}
