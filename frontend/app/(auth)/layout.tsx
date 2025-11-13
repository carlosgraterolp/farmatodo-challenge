import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Startup Landing | Aceternity Template",
  description:
    "Startup landing is a simple one page landing page for startups and agencies. Built with Next.js, Tailwind CSS, TypeScript and framer motion.",
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("antialiased", inter.className)}>
        {children}
      </body>
    </html>
  );
}
