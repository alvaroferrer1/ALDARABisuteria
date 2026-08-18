/**
 * DEMO / FIXTURE — Exposición digital "Raíces que brillan" (Bloque 8, #93).
 * Contenido narrativo original de esta demo (no un texto real de marca
 * confirmado por el cliente), marcado como tal. Productos asociados son
 * reales del catálogo.
 */
export interface ExhibitionChapter {
  number: string;
  title: string;
  text: string;
  tone: string;
  productIds: string[];
}

export const EXHIBITION = {
  title: "Raíces que brillan",
  intro: "Una exposición digital demo sobre cómo una historia familiar se convierte en piezas que se pueden llevar puestas.",
  isDemo: true as const,
  chapters: [
    { number: "01", title: "Origen", text: "Dos países, una maleta y un puñado de cuentas de colores.", tone: "var(--terracotta)", productIds: ["p4"] },
    { number: "02", title: "Encuentro", text: "El primer mercadillo, la primera vez que alguien pagó por una pulsera hecha en casa.", tone: "var(--gold)", productIds: ["p1"] },
    { number: "03", title: "Símbolos", text: "Cada charm es una palabra pequeña: una inicial, un mapa, una flor.", tone: "var(--blue)", productIds: ["p12", "p9"] },
    { number: "04", title: "Color", text: "El tricolor de Venezuela, el azul y blanco colombiano — presentes sin gritar.", tone: "var(--gold-light)", productIds: ["p6", "p10"] },
    { number: "05", title: "Memoria", text: "Lo que empezó en una cocina de Puerto Almenara ahora viaja con quien lo lleva puesto.", tone: "var(--terracotta)", productIds: ["p7", "p8"] },
  ] satisfies ExhibitionChapter[],
};
