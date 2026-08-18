import type { Product, ProductCategory } from "./types";

/**
 * Catálogo de demostración. Contenido y precios de ejemplo mientras
 * ALDARA prepara su catálogo real y fotografía de producto.
 */
export const CATEGORY_LABELS: Record<ProductCategory, string> = {
  pendientes: "Pendientes",
  pulseras: "Pulseras",
  colgantes: "Colgantes",
  charms: "Charms",
};

export const PRODUCTS: Product[] = [
  {
    id: "p1",
    slug: "aro-caribe",
    name: "Aro Caribe",
    category: "pendientes",
    price: 18,
    description: "Aro dorado de líneas suaves, ligero para uso diario.",
    story:
      "Nace de los aros que se veían en cada feria de artesanía de Puerto Almenara: sencillos, luminosos, para llevar todos los días sin pensarlo dos veces.",
    materials: "Baño de oro 18k · acero quirúrgico",
    care: "Evita el agua salada y el cloro directo. Guarda en su bolsita.",
    badges: ["bestseller"],
    tint: 0,
    icon: "earring",
    stock: 14,
  },
  {
    id: "p2",
    slug: "gotas-de-guatavita",
    name: "Gotas de Guatavita",
    category: "pendientes",
    price: 16,
    description: "Pendiente colgante con perla cultivada, inspirado en las noches de lago.",
    story: "Un guiño a la laguna de Guatavita al atardecer, cuando el agua se pone del color de una perla.",
    materials: "Baño de oro 18k · perla cultivada",
    care: "Seca bien tras la ducha; la perla es sensible a productos químicos.",
    tint: 1,
    icon: "earring",
    stock: 9,
  },
  {
    id: "p3",
    slug: "luna-criolla",
    name: "Luna Criolla",
    category: "pendientes",
    price: 14,
    description: "Mini aros con luna creciente grabada a mano.",
    story: "Diseñados para apilar con otros pendientes sin competir por protagonismo.",
    materials: "Baño de oro 18k · acero quirúrgico",
    care: "Resistentes al agua; evita golpes directos sobre el grabado.",
    badges: ["new"],
    tint: 2,
    icon: "earring",
    stock: 20,
  },
  {
    id: "p4",
    slug: "pulsera-vzla",
    name: "Pulsera VZLA",
    category: "pulseras",
    price: 15,
    description: "Cuentas de colores con letras personalizadas, tal cual las llevamos nosotras.",
    story: "La primera pieza que existió de ALDARA, mucho antes de que existiera ALDARA.",
    materials: "Cristal checo · latón dorado",
    care: "Ajustable; evita tensar demasiado el cordón al ponerla y quitarla.",
    badges: ["bestseller", "personalizable"],
    tint: 0,
    icon: "bracelet",
    stock: 11,
  },
  {
    id: "p5",
    slug: "hilos-de-providencia",
    name: "Hilos de Providencia",
    category: "pulseras",
    price: 12,
    description: "Trenzada a mano, ajustable, inspirada en las dos islas hermanas del Caribe.",
    story: "Cada hilo representa una de las dos islas, San Andrés y Providencia: dos formas, un mismo origen.",
    materials: "Hilo encerado · detalle dorado",
    care: "No sumergir en agua durante mucho tiempo; el hilo puede perder tensión.",
    tint: 1,
    icon: "bracelet",
    stock: 16,
  },
  {
    id: "p6",
    slug: "cadena-tricolor",
    name: "Cadena Tricolor",
    category: "pulseras",
    price: 20,
    compareAtPrice: 24,
    description: "Cadena fina bañada en oro con detalle tricolor esmaltado.",
    story: "El amarillo, azul y rojo de Venezuela reducidos a un detalle discreto, para el día a día.",
    materials: "Baño de oro 18k · esmalte",
    care: "Evita productos abrasivos sobre el esmalte de color.",
    tint: 2,
    icon: "bracelet",
    stock: 6,
  },
  {
    id: "p7",
    slug: "colgante-cacique",
    name: "Colgante Cacique",
    category: "colgantes",
    price: 22,
    description: "Medalla con motivo indígena grabado en relieve.",
    story: "Inspirado en los petroglifos que ambas abuelas describían de memoria.",
    materials: "Baño de oro 18k · acero quirúrgico",
    care: "Limpia con paño seco; evita perfumes directos sobre la pieza.",
    tint: 0,
    icon: "pendant",
    stock: 8,
  },
  {
    id: "p8",
    slug: "gota-de-ambar",
    name: "Gota de Ámbar",
    category: "colgantes",
    price: 19,
    description: "Piedra natural engarzada en baño de oro.",
    story: "Cada piedra es única: el veteado del ámbar nunca se repite igual dos veces.",
    materials: "Piedra natural · baño de oro 18k",
    care: "Piedra natural: evita golpes y cambios bruscos de temperatura.",
    badges: ["limited"],
    tint: 1,
    icon: "pendant",
    // Edición limitada agotada — demo deliberada para poder construir y
    // verificar de verdad "Back in Stock" (ver BackInStockForm.tsx), no un
    // 0 accidental. El resto del catálogo mantiene su stock real de demo.
    stock: 0,
  },
  {
    id: "p9",
    slug: "mapa-del-alma",
    name: "Mapa del Alma",
    category: "colgantes",
    price: 24,
    description: "Silueta personalizable: dos países, un mismo mapa. Nuestra pieza más pedida.",
    story: "La pieza que más nos han pedido desde el primer mercadillo: llevar dos países al mismo tiempo, sin elegir.",
    materials: "Baño de oro 18k · grabado a medida",
    care: "Grabado resistente al agua; evita limpiadores abrasivos.",
    badges: ["bestseller", "personalizable"],
    tint: 2,
    icon: "pendant",
    stock: 10,
  },
  {
    id: "p10",
    slug: "charm-bandera",
    name: "Charm Bandera",
    category: "charms",
    price: 8,
    description: "Esmaltado a mano con los colores de casa, para combinar con tu pulsera favorita.",
    story: "Pensado para añadir a una cadena o pulsera ya existente, sin tener que empezar de cero.",
    materials: "Latón dorado · esmalte",
    care: "Evita productos abrasivos sobre el esmalte.",
    tint: 0,
    icon: "charm",
    stock: 25,
  },
  {
    id: "p11",
    slug: "charm-cacao",
    name: "Charm Cacao",
    category: "charms",
    price: 8,
    description: "Grano de cacao bañado en oro, guiño a la tierra colombiana.",
    story: "Colombia es cacao de exportación; este charm es nuestro pequeño homenaje.",
    materials: "Baño de oro 18k",
    care: "Resistente al agua y al uso diario.",
    badges: ["new"],
    tint: 1,
    icon: "charm",
    stock: 18,
  },
  {
    id: "p12",
    slug: "charm-inicial",
    name: "Charm Inicial",
    category: "charms",
    price: 7,
    description: "Letra personalizada bañada en oro de 18k.",
    story: "El charm más regalado: una inicial, un nombre, una manera de llevar a alguien encima.",
    materials: "Baño de oro 18k",
    care: "Resistente al agua y al uso diario.",
    badges: ["personalizable"],
    tint: 2,
    icon: "charm",
    stock: 30,
  },
];

