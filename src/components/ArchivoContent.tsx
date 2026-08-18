"use client";

import Link from "next/link";
import { ProductPlate } from "./ProductPlate";
import { PhotoSlot } from "./PhotoSlot";
import { useTranslations } from "@/lib/i18n/localeStore";
import { PRODUCTS } from "@/lib/products";
import type { ArchiveYear } from "@/lib/archive";

export function ArchivoContent({ years }: { years: ArchiveYear[] }) {
  const { t } = useTranslations();
  const b = t.bloque8;
  return (
    <>
      <section className="px-4 pb-8 pt-24 text-center sm:px-6">
        <div className="relative mx-auto mb-8 aspect-21/9 max-w-4xl overflow-hidden rounded-3xl">
          <PhotoSlot name="archivo-aldara" alt="" fallback={<div className="absolute inset-0 bg-surface-2" />} />
        </div>
        <p className="mb-3 text-xs font-bold uppercase tracking-widest text-terracotta">{b.archivoEyebrow}</p>
        <h1 className="font-display text-4xl font-semibold sm:text-5xl">{b.archivoTitle}</h1>
        <p className="mx-auto mt-4 max-w-lg text-ink-soft">{b.archivoSubtitle}</p>
      </section>

      <section className="mx-auto max-w-5xl px-4 pb-24 sm:px-6">
        {years
          .slice()
          .reverse()
          .map((y) => (
            <div key={y.year} className="mb-16 last:mb-0">
              <div className="mb-6 flex items-baseline gap-4">
                <h2 className="font-display text-4xl font-semibold text-terracotta">{y.year}</h2>
                <p className="text-ink-soft">{y.milestone}</p>
              </div>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {y.campaigns.map((c) => (
                  <div key={c.title} className="rounded-2xl border border-line p-5">
                    <span className="rounded-full bg-surface-2 px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-wide text-ink-soft">Demo</span>
                    <p className="mt-3 font-semibold">{c.title}</p>
                    <p className="mt-1 text-sm text-ink-soft">{c.description}</p>
                    <div className="mt-3 flex gap-2">
                      {c.productIds.map((id) => {
                        const product = PRODUCTS.find((p) => p.id === id);
                        if (!product) return null;
                        return (
                          <Link key={id} href={`/producto/${product.slug}`} className="h-14 w-14 overflow-hidden rounded-lg">
                            <ProductPlate product={product} className="h-full w-full" />
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
      </section>
    </>
  );
}
