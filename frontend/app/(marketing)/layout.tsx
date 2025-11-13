import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { cn } from "@/lib/utils";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Startup Landing | Aceternity Template",
  description:
    "Startup landing is a simple one page landing page for startups and agencies. Built with Next.js, Tailwind CSS, TypeScript and framer motion.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("antialiased", inter.className)}>
        <Navbar />
          {children}
        <Footer />
      </body>
    </html>
  );
}
