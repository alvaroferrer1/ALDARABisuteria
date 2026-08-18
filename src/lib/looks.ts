export interface LookHotspot {
  productId: string;
  x: number; // % desde la izquierda
  y: number; // % desde arriba
}

export type LookCategory = "diarios" | "ocasion" | "verano" | "capas";

export interface Look {
  slug: string;
  title: string;
  mood: string;
  description: string;
  hotspots: LookHotspot[];
  /** Categorías reales del mockup (p.21, "23. LOOKBOOK": Todos/Diarios/Ocasión/Verano/Capas). Un look puede pertenecer a varias si aplica de verdad. */
  categories: LookCategory[];
}

export const LOOKS: Look[] = [
  {
    slug: "noche-de-lago",
    title: "Noche de lago",
    mood: "Lunar",
    description: "Aros pequeños, un colgante con piedra y una pulsera fina para una cena que se alarga hasta tarde.",
    hotspots: [
      { productId: "p2", x: 28, y: 22 },
      { productId: "p8", x: 52, y: 46 },
      { productId: "p5", x: 70, y: 68 },
    ],
    categories: ["ocasion"],
  },
  {
    slug: "domingo-en-casa",
    title: "Domingo en casa",
    mood: "Raíces",
    description: "Piezas ligeras para llevar puestas todo el día sin pensarlo: aro, charm de iniciales y pulsera VZLA.",
    hotspots: [
      { productId: "p1", x: 30, y: 20 },
      { productId: "p12", x: 55, y: 45 },
      { productId: "p4", x: 68, y: 70 },
    ],
    categories: ["diarios"],
  },
  {
    slug: "fiesta-patria",
    title: "Fiesta patria",
    mood: "Luz",
    description: "El tricolor de Venezuela y los charms bandera para las fechas que se celebran por partida doble.",
    hotspots: [
      { productId: "p6", x: 32, y: 24 },
      { productId: "p10", x: 58, y: 48 },
      { productId: "p7", x: 66, y: 66 },
    ],
    categories: ["ocasion", "verano"],
  },
];

export function getAllLooks(): Look[] {
  return LOOKS;
}
export function getLookBySlug(slug: string): Look | undefined {
  return LOOKS.find((l) => l.slug === slug);
}
