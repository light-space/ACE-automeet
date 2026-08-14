import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.css";

/**
 * Root shell. Deliberately thin: it supplies Inter, the page floor, and the
 * theme class. Application chrome is a per-screen decision — a screen picks
 * `SalesforceChrome` or `LightChrome` itself, because which shell a screen
 * lives in is a substantive claim about who uses it, not a layout default.
 *
 * `className="light"` is load-bearing and is axolotl's own mechanism: its
 * `addBase` plugin (ported in `tailwind.config.cjs`) puts the DARK theme on
 * `:root` and the light theme on `.light`. We want light. Both themes are
 * vendored verbatim in `lib/light-theme/`, so the choice lives here, in one
 * attribute — never as an edit to the vendored files.
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
    <html lang="en" className={`light ${inter.variable}`}>
      <body className="min-h-screen bg-floor font-sans text-ink antialiased">{children}</body>
    </html>
  );
}
