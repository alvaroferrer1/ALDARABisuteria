"use client";

import Link from "next/link";
import { useTranslations } from "@/lib/i18n/localeStore";
import { PhotoSlot } from "@/components/PhotoSlot";

export function AtelierHero() {
  const { t } = useTranslations();
  return (
    <>
      <div className="relative mx-auto mb-8 aspect-21/9 max-w-4xl overflow-hidden rounded-3xl">
        <PhotoSlot name="atelier-hero" alt="" fallback={<div className="absolute inset-0 bg-surface-2" />} />
      </div>
      <p className="mb-3 text-xs font-bold uppercase tracking-widest text-terracotta">{t.atelier.eyebrow}</p>
      <h1 className="mx-auto max-w-2xl font-display text-4xl font-semibold leading-tight sm:text-5xl">{t.atelier.title}</h1>
      <p className="mx-auto mt-4 max-w-lg text-ink-soft">
        {t.atelier.subtitleBefore}{" "}
        <Link href="/nosotros" className="underline">
          {t.atelier.subtitleLink}
        </Link>
        {t.atelier.subtitleAfter}
      </p>
    </>
  );
}

export function AtelierMateriaHeader() {
  const { t } = useTranslations();
  return (
    <>
      <p className="mb-3 text-xs font-bold uppercase tracking-widest text-terracotta">{t.atelier.materiaEyebrow}</p>
      <h2 className="font-display text-3xl font-semibold sm:text-4xl">{t.atelier.materiaTitle}</h2>
      <p className="mx-auto mt-3 max-w-md text-ink-soft">{t.atelier.materiaSubtitle}</p>
    </>
  );
}

export function AtelierMaterialCount({ count }: { count: number }) {
  const { t } = useTranslations();
  return (
    <p className="mt-1 text-sm text-ink-soft">
      {count} {count === 1 ? t.atelier.pieceSingular : t.atelier.piecePlural} {t.atelier.fromCatalog}
    </p>
  );
}

export function AtelierGuideLink() {
  const { t } = useTranslations();
  return (
    <Link href="/materiales" className="text-sm font-semibold text-terracotta hover:underline">
      {t.atelier.viewFullGuide}
    </Link>
  );
}

export function AtelierCta() {
  const { t } = useTranslations();
  return (
    <>
      <p className="mb-3 text-xs font-bold uppercase tracking-widest text-gold-light">{t.atelier.ctaEyebrow}</p>
      <h2 className="font-display text-3xl font-semibold sm:text-4xl">{t.atelier.ctaTitle}</h2>
      <Link
        href="/charms-studio"
        className="mt-7 inline-block rounded-full bg-ivory px-7 py-3.5 font-semibold text-ink hover:-translate-y-0.5 transition-transform"
      >
        {t.atelier.ctaButton}
      </Link>
    </>
  );
}
