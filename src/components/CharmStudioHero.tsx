"use client";

import { useTranslations } from "@/lib/i18n/localeStore";
import { PhotoSlot } from "@/components/PhotoSlot";

export function CharmStudioHero() {
  const { t } = useTranslations();
  return (
    <>
      <div className="relative mb-8 aspect-21/9 overflow-hidden rounded-3xl">
        <PhotoSlot name="charm-studio-hero" alt="" fallback={<div className="absolute inset-0 bg-surface-2" />} />
      </div>
      <p className="mb-3 text-xs font-bold uppercase tracking-widest text-terracotta">{t.charmStudio.eyebrow}</p>
      <h1 className="mb-3 font-display text-4xl font-semibold sm:text-5xl">{t.charmStudio.title}</h1>
      <p className="mb-10 max-w-lg text-ink-soft">{t.charmStudio.subtitle}</p>
    </>
  );
}