export function getAllProducts(): Product[] {
  return PRODUCTS;
}

export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function getProductById(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}

export function getRelatedProducts(product: Product, limit = 4): Product[] {
  return PRODUCTS.filter((p) => p.category === product.category && p.id !== product.id).slice(0, limit);
}

// Mismos materiales reales que /materiales (ver lib de esa página) — se
// reutiliza aquí como filtro real del catálogo, calcando el filtro
// "Material" del mockup de /shop (p.14 del PDF de propuesta).
export const SHOP_MATERIALS = ["bano-de-oro", "acero-quirurgico", "piedras-naturales", "perlas-cultivadas", "cristal-checo", "hilo-encerado"] as const;
export type ShopMaterial = (typeof SHOP_MATERIALS)[number];
export const SHOP_MATERIAL_LABELS: Record<ShopMaterial, string> = {
  "bano-de-oro": "Baño de oro 18k",
  "acero-quirurgico": "Acero quirúrgico",
  "piedras-naturales": "Piedra natural",
  "perlas-cultivadas": "Perla cultivada",
  "cristal-checo": "Cristal checo",
  "hilo-encerado": "Hilo encerado",
};
const SHOP_MATERIAL_KEYWORDS: Record<ShopMaterial, string> = {
  "bano-de-oro": "baño de oro",
  "acero-quirurgico": "acero quirúrgico",
  "piedras-naturales": "piedra natural",
  "perlas-cultivadas": "perla cultivada",
  "cristal-checo": "cristal checo",
  "hilo-encerado": "hilo encerado",
};

export interface ProductFilters {
  category?: ProductCategory | "todos";
  search?: string;
  sort?: "default" | "price-asc" | "price-desc" | "name";
  materials?: ShopMaterial[];
  maxPrice?: number;
  tints?: Array<0 | 1 | 2>;
}

export function filterProducts(filters: ProductFilters): Product[] {
  let items = PRODUCTS.slice();
  if (filters.category && filters.category !== "todos") {
    items = items.filter((p) => p.category === filters.category);
  }
  if (filters.search) {
    const q = filters.search.trim().toLowerCase();
    if (q) {
      items = items.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.includes(q)
      );
    }
  }
  if (filters.materials && filters.materials.length > 0) {
    items = items.filter((p) => {
      const materialsLower = p.materials.toLowerCase();
      return filters.materials!.some((m) => materialsLower.includes(SHOP_MATERIAL_KEYWORDS[m]));
    });
  }
  if (typeof filters.maxPrice === "number") {
    items = items.filter((p) => p.price <= filters.maxPrice!);
  }
  if (filters.tints && filters.tints.length > 0) {
    items = items.filter((p) => filters.tints!.includes(p.tint));
  }
  if (filters.sort === "price-asc") items.sort((a, b) => a.price - b.price);
  if (filters.sort === "price-desc") items.sort((a, b) => b.price - a.price);
  if (filters.sort === "name") items.sort((a, b) => a.name.localeCompare(b.name));
  return items;
}
