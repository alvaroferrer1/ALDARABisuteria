"use client";

import { useTranslations } from "@/lib/i18n/localeStore";
import { PhotoSlot } from "@/components/PhotoSlot";

export function ReparacionesHero() {
  const { t } = useTranslations();
  return (
    <>
      <div className="relative mb-8 aspect-21/9 overflow-hidden rounded-3xl">
        <PhotoSlot name="reparaciones-hero" alt="" fallback={<div className="absolute inset-0 bg-surface-2" />} />
      </div>
      <p className="mb-3 text-xs font-bold uppercase tracking-widest text-terracotta">{t.misc.reparacionesEyebrow}</p>
      <h1 className="font-display text-4xl font-semibold">{t.misc.reparacionesTitle}</h1>
      <p className="mt-4 text-ink-soft">{t.misc.reparacionesSubtitle}</p>
    </>
  );
}

export function MantenimientoContent() {
  const { t } = useTranslations();
  return (
    <>
      <p className="mb-4 text-xs font-bold uppercase tracking-widest text-[#e3c665]">{t.misc.mantenimientoEyebrow}</p>
      <h1 className="font-display text-5xl font-semibold text-white sm:text-6xl">
        {t.misc.mantenimientoTitle1} <em className="not-italic text-[#e3c665]">{t.misc.mantenimientoTitle2}</em>
      </h1>
      <p className="mx-auto mt-4 max-w-sm text-white/75">{t.misc.mantenimientoSubtitle}</p>
    </>
  );
}

export function MantenimientoNote() {
  const { t } = useTranslations();
  return <p className="mt-8 text-xs text-white/40">{t.misc.mantenimientoNote}</p>;
}

export function CitasHero() {
  const { t } = useTranslations();
  return (
    <>
      <p className="mb-3 text-xs font-bold uppercase tracking-widest text-terracotta">{t.misc.citasEyebrow}</p>
      <h1 className="font-display text-4xl font-semibold sm:text-5xl">{t.misc.citasTitle}</h1>
      <p className="mx-auto mt-4 max-w-lg text-ink-soft">{t.misc.citasSubtitle}</p>
    </>
  );
}
