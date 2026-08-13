import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.css";

/**
 * Root shell. Deliberately thin: it supplies Inter and the page floor, and
 * nothing else. Application chrome is a per-screen decision — a screen picks
 * `SalesforceChrome` or `LightChrome` itself, because which shell a screen
 * lives in is a substantive claim about who uses it, not a layout default.
 */

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "KeyShot ACE — Prototype Screens",
  description: "Future-state UI prototypes for the KeyShot ACE engagement.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-floor font-sans text-ink antialiased">{children}</body>
    </html>
  );
}
