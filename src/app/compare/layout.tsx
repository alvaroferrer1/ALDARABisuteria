import type { Metadata } from "next";

// El page.tsx de /compare es "use client" (localStorage); metadata aquí.
export const metadata: Metadata = { title: "Comparar piezas", robots: { index: false, follow: true } };

export default function CompareLayout({ children }: { children: React.ReactNode }) {
  return children;
}
