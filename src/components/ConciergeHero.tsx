"use client";

import { useTranslations } from "@/lib/i18n/localeStore";
import { Reveal } from "./Reveal";

export function ConciergeHero() {
  const { t } = useTranslations();
  return (
    <div className="mx-auto max-w-2xl text-center">
      <Reveal>
        <p className="mb-3 text-xs font-bold uppercase tracking-widest text-terracotta">{t.concierge.pageEyebrow}</p>
        <h1 className="font-display text-4xl font-semibold sm:text-5xl">{t.concierge.pageTitle}</h1>
        <p className="mx-auto mt-4 max-w-lg text-ink-soft">
          {t.concierge.pageSubtitlePre} <strong>{t.concierge.pageSubtitleLocal}</strong> {t.concierge.pageSubtitlePost}
        </p>
      </Reveal>
    </div>
  );
}
