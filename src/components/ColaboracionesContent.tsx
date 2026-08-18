"use client";

import Link from "next/link";
import { DemoPhoto } from "./DemoPhoto";
import { PhotoSlot } from "./PhotoSlot";
import { useTranslations } from "@/lib/i18n/localeStore";
import type { Collaboration } from "@/lib/collaborations";

export function ColaboracionesContent({ items }: { items: Collaboration[] }) {
  const { t } = useTranslations();
  const b = t.bloque8;
  return (
    <>
      <section className="px-4 pb-8 pt-24 text-center sm:px-6">
        <div className="relative mx-auto mb-8 aspect-21/9 max-w-4xl overflow-hidden rounded-3xl">
          <PhotoSlot name="colaboraciones-hero" alt="" fallback={<div className="absolute inset-0 bg-surface-2" />} />
        </div>
        <p className="mb-3 text-xs font-bold uppercase tracking-widest text-terracotta">{b.colaboracionesEyebrow}</p>
        <h1 className="font-display text-4xl font-semibold sm:text-5xl">{b.colaboracionesTitle}</h1>
        <p className="mx-auto mt-4 max-w-lg text-ink-soft">{b.colaboracionesSubtitle}</p>
      </section>

      <section className="mx-auto max-w-5xl px-4 pb-24 sm:px-6">
        <div className="grid gap-6 sm:grid-cols-3">
          {items.map((c) => (
            <Link key={c.slug} href={`/colaboraciones/${c.slug}`} className="group overflow-hidden rounded-2xl border border-line">
              <div className="relative aspect-square overflow-hidden">
                <DemoPhoto seed={c.slug} tone={c.tone} />
                <span className="absolute left-3 top-3 rounded-full bg-black/50 px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-wide text-white">Demo</span>
              </div>
              <div className="p-5">
                <p className="text-xs font-semibold text-terracotta">{c.year}</p>
                <p className="mt-1 font-semibold group-hover:text-terracotta">{c.title}</p>
                <p className="mt-1 text-sm text-ink-soft">{c.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
