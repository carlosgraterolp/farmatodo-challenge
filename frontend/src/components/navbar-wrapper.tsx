"use client";
import Link from "next/link";
import { useState } from "react";
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
  const navItems = [
    {
      name: "Clientes",
      link: "/#clientes",
    },
    {
      name: "Tienda",
      link: "/#productos",
    },
    {
      name: "Checkout",
      link: "/#checkout",
    },
    {
      name: "Ordenes",
      link: "/#ordenes",
    },
  ];

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
            <NavbarButton variant="primary" href="/auth">
              Iniciar sesión
            </NavbarButton>
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
            <div className="flex w-full flex-col gap-4">
              <NavbarButton
                onClick={() => setIsMobileMenuOpen(false)}
                variant="primary"
                className="w-full"
                href="/registro"
              >
                Registrarse
              </NavbarButton>
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>
    </div>
  );
}
