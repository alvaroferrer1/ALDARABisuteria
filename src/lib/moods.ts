export interface Mood {
  slug: string;
  name: string;
  sensoryLine: string; // no es un nombre de categoría — describe una sensación
  description: string;
  color: string; // acento CSS var, tiñe el fondo cuando este mood está activo
  productIds: string[];
}

/**
 * MOOD SHOP — vender por sensación real, no filtros renombrados (p.20 del
 * PDF maestro, "Bloque 2 · Descubrimiento editorial"). A diferencia de
 * `/shop` (filtros de categoría/precio/talla) aquí solo hay una elección:
 * cómo te quieres sentir hoy. Cada mood tiñe la página entera con su color
 * y trae una curación pequeña con una línea sensorial, no una ficha técnica.
 */
export const MOODS: Mood[] = [
  {
    slug: "atrevida",
    name: "Atrevida",
    sensoryLine: "Para los días en los que quieres que te vean llegar",
    description:
      "Color que no pide permiso, formas con presencia. Piezas para cuando el look necesita un punto de partida claro.",
    color: "var(--terracotta)",
    productIds: ["p6", "p10", "p7"],
  },
  {
    slug: "serena",
    name: "Serena",
    sensoryLine: "Para cuando menos es exactamente lo que necesitas",
    description: "Líneas limpias, brillo bajo, nada que compita con el resto del día. Piezas que se llevan y se olvidan — en el buen sentido.",
    color: "var(--blue)",
    productIds: ["p9", "p5", "p3"],
  },
  {
    slug: "nostalgica",
    name: "Nostálgica",
    sensoryLine: "Para llevar puesta una historia, no solo un accesorio",
    description: "Piezas con raíz: las que recuerdan a alguien, a un lugar, a una fecha. Las que se heredan sin querer.",
    color: "var(--gold)",
    productIds: ["p2", "p8", "p11"],
  },
  {
    slug: "luminosa",
    name: "Luminosa",
    sensoryLine: "Para las mañanas en las que todo empieza bien",
    description: "Oro cálido, formas sencillas, la pieza que te pones sin pensar y que ilumina la cara en dos segundos.",
    color: "var(--gold-light)",
    productIds: ["p1", "p4", "p12"],
  },
  // 2 moods añadidos esta pasada — el mockup (p.21, "25. MOOD SHOP") muestra
  // 6 sensaciones, no 4, gap real detectado en comparación directa PDF↔LIVE.
  // Reutilizan productos reales ya existentes (nunca se inventa producto
  // nuevo), como ya hacían los otros 4 moods.
  {
    slug: "curiosa",
    name: "Curiosa",
    sensoryLine: "Para las piezas que dan pie a preguntas",
    description: "Símbolos, mapas y significados que invitan a contar la historia detrás. Piezas que abren conversación, no solo acompañan.",
    color: "var(--terracotta)",
    productIds: ["p9", "p7", "p2"],
  },
  {
    slug: "libre",
    name: "Libre",
    sensoryLine: "Para los días sin plan y con ganas de todo",
    description: "Trenzados, colores mezclados, piezas que se combinan entre sí sin reglas. Nada demasiado serio.",
    color: "var(--blue)",
    productIds: ["p5", "p6", "p10"],
  },
];

export function getAllMoods(): Mood[] {
  return MOODS;
}

export function getMoodBySlug(slug: string): Mood | undefined {
  return MOODS.find((m) => m.slug === slug);
}
