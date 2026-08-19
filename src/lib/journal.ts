export interface JournalPost {
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  content: string[];
  relatedProductIds: string[];
  publishedAt: string;
}

export const JOURNAL_POSTS: JournalPost[] = [
  {
    slug: "como-combinar-pendientes-pequenos",
    title: "Cómo combinar pendientes pequeños para el día a día",
    category: "Styling",
    excerpt: "Los aros pequeños son la pieza que menos falla: aquí tienes tres formas de llevarlos según el momento.",
    content: [
      "Los pendientes pequeños tienen una ventaja que no siempre valoramos: se llevan con todo. No compiten con el resto del look, no pesan al final del día y funcionan igual en una reunión que en una cena.",
      "Para el trabajo, un aro fino en baño de oro es casi invisible pero sube el conjunto entero. Para salir, combínalo con un charm colgante o una segunda perforación con un punto de luz.",
      "Nuestra recomendación: ten un par de aros pequeños como base y ve sumando piezas alrededor, no al revés.",
    ],
    relatedProductIds: ["p1", "p3"],
    publishedAt: "2026-06-02",
  },
  {
    slug: "que-significa-el-tricolor-en-nuestras-piezas",
    title: "Qué significa el tricolor en nuestras piezas",
    category: "Historias",
    excerpt: "El amarillo, azul y rojo aparecen en varias piezas de ALDARA. Te contamos por qué, sin la bandera entera.",
    content: [
      "No queríamos hacer joyería con la bandera entera — eso ya existe y no es lo nuestro. Queríamos algo que se pudiera llevar un martes cualquiera sin que pareciera un disfraz.",
      "Por eso el tricolor aparece como detalle: un hilo de color en una cadena, un esmalte diminuto en un charm. Suficiente para reconocerlo si sabes lo que estás mirando, discreto si no.",
    ],
    relatedProductIds: ["p6", "p10"],
    publishedAt: "2026-05-18",
  },
  {
    slug: "guia-de-regalo-menos-de-20-euros",
    title: "Guía de regalo: menos de 20 €",
    category: "Regalos",
    excerpt: "Tres ideas con presupuesto ajustado que no parecen un relleno de última hora.",
    content: [
      "Un buen regalo pequeño no tiene por qué sentirse pequeño. Estas son las piezas que recomendamos cuando el presupuesto es de 20 € o menos.",
      "Los charms individuales (8 €) funcionan solos o para completar una pulsera que la persona ya tenga. Los aros pequeños (14-18 €) son casi un acierto seguro.",
    ],
    relatedProductIds: ["p3", "p10", "p11", "p12"],
    publishedAt: "2026-04-30",
  },
  {
    slug: "cuidar-bano-de-oro-en-verano",
    title: "Cómo cuidar el baño de oro en verano",
    category: "Materiales",
    excerpt: "Playa, piscina y protector solar son los tres grandes enemigos del baño de oro. Así puedes protegerlo.",
    content: [
      "El verano es la época del año que más desgasta cualquier pieza bañada en oro: cloro, sal y crema solar se acumulan sobre el metal.",
      "La regla más simple: la joya se pone la última, después de la crema, y se quita la primera, antes de meterte al agua.",
    ],
    relatedProductIds: ["p9", "p8"],
    publishedAt: "2026-06-20",
  },
];

export function getAllPosts(): JournalPost[] {
  return JOURNAL_POSTS;
}
export function getPostBySlug(slug: string): JournalPost | undefined {
  return JOURNAL_POSTS.find((p) => p.slug === slug);
}

/** Cálculo trivial por recuento de palabras (~200 ppm), sin dependencias nuevas. */
export function readingTimeMinutes(post: JournalPost): number {
  const words = post.content.join(" ").trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

/** Acento por sección de la revista — usado en JournalPlate y en la portada. */
export const JOURNAL_CATEGORY_COLORS: Record<string, string> = {
  Styling: "var(--blue)",
  Historias: "var(--terracotta)",
  Regalos: "var(--gold)",
  Materiales: "var(--gold-light)",
};
