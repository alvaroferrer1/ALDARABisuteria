import type { Metadata } from "next";

// /checkout y /checkout/success son "use client"; el metadata real vive
// aquí, en el layout del segmento, y cubre ambas rutas.
export const metadata: Metadata = { title: "Checkout", robots: { index: false, follow: true } };

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
