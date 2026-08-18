"use client";

import Link from "next/link";
import { useTranslations } from "@/lib/i18n/localeStore";
import { Reveal } from "./Reveal";

export function RegalosHero() {
  const { t } = useTranslations();
  const BADGES = [
    [t.giftFinder.badgeHandmade, t.giftFinder.badgeHandmadeSub],
    [t.giftFinder.badgeCultures, t.giftFinder.badgeCulturesSub],
    [t.giftFinder.badgeQuality, t.giftFinder.badgeQualitySub],
    [t.giftFinder.badgeShipping, t.giftFinder.badgeShippingSub],
  ];
  return (
    <Reveal className="max-w-md">
      <p className="mb-3 text-xs font-bold uppercase tracking-widest text-[#e3c665]">{t.giftFinder.heroEyebrow}</p>
      <h1 className="font-display text-4xl font-semibold leading-[1.05] text-white sm:text-5xl">
        {t.giftFinder.heroTitle} <em className="not-italic text-[#e3c665]">{t.giftFinder.heroTitleAccent}</em>
      </h1>
      <p className="mt-4 max-w-sm text-white/85">{t.giftFinder.heroSubtitle}</p>
      <div className="mt-7 grid grid-cols-2 gap-x-6 gap-y-3">
        {BADGES.map(([title, sub]) => (
          <div key={title} className="text-xs text-white">
            <span className="block font-semibold">{title}</span>
            <span className="block text-white/70">{sub}</span>
          </div>
        ))}
      </div>
    </Reveal>
  );
}

export function RegalosIdeasPrompt() {
  const { t } = useTranslations();
  return (
    <p className="text-sm text-ink-soft">
      {t.giftFinder.exploreIdeasPrompt}{" "}
      <Link href="/regalos/ideas" className="font-semibold text-terracotta underline">
        {t.giftFinder.exploreIdeasLink}
      </Link>
    </p>
  );
}
