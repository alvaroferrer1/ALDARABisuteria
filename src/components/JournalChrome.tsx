"use client";

import { useTranslations } from "@/lib/i18n/localeStore";

export function JournalHero() {
  const { t } = useTranslations();
  return (
    <section className="border-b border-line px-4 pb-6 pt-24 text-center sm:px-6">
      <p className="mb-3 text-xs font-bold uppercase tracking-widest text-terracotta">{t.journal.eyebrow}</p>
      <h1 className="mx-auto max-w-2xl font-display text-4xl font-semibold sm:text-5xl">{t.journal.title}</h1>
    </section>
  );
}

export function JournalMoreStoriesHeading() {
  const { t } = useTranslations();
  return <h2 className="mb-6 font-display text-xl font-semibold">{t.journal.moreStories}</h2>;
}
