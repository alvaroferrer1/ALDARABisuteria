import type { Metadata } from "next";
import { getLimitedEditionsWithProducts } from "@/lib/limitedEditions";
import { EdicionesLimitadasContent } from "@/components/EdicionesLimitadasContent";

export const metadata: Metadata = {
  title: "Ediciones limitadas",
  description: "Series especiales de ALDARA en tirada corta y numerada.",
};

// Ediciones limitadas (Bloque 8, #85) — piezas reales del catálogo con
// numeración de tirada DEMO (`lib/limitedEditions.ts`), ya que ALDARA no
// lleva todavía un control de series real. Marcado como tal en cada tarjeta.
export default function EdicionesLimitadasPage() {
  const editions = getLimitedEditionsWithProducts();
  return <EdicionesLimitadasContent editions={editions} />;
}
