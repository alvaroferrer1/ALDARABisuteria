import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tarjeta regalo",
  description: "Compra una tarjeta regalo ALDARA — elige el importe, para quién es, y se canjea en el checkout.",
};

export default function GiftCardsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
