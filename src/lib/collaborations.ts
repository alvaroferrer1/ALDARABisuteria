/**
 * DEMO / FIXTURE — colaboraciones ficticias, marcadas explícitamente como
 * demo, para construir la experiencia del Bloque 8 (#89 Colaboraciones) sin
 * inventar nombres reales de creadoras/estudios que no existen. Sustituir
 * por colaboraciones reales en cuanto existan.
 */
export interface Collaboration {
  slug: string;
  partner: string;
  title: string;
  description: string;
  year: number;
  tone: string;
  productIds: string[];
  isDemo: true;
}

export const COLLABORATIONS: Collaboration[] = [
  {
    slug: "taller-raiz",
    partner: "Taller Raíz",
    title: "ALDARA × Taller Raíz",
    description: "Un proyecto demo sobre cómo dos talleres artesanos, cada uno con su propia técnica, combinan piezas para contar una historia común de origen.",
    year: 2025,
    tone: "var(--terracotta)",
    productIds: ["p1", "p9"],
    isDemo: true,
  },
  {
    slug: "estudio-tierra",
    partner: "Estudio Tierra",
    title: "ALDARA × Estudio Tierra",
    description: "Colección cápsula demo centrada en materiales naturales — piedra, hilo y latón — trabajados a mano desde el respeto al material.",
    year: 2025,
    tone: "var(--gold)",
    productIds: ["p7", "p8"],
    isDemo: true,
  },
  {
    slug: "colectivo-origen",
    partner: "Colectivo Origen",
    title: "ALDARA × Colectivo Origen",
    description: "Proyecto demo con un colectivo de artesanas centroamericanas, explorando el trenzado y el color como lenguaje compartido.",
    year: 2026,
    tone: "var(--blue)",
    productIds: ["p4", "p5"],
    isDemo: true,
  },
];

export function getCollaborationBySlug(slug: string): Collaboration | undefined {
  return COLLABORATIONS.find((c) => c.slug === slug);
}
