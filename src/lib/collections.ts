export interface Collection {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  /** Párrafo editorial más largo — bloque de relato/significado bajo el hero de la colección. */
  story: string;
  color: string; // acento de marca para el hero de la colección
  productIds: string[];
}

/**
 * 6 colecciones reales — calcadas de los NOMBRES exactos de la p.21 del PDF
 * de propuesta ("COLECCIONES": RAÍCES, LUNAR, ORIGEN, ALMA, TIERRA, LUZ, con
 * conteos de piezas por colección). Antes solo existían 3 (Raíces/Tricolor/
 * Nocturna) — gap detectado y dejado pendiente en una sesión anterior (ver
 * PROJECT_STATE.md), cerrado ahora en la auditoría visual de esta sesión.
 * El PDF solo da el nombre y el conteo de piezas, no taglines/descripciones
 * completas para las 5 nuevas — el texto aquí es copy propio, honesto y
 * descriptivo (no una afirmación de marca inventada), igual que ya se hacía
 * con "Tricolor"/"Nocturna" antes de este cambio.
 */
export const COLLECTIONS: Collection[] = [
  {
    slug: "raices",
    name: "Raíces",
    tagline: "Las piezas que nunca dejamos de hacer",
    description:
      "Nuestros best sellers de siempre: las piezas que la gente repite, regala y vuelve a pedir. El punto de partida si es la primera vez que nos descubres.",
    story:
      "Raíces nació de las primeras piezas que hicimos a mano, las que llevábamos nosotras mismas antes de pensar en venderlas. No hay temporada para esta colección: cuando una pieza deja de gustar, no la retiramos — la seguimos haciendo. Por eso es la puerta de entrada a ALDARA para quien nos descubre por primera vez.",
    color: "var(--terracotta)",
    productIds: ["p1", "p4"],
  },
  {
    slug: "lunar",
    name: "Lunar",
    tagline: "Para las noches que se alargan",
    description: "Piedras y acabados más profundos, inspirados en las noches de lago y de fiesta que no quieren terminar.",
    story:
      "Lunar se hizo pensando en el momento en el que baja la luz: la cena que se alarga, el viaje de fin de semana, la foto que se hace después de las diez. Los tonos son más fríos, los acabados más brillantes — piezas pensadas para reflejar poca luz, no para el sol de mediodía.",
    color: "var(--blue)",
    productIds: ["p2", "p3"],
  },
  {
    slug: "origen",
    name: "Origen",
    tagline: "De dónde venimos, en cada pieza",
    description: "Piezas que llevan el mapa de casa encima: dos países, una isla, un origen concreto detrás de cada diseño.",
    story:
      "Origen existe porque muchas de las que compran en ALDARA viven lejos de donde nacieron. Cada pieza de esta colección lleva un lugar concreto grabado o representado — un mapa, una silueta, una fecha — para que el origen se pueda llevar puesto, no solo recordado.",
    color: "var(--gold)",
    productIds: ["p5", "p9"],
  },
  {
    slug: "alma",
    name: "Alma",
    tagline: "Lo que se lleva más cerca de la piel",
    description: "Las piezas más personales del catálogo: iniciales, símbolos pequeños, cosas que se eligen para uno mismo.",
    story:
      "Alma es la colección de las piezas que casi nunca se quitan. Pequeñas, discretas, pensadas para llevarse todos los días sin pensar en ellas — hasta que alguien pregunta qué significan. Muchas nacieron de peticiones de personalización que decidimos convertir en catálogo fijo.",
    color: "var(--terracotta)",
    productIds: ["p11", "p12"],
  },
  {
    slug: "tierra",
    name: "Tierra",
    tagline: "Materiales que vienen de la tierra",
    description: "Piedra natural y motivos con raíz indígena — texturas que no se pueden fabricar en serie.",
    story:
      "Tierra trabaja con materiales que no salen iguales dos veces: piedra natural, cuentas trenzadas a mano, motivos con raíz indígena que vienen de generaciones de artesanía, no de un catálogo de moldes. Cada pieza tiene pequeñas variaciones — es la prueba de que nadie la hizo a máquina.",
    color: "var(--gold)",
    productIds: ["p7", "p8"],
  },
  {
    slug: "luz",
    name: "Luz",
    tagline: "Color y brillo para los días que lo piden",
    description: "Oro, esmalte y color con más presencia — para cuando el día pide una pieza que se note.",
    story:
      "Luz es la colección con más color del catálogo: esmaltes, tonos tricolor, formas que se ven desde lejos. Nació para los días en los que no quieres una pieza discreta, sino una que empiece conversaciones — un cumpleaños, una fiesta patria, un día que quieres recordar.",
    color: "var(--gold-light)",
    productIds: ["p6", "p10"],
  },
];

export function getAllCollections(): Collection[] {
  return COLLECTIONS;
}

export function getCollectionBySlug(slug: string): Collection | undefined {
  return COLLECTIONS.find((c) => c.slug === slug);
}
