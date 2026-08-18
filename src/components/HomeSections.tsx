"use client";

import Link from "next/link";
import { useTranslations } from "@/lib/i18n/localeStore";

export function HomeCollectionsHeader() {
  const { t } = useTranslations();
  return (
    <>
      <p className="mb-3 text-xs font-bold uppercase tracking-widest text-terracotta">— {t.home.categoriesEyebrow} —</p>
      <h2 className="font-display text-3xl font-semibold sm:text-4xl">{t.home.categoriesTitle}</h2>
    </>
  );
}

export function HomeTrustBar() {
  const { t } = useTranslations();
  const leftBadges = [
    [t.home.trustShipping, t.home.trustShippingSub],
    [t.home.trustPayment, t.home.trustPaymentSub],
  ];
  const rightBadges = [
    [t.home.trustReturns, t.home.trustReturnsSub],
    [t.home.trustPersonal, t.home.trustPersonalSub],
  ];
  return (
    <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-10 gap-y-5 px-4 text-center sm:px-6">
      {leftBadges.map(([title, sub]) => (
        <div key={title} className="max-w-40">
          <p className="text-sm font-semibold">{title}</p>
          <p className="text-xs text-ink-soft">{sub}</p>
        </div>
      ))}
      {/* Línea firma en itálica/script, calcada del mockup (p.12): entre los
          4 iconos utilitarios, el trust bar del PDF lleva una frase central
          con tratamiento de firma manuscrita ("Hechas a mano, inspiradas en
          culturas...") + corazón — antes era solo otro icono más ("Hechas a
          mano / Inspiradas en culturas"), perdiendo el tono distinto que
          tiene en el mockup. */}
      <p className="max-w-72 font-display text-base italic text-ink-soft">
        <span aria-hidden="true">♡ </span>
        {t.home.trustHandmadeScript}
      </p>
      {rightBadges.map(([title, sub]) => (
        <div key={title} className="max-w-40">
          <p className="text-sm font-semibold">{title}</p>
          <p className="text-xs text-ink-soft">{sub}</p>
        </div>
      ))}
    </div>
  );
}

export function HomeCatalogTeaser() {
  const { t } = useTranslations();
  return (
    <>
      <p className="mb-3 text-xs font-bold uppercase tracking-widest text-terracotta">{t.home.catalogEyebrow}</p>
      <h2 className="font-display text-3xl font-semibold sm:text-4xl">{t.home.catalogTitle}</h2>
      <p className="mx-auto mt-3 max-w-lg text-ink-soft">{t.home.catalogSubtitle}</p>
    </>
  );
}

export function HomeViewFullCatalogLink() {
  const { t } = useTranslations();
  return (
    <Link href="/shop" className="mt-10 inline-block rounded-full bg-ink px-7 py-3.5 font-semibold text-ivory hover:-translate-y-0.5 transition-transform">
      {t.home.viewFullCatalog}
    </Link>
  );
}

export function HomeFinalCta() {
  const { t } = useTranslations();
  return (
    <>
      <p className="mb-3 text-xs font-bold uppercase tracking-widest text-[#d4af37]">{t.home.ctaFinalEyebrow}</p>
      <h2 className="font-display text-3xl font-semibold text-white sm:text-4xl">{t.home.ctaFinalTitle}</h2>
      <Link href="/contacto" className="mt-7 inline-block rounded-full bg-ivory px-7 py-3.5 font-semibold text-ink hover:-translate-y-0.5 transition-transform">
        {t.home.ctaFinalButton}
      </Link>
    </>
  );
}
