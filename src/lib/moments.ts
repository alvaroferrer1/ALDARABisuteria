export interface Moment {
  slug: string;
  title: string;
  context: string; // la escena — cuándo y para qué, no un nombre de categoría
  stylingNote: string; // por qué estas piezas concretas funcionan juntas
  productIds: string[]; // combinación real de 2-3 piezas pensadas para llevarse juntas
}

/**
 * SHOP THE MOMENT — mezcla contexto + styling + producto (p.20 del PDF
 * maestro). A diferencia de Mood Shop (una sensación pura) y de Gift
 * Finder/Regalos (pensado para regalar a otra persona), aquí el punto de
 * partida es una ocasión concreta tuya y el resultado es una combinación
 * ya pensada para llevarse junta, no piezas sueltas.
 */
export const MOMENTS: Moment[] = [
  {
    slug: "entrevista-de-trabajo",
    title: "Entrevista de trabajo",
    context: "Quieres que se note que te has arreglado, sin que la joya hable más alto que tú.",
    stylingNote:
      "Aros pequeños y un colgante que se ve solo si te acercas. Nada que suene al moverte, nada que distraiga en videollamada.",
    productIds: ["p3", "p9"],
  },
  {
    slug: "boda-de-una-amiga",
    title: "La boda de una amiga",
    context: "Todo el día de pie, fotos toda la noche, y quieres brillar sin robarle protagonismo a la novia.",
    stylingNote: "Un colgante con más presencia, pendientes a juego en tono y una pulsera fina que no se enreda al bailar.",
    productIds: ["p8", "p2", "p5"],
  },
  {
    slug: "primer-cafe-de-la-manana",
    title: "El primer café de la mañana",
    context: "Ropa cómoda, prisa moderada, y las piezas que llevas puestas casi sin pensarlo.",
    stylingNote: "Las de todos los días: ligeras, doradas, que no hay que quitarse ni para dormir la siesta.",
    productIds: ["p1", "p12"],
  },
  {
    slug: "noche-de-viernes",
    title: "Noche de viernes",
    context: "Cena, luego planes, quizá bailar. Quieres notarlo en el espejo antes de salir por la puerta.",
    stylingNote: "Color con carácter y un charm que da pie a que te pregunten de dónde es. Se lleva bien con poco maquillaje o con mucho.",
    productIds: ["p6", "p10", "p7"],
  },
];

export function getAllMoments(): Moment[] {
  return MOMENTS;
}

export function getMomentBySlug(slug: string): Moment | undefined {
  return MOMENTS.find((m) => m.slug === slug);
}
