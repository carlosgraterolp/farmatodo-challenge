"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
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
import {
  IconShoppingCart,
  IconSun,
  IconMoon,
  IconPrescription,
  IconShoppingBag,
} from "@tabler/icons-react";
import { useTheme } from "@/components/theme-provider";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { getTotalItems } from "@/utils/cart";
import { ROUTES } from "@/constants";

export function NavbarWrapper() {
  const router = useRouter();
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated, logout, mounted: authMounted } = useAuth();
  const { cart, clearCart } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  // Protected routes that require authentication
  const protectedRoutes = [ROUTES.STORE, ROUTES.CART, ROUTES.CHECKOUT] as const;
  const isProtectedRoute = protectedRoutes.includes(pathname as (typeof protectedRoutes)[number]);
  
  // Determine default button text based on route
  // On protected routes, user must be authenticated, so show "Cerrar sesión"
  // On public routes, show "Iniciar sesión" as default
  const getDefaultButtonText = () => {
    if (!authMounted) {
      return isProtectedRoute ? "Cerrar sesión" : "Iniciar sesión";
    }
    return isAuthenticated ? "Cerrar sesión" : "Iniciar sesión";
  };

  // Update cart count from cart state
  useEffect(() => {
    setCartCount(getTotalItems(cart));
  }, [cart]);

  // Listen for storage changes (when cart is updated in other tabs/windows)
  useEffect(() => {
    const updateCartCount = () => {
      if (typeof window !== "undefined") {
        const cartData = localStorage.getItem("cart");
        if (cartData) {
          const items = JSON.parse(cartData);
          const total = items.reduce(
            (sum: number, item: any) => sum + item.quantity,
            0
          );
          setCartCount(total);
        } else {
          setCartCount(0);
        }
      }
    };

    window.addEventListener("storage", updateCartCount);
    window.addEventListener("cartUpdated", updateCartCount);

    return () => {
      window.removeEventListener("storage", updateCartCount);
      window.removeEventListener("cartUpdated", updateCartCount);
    };
  }, []);

  const handleAuth = () => {
    if (isAuthenticated) {
      logout();
      clearCart();
      router.push("/");
    } else {
      router.push("/auth");
    }
  };

  // Desktop nav items (icons only, no text)
  const desktopNavItems = [
    {
      name: "",
      link: "/store",
      icon: <IconShoppingBag />,
    },
    {
      name: "",
      link: "/cart",
      icon: <IconShoppingCart />,
      count: cartCount,
    },
  ];

  // Mobile nav items (with text labels)
  const mobileNavItems = [
    {
      name: "Tienda",
      link: "/store",
      icon: <IconShoppingBag />,
    },
    {
      name: "Carrito",
      link: "/cart",
      icon: <IconShoppingCart />,
      count: cartCount,
    },
  ];

  return (
    <div className="sticky top-0 left-0 right-0 z-50 w-full pt-2 pb-0">
      <Navbar>
        {/* Desktop Navigation */}
        <NavBody>
          <NavbarLogo icon={<IconPrescription />} text="Farma" href="/" />

          <div className="flex items-center gap-4">
            <NavItems items={desktopNavItems} />
            <NavbarButton
              as="button"
              variant="secondary"
              onClick={toggleTheme}
              className="p-2"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <IconSun className="h-5 w-5" />
              ) : (
                <IconMoon className="h-5 w-5" />
              )}
            </NavbarButton>
            <NavbarButton
              as="button"
              variant="primary"
              onClick={handleAuth}
              disabled={!authMounted}
              aria-label={authMounted ? undefined : "Cargando autenticación"}
              className={!authMounted ? "opacity-50" : ""}
            >
              {getDefaultButtonText()}
            </NavbarButton>
          </div>
        </NavBody>

        {/* Mobile Navigation */}
        <MobileNav>
          <MobileNavHeader>
            <NavbarLogo icon={<IconPrescription />} text="Farma" href="/" />
            <MobileNavToggle
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
          </MobileNavHeader>

          <MobileNavMenu
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
          >
            {mobileNavItems.map((item, idx) => (
              <Link
                key={`mobile-link-${idx}`}
                href={item.link}
                onClick={() => setIsMobileMenuOpen(false)}
                className="relative w-full flex items-center justify-center gap-2 text-slate-600 dark:text-slate-300 py-2 px-4 rounded-md hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
              >
                {item.icon && <span className="text-xl">{item.icon}</span>}
                {item.name && <span className="block">{item.name}</span>}
                {item.count !== undefined && item.count > 0 && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-orange-500 text-xs text-white">
                    {item.count}
                  </span>
                )}
              </Link>
            ))}
            <NavbarButton
              as="button"
              variant="secondary"
              onClick={() => {
                toggleTheme();
              }}
              className="w-full flex items-center justify-center gap-2"
            >
              {theme === "dark" ? (
                <>
                  <IconSun className="h-5 w-5" />
                  <span>Modo claro</span>
                </>
              ) : (
                <>
                  <IconMoon className="h-5 w-5" />
                  <span>Modo oscuro</span>
                </>
              )}
            </NavbarButton>
            <NavbarButton
              as="button"
              variant="primary"
              onClick={() => {
                setIsMobileMenuOpen(false);
                handleAuth();
              }}
              className={`w-full ${!authMounted ? "opacity-50" : ""}`}
              disabled={!authMounted}
              aria-label={authMounted ? undefined : "Cargando autenticación"}
            >
              {getDefaultButtonText()}
            </NavbarButton>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>
    </div>
  );
}
