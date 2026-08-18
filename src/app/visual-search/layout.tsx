import type { Metadata } from "next";

// El page.tsx de /visual-search es "use client"; el metadata real vive aquí.
export const metadata: Metadata = {
  title: "Búsqueda visual",
  description: "Encuentra piezas ALDARA filtrando por color, categoría y estilo — sin fingir reconocimiento de imagen que no existe.",
};

export default function VisualSearchLayout({ children }: { children: React.ReactNode }) {
  return children;
}
