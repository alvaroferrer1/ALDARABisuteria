"use client";

import Link from "next/link";
import { ProductPlate } from "./ProductPlate";
import { PhotoSlot } from "./PhotoSlot";
import { useTranslations } from "@/lib/i18n/localeStore";
import { money } from "@/lib/storage";
import type { LimitedEditionWithProduct } from "@/lib/limitedEditions";

export function EdicionesLimitadasContent({ editions }: { editions: LimitedEditionWithProduct[] }) {
  const { t } = useTranslations();
  const b = t.bloque8;
  return (
    <>
      <section className="px-4 pb-8 pt-24 text-center sm:px-6">
        <div className="relative mx-auto mb-8 aspect-21/9 max-w-4xl overflow-hidden rounded-3xl">
          <PhotoSlot name="ediciones-limitadas-hero" alt="" fallback={<div className="absolute inset-0 bg-surface-2" />} />
        </div>
        <p className="mb-3 text-xs font-bold uppercase tracking-widest text-terracotta">{b.edicionesEyebrow}</p>
        <h1 className="font-display text-4xl font-semibold sm:text-5xl">{b.edicionesTitle}</h1>
        <p className="mx-auto mt-4 max-w-lg text-ink-soft">{b.edicionesSubtitle}</p>
      </section>

      <section className="mx-auto max-w-5xl px-4 pb-24 sm:px-6">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {editions.map((e) => {
            const remaining = e.editionSize - e.claimed;
            const soldOut = remaining <= 0;
            return (
              <Link key={e.productId} href={`/producto/${e.product.slug}`} className="group overflow-hidden rounded-2xl border border-line">
                <div className="relative aspect-square bg-surface-2">
                  <ProductPlate product={e.product} className="h-full w-full" />
                  <span className="absolute left-3 top-3 rounded-full bg-black/70 px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-wide text-white">
                    Edición {e.claimed}/{e.editionSize} · demo
                  </span>
                  {soldOut && (
                    <span className="absolute right-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[0.65rem] font-bold uppercase text-ink">{b.edicionesSoldOut}</span>
                  )}
                </div>
                <div className="p-5">
                  <p className="font-semibold group-hover:text-terracotta">{e.product.name}</p>
                  <p className="mt-1 text-sm text-ink-soft">{e.story}</p>
                  <p className="mt-2 text-sm font-semibold">{money(e.product.price)}</p>
                  <p className="mt-1 text-xs text-ink-soft">{soldOut ? b.edicionesNoUnits : `${remaining} ${b.edicionesUnitsLeft}`}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </>
  );
}
