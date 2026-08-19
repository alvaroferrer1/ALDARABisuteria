"use client";

import Link from "next/link";
import { ProductVisual } from "./ProductVisual";
import { PhotoSlot } from "./PhotoSlot";
import { Reveal } from "./Reveal";
import { useTranslations } from "@/lib/i18n/localeStore";
import { PRODUCTS } from "@/lib/products";
import type { Collection } from "@/lib/collections";

export function ColeccionesContent({ collections }: { collections: Collection[] }) {
  const { t } = useTranslations();
  return (
    <>
      <section className="px-4 pb-8 pt-24 text-center sm:px-6">
        <p className="mb-3 text-xs font-bold uppercase tracking-widest text-terracotta">{t.colecciones.eyebrow}</p>
        <h1 className="font-display text-4xl font-semibold sm:text-5xl">{t.colecciones.title}</h1>
        <p className="mx-auto mt-4 max-w-lg text-ink-soft">{t.colecciones.subtitle}</p>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
        <div className="grid gap-8 md:grid-cols-3">
          {collections.map((c, i) => {
            const sample = PRODUCTS.find((p) => p.id === c.productIds[0]);
            return (
              <Reveal key={c.slug} delayMs={i * 80}>
                <Link href={`/colecciones/${c.slug}`} className="group block overflow-hidden rounded-3xl border border-line transition-transform hover:-translate-y-1.5">
                  <div className="relative aspect-4/3 overflow-hidden">
                    <PhotoSlot
                      name={`collection-tile-${c.slug}`}
                      alt={c.name}
                      className="transition-transform duration-300 group-hover:scale-105"
                      fallback={
                        <div
                          className="flex h-full w-full items-center justify-center"
                          style={{ background: `color-mix(in srgb, ${c.color} 14%, var(--surface-2))` }}
                        >
                          {sample && <ProductVisual product={sample} size={90} />}
                        </div>
                      }
                    />
                    <span
                      className="absolute right-3 top-3 rounded-full px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-wide text-white"
                      style={{ backgroundColor: c.color }}
                    >
                      {c.productIds.length} piezas
                    </span>
                  </div>
                  <div className="p-6">
                    <h2 className="font-display text-xl font-semibold">{c.name}</h2>
                    <p className="mt-1 text-sm text-ink-soft">{c.tagline}</p>
                    <span className="mt-4 inline-block text-sm font-semibold underline">{t.colecciones.viewCollection}</span>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </section>
    </>
  );
}
