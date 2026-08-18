export interface EditPick {
  productId: string;
  note: string; // por qué se eligió esta pieza — voz editorial, no ficha técnica
}

export interface Edit {
  slug: string;
  issue: string; // "Nº 01" — trata cada edit como una entrega de revista, no una categoría
  title: string;
  standfirst: string; // párrafo editorial corto, con voz
  byline: string;
  publishedAt: string; // ISO
  picks: EditPick[];
}

/**
 * THE EDIT — curación editorial con voz propia (p.20-21 del PDF maestro:
 * "Bloque 2 · Descubrimiento editorial"; ruta /edit/[slug] confirmada en
 * p.148 del PDF maestro como ejemplo de landing de campaña).
 * No es una categoría de producto ni una colección formal: son entregas
 * con opinión, como el "edit" de una revista, con pocas piezas y una razón
 * clara para cada una. Firmado honestamente como "El equipo ALDARA", sin
 * inventar un nombre de editor de moda que no existe.
 */
export const EDITS: Edit[] = [
  {
    slug: "para-empezar",
    issue: "Nº 01",
    title: "Si es tu primera vez con nosotros",
    standfirst:
      "No hace falta comprar toda la tienda para entender ALDARA. Estas cuatro piezas son las que recomendamos cuando alguien nos escribe preguntando por dónde empezar.",
    byline: "El equipo ALDARA",
    publishedAt: "2026-06-02",
    picks: [
      { productId: "p1", note: "El aro que casi todo el mundo se lleva puesto el primer día. Ligero, dorado, para todo." },
      { productId: "p12", note: "Un charm de iniciales — la pieza más personal sin ser la más arriesgada." },
      { productId: "p9", note: "Colgante discreto que no compite con nada, ideal para combinar con lo que ya tienes." },
      { productId: "p4", note: "La pulsera que se convierte en la de todos los días sin que te des cuenta." },
    ],
  },
  {
    slug: "menos-es-mas",
    issue: "Nº 02",
    title: "Menos es más",
    standfirst:
      "Una selección para quien prefiere una sola pieza bien puesta a cinco compitiendo entre sí. Formas simples, brillo comedido, mucho margen para llevarlas todos los días.",
    byline: "El equipo ALDARA",
    publishedAt: "2026-06-16",
    picks: [
      { productId: "p9", note: "El colgante que se lleva solo — cadena fina, punto de luz único." },
      { productId: "p5", note: "Una pulsera que no necesita compañía." },
      { productId: "p3", note: "Pendientes pequeños para las mañanas en las que no quieres pensar en el look." },
    ],
  },
  {
    slug: "para-regalar-sin-fallar",
    issue: "Nº 03",
    title: "Para regalar sin fallar",
    standfirst:
      "Las piezas que más veces hemos envuelto para otra persona. Ninguna necesita saber la talla exacta ni el gusto perfecto — funcionan casi siempre.",
    byline: "El equipo ALDARA",
    publishedAt: "2026-07-04",
    picks: [
      { productId: "p1", note: "El comodín: si dudas, este aro rara vez falla." },
      { productId: "p6", note: "Con más carácter, para quien no tiene miedo al color." },
      { productId: "p10", note: "Un charm con historia detrás — mejor si va acompañado de una Gift Story." },
    ],
  },
];

export function getAllEdits(): Edit[] {
  return [...EDITS].sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));
}

export function getEditBySlug(slug: string): Edit | undefined {
  return EDITS.find((e) => e.slug === slug);
}
