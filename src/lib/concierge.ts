import { PRODUCTS, CATEGORY_LABELS } from "./products";
import type { Product, ProductCategory } from "./types";

/**
 * Concierge LOCAL — no es un LLM. Es un recomendador basado en reglas real
 * (parseo de presupuesto + coincidencia de palabras clave contra el catálogo
 * real), documentado como tal en la propia UI (`ChatWidget`). No pretende ser
 * IA generativa: es determinista, auditable y solo devuelve productos reales
 * de `src/lib/products.ts`. Sustituible en el futuro por un LLM real conectado
 * a una API key (ver KNOWN_ISSUES.md), manteniendo la misma interfaz.
 */

const CATEGORY_KEYWORDS: Record<ProductCategory, string[]> = {
  pendientes: ["pendiente", "pendientes", "aro", "aros", "oreja", "orejas"],
  pulseras: ["pulsera", "pulseras", "muñeca", "cadena para muñeca"],
  colgantes: ["colgante", "colgantes", "collar", "collares", "cadena"],
  charms: ["charm", "charms", "amuleto"],
};

function parseBudget(text: string): number | null {
  const match = text.match(/(\d{1,4})\s*(?:€|euros?)?/);
  return match ? Number(match[1]) : null;
}

export interface ConciergeResult {
  reply: string;
  products: Product[];
}

export function getConciergeRecommendations(query: string): ConciergeResult {
  const q = query.toLowerCase().trim();
  if (!q) {
    return { reply: "Cuéntame qué buscas: una categoría, una ocasión o un presupuesto, y te propongo piezas reales del catálogo.", products: [] };
  }

  const budget = parseBudget(q);
  let matchedCategory: ProductCategory | null = null;
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS) as [ProductCategory, string[]][]) {
    if (keywords.some((k) => q.includes(k))) {
      matchedCategory = category;
      break;
    }
  }

  const isGift = /regal|cumplea|aniversario|sorpresa/.test(q);

  let candidates = PRODUCTS.slice();
  if (matchedCategory) candidates = candidates.filter((p) => p.category === matchedCategory);
  if (budget) candidates = candidates.filter((p) => p.price <= budget);
  if (isGift) {
    // Prioriza piezas personalizables/bestseller para regalo, sin excluir el resto.
    candidates = candidates.sort((a, b) => {
      const score = (p: Product) => (p.badges?.includes("personalizable") ? 2 : 0) + (p.badges?.includes("bestseller") ? 1 : 0);
      return score(b) - score(a);
    });
  }

  const products = candidates.slice(0, 4);

  if (products.length === 0) {
    return {
      reply: budget
        ? `No tengo piezas${matchedCategory ? ` de ${CATEGORY_LABELS[matchedCategory]}` : ""} por debajo de ${budget}€ ahora mismo. ¿Quieres ver el catálogo completo?`
        : "No he encontrado nada con eso exactamente — prueba con una categoría (pendientes, pulseras, colgantes, charms) o un presupuesto.",
      products: [],
    };
  }

  const parts: string[] = [];
  if (matchedCategory) parts.push(CATEGORY_LABELS[matchedCategory].toLowerCase());
  if (budget) parts.push(`hasta ${budget}€`);
  const reply = parts.length
    ? `Esto es lo que tengo en ${parts.join(" ")}${isGift ? ", pensado para regalar" : ""}:`
    : "Esto es lo que más te puede encajar del catálogo real:";

  return { reply, products };
}
