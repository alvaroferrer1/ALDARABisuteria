import { readJson, writeJson } from "./localDb";
import { getProductById } from "./products";

const FILE = "stock-overrides.json";

/**
 * Abstracción de stock — hoy `PRODUCTS` (lib/products.ts) es la fuente de
 * verdad estática de todo el sitio (PDP, catálogo, carrito, checkout...).
 * En vez de reescribir esas páginas ya FROZEN para leer stock de forma
 * asíncrona (riesgo real de regresión en pantallas ya aprobadas, fuera de
 * alcance de esta mejora puntual), este módulo añade una capa de
 * "override" local y persistida que SOLO usa el mecanismo de restock/aviso
 * de reposición (ver /api/admin/restock). Es la pieza mínima necesaria
 * para poder simular 0 → >0 de verdad y disparar avisos reales, con una
 * interfaz (`getEffectiveStock`/`setStockOverride`) que un backend de stock
 * real podría implementar después sin cambiar quien la llama.
 */
interface StockOverrides {
  [productId: string]: number;
}

async function readOverrides(): Promise<StockOverrides> {
  return readJson<StockOverrides>(FILE, {});
}

export async function getEffectiveStock(productId: string): Promise<number | null> {
  const product = getProductById(productId);
  if (!product) return null;
  const overrides = await readOverrides();
  return productId in overrides ? overrides[productId] : product.stock;
}

export async function setStockOverride(productId: string, stock: number): Promise<void> {
  const overrides = await readOverrides();
  overrides[productId] = Math.max(0, stock);
  await writeJson(FILE, overrides);
}
