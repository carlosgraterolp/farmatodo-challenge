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
import {
  IconShoppingCart,
  IconSun,
  IconMoon,
  IconPrescription,
  IconShoppingBag,
} from "@tabler/icons-react";
import { useTheme } from "@/components/theme-provider";

export function NavbarWrapper() {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
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
        const total = items.reduce(
          (sum: number, item: any) => sum + item.quantity,
          0
        );
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
      name: "",
      link: "/tienda",
      icon: <IconShoppingBag />,
    },
    {
      name: "",
      link: "/cart",
      icon: <IconShoppingCart />,
      count: cartCount,
    },
  ];

  return (
    <div className="sticky top-0 left-0 right-0 z-50 w-full bg-white/95 backdrop-blur-sm dark:bg-neutral-950/95 py-2">
      <Navbar>
        {/* Desktop Navigation */}
        <NavBody>
          <NavbarLogo icon={<IconPrescription />} text="Farma" href="/" />

          <div className="flex items-center gap-4">
            <NavItems items={navItems} />
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
            <NavbarButton as="button" variant="primary" onClick={handleAuth}>
              {isLoggedIn ? "Cerrar sesión" : "Iniciar sesión"}
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
            {navItems.map((item, idx) => (
              <Link
                key={`mobile-link-${idx}`}
                href={item.link}
                onClick={() => setIsMobileMenuOpen(false)}
                className="relative flex items-center gap-2 text-slate-600 dark:text-slate-300"
              >
                {item.icon && <span className="text-2xl">{item.icon}</span>}
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
              className="w-full"
            >
              {isLoggedIn ? "Cerrar sesión" : "Iniciar sesión"}
            </NavbarButton>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>
    </div>
  );
}
