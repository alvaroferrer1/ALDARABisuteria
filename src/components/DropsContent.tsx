"use client";

import Link from "next/link";
import { ProductPlate } from "./ProductPlate";
import { PhotoSlot } from "./PhotoSlot";
import { useTranslations } from "@/lib/i18n/localeStore";
import { CATEGORY_LABELS } from "@/lib/products";
import { money } from "@/lib/storage";
import type { Product } from "@/lib/types";

export function DropsContent({ news, limited }: { news: Product[]; limited: Product[] }) {
  const { t } = useTranslations();
  const m = t.misc;

  return (
    <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <div className="relative mb-8 aspect-21/9 overflow-hidden rounded-3xl">
        <PhotoSlot name="drops-limited" alt="" fallback={<div className="absolute inset-0 bg-surface-2" />} />
      </div>
      <p className="mb-3 text-xs font-bold uppercase tracking-widest text-terracotta">{m.dropsEyebrow}</p>
      <h1 className="mb-3 font-display text-4xl font-semibold sm:text-5xl">{m.dropsTitle}</h1>
      <p className="mb-10 max-w-lg text-ink-soft">{m.dropsSubtitle}</p>

      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-ink-soft">{m.dropsNewSection}</h2>
      {news.length === 0 ? (
        <p className="mb-10 text-sm text-ink-soft">{m.dropsNewEmpty}</p>
      ) : (
        <div className="mb-10 grid gap-6 sm:grid-cols-3">
          {news.map((p) => (
            <Link key={p.id} href={`/producto/${p.slug}`} className="group overflow-hidden rounded-2xl border border-line p-5">
              <ProductPlate product={p} className="mb-4 aspect-square rounded-xl transition-transform group-hover:scale-105" />
              <span className="text-xs font-bold uppercase text-terracotta">{CATEGORY_LABELS[p.category]}</span>
              <p className="font-semibold">{p.name}</p>
              <p className="text-sm text-ink-soft">{money(p.price)}</p>
            </Link>
          ))}
        </div>
      )}

      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-ink-soft">{m.dropsLimitedSection}</h2>
      {limited.length === 0 ? (
        <p className="text-sm text-ink-soft">{m.dropsLimitedEmpty}</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-3">
          {limited.map((p) => (
            <Link key={p.id} href={`/producto/${p.slug}`} className="group overflow-hidden rounded-2xl border border-line p-5">
              <ProductPlate product={p} className="mb-4 aspect-square rounded-xl transition-transform group-hover:scale-105" />
              <span className="text-xs font-bold uppercase text-terracotta">{CATEGORY_LABELS[p.category]}</span>
              <p className="font-semibold">{p.name}</p>
              <p className="text-sm text-ink-soft">{money(p.price)}</p>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
