/**
 * DEMO / FIXTURE — ALDARA no tiene todavía un calendario de eventos real
 * conectado. Estos son eventos de ejemplo, con fechas futuras ficticias,
 * para poder construir y probar la experiencia completa del mockup
 * (Bloque 8, #86 Eventos) sin inventar datos reales no verificables.
 * Sustituir por datos reales en cuanto existan — ver ASSET_REGISTRY.md.
 */
export interface AldaraEvent {
  slug: string;
  title: string;
  type: "Taller" | "Pop-up" | "Encuentro";
  date: string; // ISO
  location: string;
  description: string;
  price: number | "Gratis";
  spotsLeft: number | null;
  tone: string;
  isDemo: true;
}

const now = new Date();
function futureDate(daysFromNow: number): string {
  const d = new Date(now);
  d.setDate(d.getDate() + daysFromNow);
  return d.toISOString();
}
function pastDate(daysAgo: number): string {
  const d = new Date(now);
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString();
}

export const EVENTS: AldaraEvent[] = [
  {
    slug: "taller-crea-tu-charm",
    title: "Taller ALDARA: crea tu charm",
    type: "Taller",
    date: futureDate(18),
    location: "Taller ALDARA, Puerto Almenara",
    description: "Dos horas en nuestro taller aprendiendo a montar tu propio charm, con las mismas herramientas que usamos a diario.",
    price: 35,
    spotsLeft: 6,
    tone: "var(--terracotta)",
    isDemo: true,
  },
  {
    slug: "pop-up-raices",
    title: "Pop-up Raíces",
    type: "Pop-up",
    date: futureDate(34),
    location: "Mercado de artesanía, Puerto Almenara",
    description: "Un fin de semana con toda la colección Raíces al completo, piezas en edición limitada y descuentos solo presenciales.",
    price: "Gratis",
    spotsLeft: null,
    tone: "var(--gold)",
    isDemo: true,
  },
  {
    slug: "encuentro-cultura-bisuteria",
    title: "Encuentro: Cultura & Bisutería",
    type: "Encuentro",
    date: futureDate(52),
    location: "Videollamada",
    description: "Charla abierta sobre cómo Venezuela y Colombia inspiran cada colección, con turno de preguntas en directo.",
    price: "Gratis",
    spotsLeft: 40,
    tone: "var(--blue)",
    isDemo: true,
  },
  {
    slug: "workshop-pulseras-tejidas",
    title: "Workshop de pulseras tejidas",
    type: "Taller",
    date: pastDate(40),
    location: "Taller ALDARA, Puerto Almenara",
    description: "Técnica de trenzado con hilo encerado, la misma que usamos en nuestras pulseras — plazas agotadas.",
    price: 25,
    spotsLeft: 0,
    tone: "var(--terracotta)",
    isDemo: true,
  },
  {
    slug: "presentacion-nueva-coleccion",
    title: "Presentación nueva colección",
    type: "Encuentro",
    date: pastDate(75),
    location: "Puerto Almenara",
    description: "La primera vez que enseñamos en directo una colección completa antes de subirla a la web.",
    price: "Gratis",
    spotsLeft: 0,
    tone: "var(--gold-light)",
    isDemo: true,
  },
];

export function getUpcomingEvents(): AldaraEvent[] {
  return EVENTS.filter((e) => new Date(e.date) >= now).sort((a, b) => +new Date(a.date) - +new Date(b.date));
}
export function getPastEvents(): AldaraEvent[] {
  return EVENTS.filter((e) => new Date(e.date) < now).sort((a, b) => +new Date(b.date) - +new Date(a.date));
}
export function getEventBySlug(slug: string): AldaraEvent | undefined {
  return EVENTS.find((e) => e.slug === slug);
}
