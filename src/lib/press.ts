/**
 * DEMO / FIXTURE — ALDARA no tiene menciones de prensa reales todavía.
 * Se usan medios genéricos claramente ficticios ("Demo Magazine") en vez de
 * cabeceras reales (Vogue, Elle, etc.), tal y como exige la política
 * anti-fabricación de este proyecto. Sustituir por menciones reales en
 * cuanto existan.
 */
export interface PressMention {
  outlet: string;
  quote: string;
  date: string;
  tone: string;
  isDemo: true;
}

export const PRESS_MENTIONS: PressMention[] = [
  { outlet: "Demo Magazine", quote: "Piezas que llevan un mapa de casa colgado del cuello.", date: "2026-03-01", tone: "var(--terracotta)", isDemo: true },
  { outlet: "Demo Culture", quote: "Bisutería artesanal con dos banderas por delante.", date: "2025-11-14", tone: "var(--gold)", isDemo: true },
  { outlet: "Demo Design", quote: "Un ejemplo de cómo un taller pequeño construye una identidad propia.", date: "2025-06-22", tone: "var(--blue)", isDemo: true },
];

export const PRESS_KIT_ITEMS = [
  { label: "Logo pack (SVG/PNG)", isDemo: true },
  { label: "Paleta de color de marca", isDemo: true },
  { label: "Fotografía de producto (demo)", isDemo: true },
  { label: "Dossier de marca (PDF)", isDemo: true },
] as const;
