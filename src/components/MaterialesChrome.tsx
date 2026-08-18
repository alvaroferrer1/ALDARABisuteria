"use client";

import { useTranslations } from "@/lib/i18n/localeStore";
import { PhotoSlot } from "@/components/PhotoSlot";

export function MaterialesHero() {
  const { t } = useTranslations();
  return (
    <section className="relative flex min-h-72 flex-col items-center justify-center overflow-hidden px-4 py-16 text-center sm:px-6">
      <PhotoSlot name="materiales-hero" alt="" fallback={<div className="absolute inset-0" style={{ backgroundColor: "#2a2116" }} />} />
      <div className="absolute inset-0 bg-linear-to-t from-black/55 via-black/20 to-black/10" />
      <p className="relative mb-3 text-xs font-bold uppercase tracking-widest text-[#e3c665]">{t.materiales.eyebrow}</p>
      <h1 className="relative font-display text-4xl font-semibold text-white sm:text-5xl">{t.materiales.title}</h1>
      <p className="relative mx-auto mt-4 max-w-lg text-white/85">{t.materiales.subtitle}</p>
    </section>
  );
}

export function MaterialesPiecesLabel() {
  const { t } = useTranslations();
  return <p className="mb-3 text-xs font-bold uppercase tracking-widest text-ink-soft">{t.materiales.piecesWithMaterial}</p>;
}

export function MaterialesTraceability() {
  const { t } = useTranslations();
  const items = [
    [t.materiales.workshopTitle, t.materiales.workshopText],
    [t.materiales.materialsTitle, t.materiales.materialsText],
    [t.materiales.passportTitle, t.materiales.passportText],
  ];
  return (
    <>
      <p className="mb-3 text-xs font-bold uppercase tracking-widest text-terracotta">{t.materiales.traceabilityEyebrow}</p>
      <h2 className="font-display text-2xl font-semibold sm:text-3xl">{t.materiales.traceabilityTitle}</h2>
      <div className="mt-8 grid gap-6 text-left sm:grid-cols-3">
        {items.map(([title, text]) => (
          <div key={title}>
            <p className="font-semibold">{title}</p>
            <p className="mt-1 text-sm text-ink-soft">{text}</p>
          </div>
        ))}
      </div>
    </>
  );
}
