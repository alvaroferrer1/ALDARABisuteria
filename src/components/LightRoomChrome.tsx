"use client";

import { useTranslations } from "@/lib/i18n/localeStore";

export function LightRoomHero() {
  const { t } = useTranslations();
  return (
    <>
      <p className="mb-3 text-center text-xs font-bold uppercase tracking-widest text-terracotta">{t.misc.lightRoomEyebrow}</p>
      <h1 className="text-center font-display text-4xl font-semibold sm:text-5xl">{t.misc.lightRoomTitle}</h1>
      <p className="mx-auto mt-4 max-w-lg text-center text-ink-soft">{t.misc.lightRoomSubtitle}</p>
    </>
  );
}
