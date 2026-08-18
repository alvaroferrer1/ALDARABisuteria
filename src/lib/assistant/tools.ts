import { PRODUCTS, CATEGORY_LABELS, getProductById } from "@/lib/products";
import type { Product, ProductCategory } from "@/lib/types";

/**
 * DataTools — capa de acceso a datos del asistente. Todo lo que devuelve
 * viene de `lib/products.ts` (catálogo real de esta demo) o de los archivos
 * JSON locales (pedidos). Nunca inventa productos, precios ni stock.
 * Sustituible por llamadas a un backend/API real sin cambiar la forma en que
 * `assistantProvider` las consume (misma firma de función).
 */

const CATEGORY_KEYWORDS: Record<ProductCategory, string[]> = {
  pendientes: ["pendiente", "pendientes", "aro", "aros", "oreja", "orejas", "earring"],
  pulseras: ["pulsera", "pulseras", "muñeca", "bracelet"],
  colgantes: ["colgante", "colgantes", "collar", "collares", "cadena", "necklace", "pendant"],
  charms: ["charm", "charms", "amuleto"],
};

export function detectCategory(text: string): ProductCategory | null {
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS) as [ProductCategory, string[]][]) {
    if (keywords.some((k) => text.includes(k))) return category;
  }
  return null;
}

// Solo interpreta un número como presupuesto si va acompañado de una señal
// real de precio ("€", "euros") o de una expresión de límite ("menos de X",
// "por debajo de X") — evita falsos positivos con números sueltos que no
// tienen nada que ver con dinero (bug real detectado en pruebas de entrada).
export function detectBudget(text: string): number | null {
  const withCurrency = text.match(/(\d{1,4})\s*(?:€|eur|euros?)\b/i);
  if (withCurrency) return Number(withCurrency[1]);
  const withLimit = text.match(/(?:menos de|por debajo de|máximo|hasta|presupuesto de?)\s*(\d{1,4})/i);
  return withLimit ? Number(withLimit[1]) : null;
}

function stripAccents(value: string): string {
  return value.normalize("NFD").replace(/[̀-ͯ]/g, "");
}

export function detectProductMention(text: string): Product | null {
  const normalized = stripAccents(text).toLowerCase();
  return PRODUCTS.find((p) => normalized.includes(stripAccents(p.name).toLowerCase())) ?? null;
}

export interface CatalogSearchParams {
  category?: ProductCategory | null;
  maxBudget?: number | null;
  gift?: boolean;
}

export function searchCatalog({ category, maxBudget, gift }: CatalogSearchParams): Product[] {
  let candidates = PRODUCTS.filter((p) => p.stock > 0);
  if (category) candidates = candidates.filter((p) => p.category === category);
  if (maxBudget) candidates = candidates.filter((p) => p.price <= maxBudget);
  if (gift) {
    candidates = candidates.sort((a, b) => {
      const score = (p: Product) => (p.badges?.includes("personalizable") ? 2 : 0) + (p.badges?.includes("bestseller") ? 1 : 0);
      return score(b) - score(a);
    });
  }
  return candidates.slice(0, 4);
}

export function categoryLabel(category: ProductCategory): string {
  return CATEGORY_LABELS[category];
}

export type StockStatus = "in_stock" | "low_stock" | "out_of_stock";

export function getStockStatus(product: Product): StockStatus {
  if (product.stock <= 0) return "out_of_stock";
  if (product.stock <= 3) return "low_stock";
  return "in_stock";
}

export function getCareInfo(product: Product): { materials: string; care: string } {
  return { materials: product.materials, care: product.care };
}

export { getProductById };
