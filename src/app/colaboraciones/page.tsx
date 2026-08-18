import type { Metadata } from "next";
import { COLLABORATIONS } from "@/lib/collaborations";
import { ColaboracionesContent } from "@/components/ColaboracionesContent";

export const metadata: Metadata = {
  title: "Colaboraciones",
  description: "Proyectos de ALDARA con creadoras y cultura — colaboraciones de ejemplo mientras se confirman proyectos reales.",
};

// Colaboraciones (Bloque 8, #89) — DATOS DEMO explícitos (`lib/collaborations.ts`).
export default function ColaboracionesPage() {
  return <ColaboracionesContent items={COLLABORATIONS} />;
}
