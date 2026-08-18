import type { Metadata } from "next";
import { PRESS_MENTIONS, PRESS_KIT_ITEMS } from "@/lib/press";
import { PrensaContent } from "@/components/PrensaContent";

export const metadata: Metadata = {
  title: "Prensa",
  description: "Press kit y contacto profesional de ALDARA.",
};

// Press / Media (Bloque 8, #90) — DATOS DEMO explícitos (`lib/press.ts`).
// Nunca se fabrican logos ni menciones de medios reales (Vogue, Elle...).
export default function PrensaPage() {
  return <PrensaContent mentions={PRESS_MENTIONS} kitItems={PRESS_KIT_ITEMS} />;
}
