"use client";

import { useTranslations } from "@/lib/i18n/localeStore";
import type { Stockist } from "@/lib/stockists";
import { DemoPhoto } from "./DemoPhoto";

export function TiendasContent({ stockists }: { stockists: Stockist[] }) {
  const { t } = useTranslations();
  const b = t.bloque8;
  return (
    <>
      {/* Foto del taller de Puerto Almenara (generativa) — antes la página era solo
          texto y 3 tarjetas, sin ninguna imagen para una página que trata
          precisamente de "dónde encontrarnos". */}
      <section className="relative aspect-21/9 min-h-56 w-full overflow-hidden sm:min-h-0">
        <DemoPhoto seed="tiendas-zaragoza" tone="var(--terracotta)" />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(180deg, rgba(15,10,8,0.1) 0%, rgba(15,10,8,0.55) 100%)" }}
          aria-hidden="true"
        />
        <div className="relative z-10 flex h-full flex-col justify-end px-4 pb-8 sm:px-8">
          <p className="text-xs font-bold uppercase tracking-widest text-white/80">Taller ALDARA</p>
          <p className="font-display text-2xl font-semibold text-white sm:text-3xl">Puerto Almenara</p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-24 text-center sm:px-6">
        <p className="mb-3 text-xs font-bold uppercase tracking-widest text-terracotta">{b.tiendasEyebrow}</p>
        <h1 className="font-display text-4xl font-semibold sm:text-5xl">{b.tiendasTitle}</h1>
        <p className="mx-auto mt-4 max-w-lg text-ink-soft">{b.tiendasSubtitle}</p>

        <div className="mt-10 grid gap-5 text-left sm:grid-cols-3">
          {stockists.map((s, i) => (
            <div key={i} className={`rounded-2xl border p-6 ${s.isReal ? "border-terracotta" : "border-line opacity-70"}`}>
              {s.isDemo && (
                <span className="mb-2 inline-block rounded-full bg-surface-2 px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-wide text-ink-soft">
                  Demo
                </span>
              )}
              <p className="font-semibold">{s.city}</p>
              <p className="mt-1 text-sm text-ink-soft">{s.detail}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
