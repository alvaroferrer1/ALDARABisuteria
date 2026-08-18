"use client";

import Link from "next/link";
import { useRecentlyViewed } from "@/lib/recentlyViewed";
import { getProductById } from "@/lib/products";
import { ProductPlate } from "./ProductPlate";
import { money } from "@/lib/storage";

/**
 * Vistos recientemente — real, basado en localStorage (ver
 * lib/recentlyViewed.ts), no relleno. Se oculta por completo si no hay
 * historial (nunca un carrusel vacío o con placeholders falsos).
 */
export function RecentlyViewedRail({ excludeId }: { excludeId?: string }) {
  const { items } = useRecentlyViewed();
  const products = items
    .map((id) => getProductById(id))
    .filter((p): p is NonNullable<typeof p> => p != null && p.id !== excludeId)
    .slice(0, 6);

  if (products.length === 0) return null;

  return (
    <section className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
      <h2 className="mb-6 font-display text-xl font-semibold">Vistos recientemente</h2>
      <div className="flex gap-4 overflow-x-auto pb-2">
        {products.map((p) => (
          <Link key={p.id} href={`/producto/${p.slug}`} className="group w-32 shrink-0">
            <ProductPlate product={p} className="aspect-square rounded-xl transition-transform group-hover:scale-105" />
            <p className="mt-2 truncate text-sm font-medium group-hover:text-terracotta">{p.name}</p>
            <p className="text-xs text-ink-soft">{money(p.price)}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
