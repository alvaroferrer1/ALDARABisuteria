import { PRODUCTS } from "./products";

/**
 * DEMO / FIXTURE — "Packs que enamoran" (p.13). Los productos y sus
 * precios son reales; el descuento de pack es un dato demo (15%) hasta que
 * exista una política de packs real. Marcado como tal en el propio precio.
 */
export interface Pack {
  slug: string;
  name: string;
  sub: string;
  productIds: string[];
  discountPct: number;
  isDemo: true;
}

export const PACKS: Pack[] = [
  { slug: "pack-amigas", name: "Pack Amigas", sub: "2 pulseras tejidas", productIds: ["p4", "p5"], discountPct: 15, isDemo: true },
  { slug: "pack-proteccion", name: "Pack Protección", sub: "Collar + pulsera de amuletos", productIds: ["p7", "p4"], discountPct: 15, isDemo: true },
  { slug: "pack-viajeras", name: "Pack Viajeras", sub: "Collar mapa + pulsera", productIds: ["p9", "p5"], discountPct: 15, isDemo: true },
  { slug: "pack-completo", name: "Pack Completo", sub: "3 joyas + packaging premium", productIds: ["p1", "p9", "p12"], discountPct: 18, isDemo: true },
];

export function getPackWithPricing(pack: Pack) {
  const products = pack.productIds.map((id) => PRODUCTS.find((p) => p.id === id)).filter((p): p is NonNullable<typeof p> => !!p);
  const fullPrice = products.reduce((sum, p) => sum + p.price, 0);
  const packPrice = Math.round(fullPrice * (1 - pack.discountPct / 100) * 100) / 100;
  return { ...pack, products, fullPrice, packPrice };
}
