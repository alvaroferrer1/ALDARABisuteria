import type { Metadata } from "next";
import { PackagingContent } from "@/components/PackagingContent";

export const metadata: Metadata = {
  title: "Packaging",
  description: "Cómo llega cada pieza ALDARA a tu casa: caja, papel, lazo y la tarjeta del artesano.",
};

// Master #53 "Packaging" — antes no existía ninguna página ni sección
// dedicada. No hay fotografía real del packaging físico todavía, así que la
// descripción es el propio contenido: se explica con texto y con el detalle
// ya visible en checkout (envoltorio de regalo), no se inventan fotos.
export default function PackagingPage() {
  return <PackagingContent />;
}
