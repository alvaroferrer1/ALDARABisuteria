"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { PRODUCTS, CATEGORY_LABELS } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";
import type { Product, ProductCategory } from "@/lib/types";

/**
 * Búsqueda visual — versión real y honesta: no hay modelo de análisis de
 * imagen disponible en este proyecto, así que en vez de fingir que "analiza"
 * una foto subida, deja elegir directamente los atributos visuales reales del
 * catálogo (tono/acabado, categoría) y filtra productos reales al instante.
 * Ver ASSET_REGISTRY.md / DESIGN_RESEARCH_2026.md para la razón exacta.
 */

const TINTS: Array<{ value: 0 | 1 | 2; label: string; swatch: string }> = [
  { value: 0, label: "Dorado cálido", swatch: "var(--gold)" },
  { value: 1, label: "Terracota", swatch: "var(--terracotta)" },
  { value: 2, label: "Azul noche", swatch: "var(--blue)" },
];

const CATEGORIES = Object.entries(CATEGORY_LABELS) as [ProductCategory, string][];

export default function VisualSearchPage() {
  const [tint, setTint] = useState<0 | 1 | 2 | null>(null);
  const [category, setCategory] = useState<ProductCategory | null>(null);

  const results = useMemo(() => {
    let items: Product[] = PRODUCTS.slice();
    if (tint !== null) items = items.filter((p) => p.tint === tint);
    if (category) items = items.filter((p) => p.category === category);
    return items;
  }, [tint, category]);

  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <p className="mb-3 text-xs font-bold uppercase tracking-widest text-terracotta">Búsqueda visual</p>
      <h1 className="mb-3 font-display text-4xl font-semibold sm:text-5xl">Encuentra por estética</h1>
      <p className="mb-2 max-w-xl text-ink-soft">
        Elige el tono y la categoría que buscas y te mostramos piezas reales que encajan al instante.
      </p>
      <p className="mb-10 max-w-xl text-sm text-ink-soft">
        Honestidad primero: no tenemos todavía un sistema real de análisis de fotos (subir una imagen y que la
        reconozca), así que en vez de fingirlo, esto filtra por los atributos visuales reales del catálogo.
      </p>

      <div className="mb-10 flex flex-wrap gap-8">
        <div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-ink-soft">Tono</p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setTint(null)}
              className={`h-11 rounded-full border px-4 text-sm font-medium ${tint === null ? "border-ink bg-ink text-ivory" : "border-line"}`}
            >
              Todos
            </button>
            {TINTS.map((t) => (
              <button
                key={t.value}
                type="button"
                onClick={() => setTint(t.value)}
                aria-pressed={tint === t.value}
                aria-label={t.label}
                title={t.label}
                className={`h-11 w-11 rounded-full border-2 ${tint === t.value ? "border-ink" : "border-transparent"}`}
                style={{ backgroundColor: t.swatch }}
              />
            ))}
          </div>
        </div>
        <div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-ink-soft">Categoría</p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setCategory(null)}
              className={`rounded-full border px-4 py-2.5 text-sm font-medium ${category === null ? "border-ink bg-ink text-ivory" : "border-line"}`}
            >
              Todas
            </button>
            {CATEGORIES.map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => setCategory(value)}
                className={`rounded-full border px-4 py-2.5 text-sm font-medium ${category === value ? "border-ink bg-ink text-ivory" : "border-line"}`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {results.length === 0 ? (
        <p className="rounded-2xl bg-surface-2 p-8 text-center text-ink-soft">
          Nada por aquí con esa combinación. Prueba otro tono o{" "}
          <Link href="/shop" className="underline">
            ve al catálogo completo
          </Link>
          .
        </p>
      ) : (
        <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-4">
          {results.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </section>
  );
}
