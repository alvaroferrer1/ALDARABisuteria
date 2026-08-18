"use client";

import Link from "next/link";
import { useTranslations } from "@/lib/i18n/localeStore";

export function FaqHero() {
  const { t } = useTranslations();
  return (
    <section className="px-4 pb-6 pt-24 text-center sm:px-6">
      <p className="mb-3 text-xs font-bold uppercase tracking-widest text-terracotta">{t.faq.eyebrow}</p>
      <h1 className="font-display text-4xl font-semibold sm:text-5xl">{t.faq.title}</h1>
      <p className="mx-auto mt-4 max-w-lg text-ink-soft">{t.faq.subtitle}</p>
    </section>
  );
}

export function FaqContactCta() {
  const { t } = useTranslations();
  return (
    <section className="border-t border-line px-4 py-16 text-center sm:px-6">
      <p className="mb-3 text-xs font-bold uppercase tracking-widest text-terracotta">{t.faq.notFoundEyebrow}</p>
      <h2 className="font-display text-2xl font-semibold">{t.faq.notFoundTitle}</h2>
      <Link href="/contacto" className="mt-6 inline-block rounded-full bg-ink px-7 py-3.5 font-semibold text-ivory">
        {t.faq.goToContact}
      </Link>
    </section>
  );
}
