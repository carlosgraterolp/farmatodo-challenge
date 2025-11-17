import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { NavbarWrapper } from "@/components/navbar-wrapper";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/components/auth-provider";
import { CenteredWithLogo } from "@/components/ui/footer";
import { AuroraBackground } from "@/components/ui/aurora-background";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Farma",
  description: "Tu farmacia en línea, siempre disponible.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>
          <AuthProvider>
            <AuroraBackground className="-z-10" />
            <div className="relative z-0">
              <NavbarWrapper />
              <main className="min-h-screen">{children}</main>
              <CenteredWithLogo />
            </div>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
