/**
 * DEMO / FIXTURE — ALDARA no tiene todavía un sistema de reseñas real
 * conectado. Estas valoraciones y comentarios son de ejemplo (`isDemo: true`
 * en cada objeto), usados solo para reproducir el diseño aprobado de
 * "Best Sellers / Más queridas" (p.13). Nunca se presentan como reseñas de
 * clientas reales — sustituir por reseñas reales en cuanto existan.
 */
export interface ProductRating {
  productId: string;
  rating: number;
  count: number;
  isDemo: true;
}

export const PRODUCT_RATINGS: ProductRating[] = [
  { productId: "p4", rating: 4.6, count: 124, isDemo: true },
  { productId: "p12", rating: 4.8, count: 98, isDemo: true },
  { productId: "p9", rating: 4.9, count: 156, isDemo: true },
  { productId: "p7", rating: 4.7, count: 87, isDemo: true },
  { productId: "p10", rating: 4.8, count: 63, isDemo: true },
  { productId: "p1", rating: 4.7, count: 72, isDemo: true },
  { productId: "p3", rating: 4.9, count: 111, isDemo: true },
];

export function getRatingFor(productId: string): ProductRating | undefined {
  return PRODUCT_RATINGS.find((r) => r.productId === productId);
}

export interface ReviewQuote {
  author: string;
  quote: string;
  stars: number;
  isDemo: true;
}

export const REVIEW_QUOTES: ReviewQuote[] = [
  { author: "Cliente demo 01", quote: "Me encanta cómo combinan los colores y el significado. Se nota que están hechas con amor.", stars: 5, isDemo: true },
  { author: "Cliente demo 02", quote: "La pulsera de amuletos es mi favorita, no me la quito nunca. ¡Súper recomendable!", stars: 5, isDemo: true },
  { author: "Cliente demo 03", quote: "Piezas únicas que te cuentan historias y te hacen sentir conectada.", stars: 5, isDemo: true },
];

export const OVERALL_RATING = { average: 4.9, count: 842, isDemo: true as const };
