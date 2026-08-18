import { PRODUCTS, CATEGORY_LABELS } from "./products";
import { getAllCollections } from "./collections";
import { getAllPosts } from "./journal";
import { getAllEdits } from "./edits";

export interface SearchResult {
  type: "producto" | "colección" | "journal" | "the edit";
  title: string;
  subtitle: string;
  href: string;
}

function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, ""); // quita acentos — búsqueda tolerante a mayúsculas/acentos
}

function matches(query: string, ...fields: string[]): boolean {
  const q = normalize(query).trim();
  if (!q) return false;
  const tokens = q.split(/\s+/);
  const haystack = normalize(fields.join(" "));
  // Tolerante: cada palabra de la búsqueda debe aparecer en algún sitio del
  // texto combinado (no hace falta que las palabras estén en orden ni
  // pegadas), y sin distinguir mayúsculas/acentos.
  return tokens.every((t) => haystack.includes(t));
}

/**
 * Búsqueda real sobre el catálogo y el contenido editorial — sin IA, sin
 * servicio externo, todo en memoria contra los datos reales del sitio.
 * "Tolerante" = insensible a mayúsculas/acentos y a orden de palabras.
 */
export function searchSite(query: string, limit = 8): SearchResult[] {
  if (!query.trim()) return [];
  const results: SearchResult[] = [];

  for (const p of PRODUCTS) {
    if (matches(query, p.name, p.description, p.materials, CATEGORY_LABELS[p.category])) {
      results.push({ type: "producto", title: p.name, subtitle: CATEGORY_LABELS[p.category], href: `/producto/${p.slug}` });
    }
  }
  for (const c of getAllCollections()) {
    if (matches(query, c.name, c.tagline, c.description)) {
      results.push({ type: "colección", title: c.name, subtitle: c.tagline, href: `/colecciones/${c.slug}` });
    }
  }
  for (const post of getAllPosts()) {
    if (matches(query, post.title, post.excerpt, post.category)) {
      results.push({ type: "journal", title: post.title, subtitle: post.category, href: `/journal/${post.slug}` });
    }
  }
  for (const e of getAllEdits()) {
    if (matches(query, e.title, e.standfirst)) {
      results.push({ type: "the edit", title: e.title, subtitle: e.issue, href: `/edit/${e.slug}` });
    }
  }

  return results.slice(0, limit);
}
