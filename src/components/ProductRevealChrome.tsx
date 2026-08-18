"use client";

import Link from "next/link";
import { useTranslations } from "@/lib/i18n/localeStore";

export function RevealHeroText() {
  const { t } = useTranslations();
  return (
    <>
      <p className="text-xs font-bold uppercase tracking-widest text-[#e3c665]">{t.misc.revealEyebrow}</p>
      <h1 className="mt-2 max-w-lg font-display text-4xl font-semibold text-white sm:text-5xl">{t.misc.revealTitle}</h1>
    </>
  );
}

export function RevealSectionLabel({ variant }: { variant: "macro" | "reveal" }) {
  const { t } = useTranslations();
  return <p className="mb-3 text-xs font-bold uppercase tracking-widest text-ink-soft">{variant === "macro" ? t.misc.revealMacroLabel : t.misc.revealLabel}</p>;
}

export function RevealMacroCaption() {
  const { t } = useTranslations();
  return <p className="mt-4 text-sm text-ink-soft">{t.misc.revealMacroText}</p>;
}

export function RevealViewFullLink({ productSlug }: { productSlug: string }) {
  const { t } = useTranslations();
  return (
    <Link href={`/producto/${productSlug}`} className="rounded-full border border-line px-6 py-3.5 font-semibold hover:border-ink">
      {t.misc.revealViewFull}
    </Link>
  );
}

export function RevealZoomNote() {
  const { t } = useTranslations();
  return <p className="mt-3 text-xs text-ink-soft">{t.misc.revealZoomNote}</p>;
}
