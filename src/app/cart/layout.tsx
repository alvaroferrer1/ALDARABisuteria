import type { Metadata } from "next";

// El page.tsx de /cart es "use client" (necesita el contexto del carrito),
// así que el metadata real vive aquí, en el layout del segmento.
export const metadata: Metadata = { title: "Tu cesta", robots: { index: false, follow: true } };

export default function CartLayout({ children }: { children: React.ReactNode }) {
  return children;
}
