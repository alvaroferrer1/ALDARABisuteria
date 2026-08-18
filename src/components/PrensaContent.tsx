"use client";

import { useTranslations } from "@/lib/i18n/localeStore";
import type { PressMention } from "@/lib/press";

const LOCALE_TAG: Record<string, string> = { es: "es-ES", en: "en-US", fr: "fr-FR" };

export function PrensaContent({
  mentions,
  kitItems,
}: {
  mentions: PressMention[];
  kitItems: ReadonlyArray<{ label: string; isDemo: true }>;
}) {
  const { t, locale } = useTranslations();
  const b = t.bloque8;
  const dateLocale = LOCALE_TAG[locale] ?? "es-ES";

  return (
    <>
      <section className="px-4 pb-8 pt-24 text-center sm:px-6">
        <p className="mb-3 text-xs font-bold uppercase tracking-widest text-terracotta">{b.prensaEyebrow}</p>
        <h1 className="font-display text-4xl font-semibold sm:text-5xl">{b.prensaTitle}</h1>
        <p className="mx-auto mt-4 max-w-lg text-ink-soft">{b.prensaSubtitle}</p>
      </section>

      <section className="mx-auto max-w-4xl px-4 pb-14 sm:px-6">
        <p className="mb-6 text-center text-xs font-bold uppercase tracking-widest text-ink-soft">{b.prensaMentions}</p>
        <div className="grid gap-5 sm:grid-cols-3">
          {mentions.map((m) => (
            <div key={m.outlet} className="rounded-2xl border border-line p-5">
              <span className="rounded-full bg-surface-2 px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-wide text-ink-soft">Demo</span>
              <p className="mt-3 font-semibold">{m.outlet}</p>
              <p className="mt-2 text-sm italic text-ink-soft">&ldquo;{m.quote}&rdquo;</p>
              <p className="mt-2 text-xs text-ink-soft">{new Date(m.date).toLocaleDateString(dateLocale, { month: "long", year: "numeric" })}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 pb-14 sm:px-6">
        <p className="mb-6 text-center text-xs font-bold uppercase tracking-widest text-ink-soft">{b.prensaKit}</p>
        <div className="grid gap-3 sm:grid-cols-2">
          {kitItems.map((item) => (
            <div key={item.label} className="flex items-center justify-between rounded-xl border border-line px-5 py-4">
              <span className="text-sm font-medium">{item.label}</span>
              <span className="rounded-full bg-surface-2 px-3 py-1.5 text-xs font-semibold text-ink-soft">Próximamente</span>
            </div>
          ))}
        </div>
        <p className="mt-3 text-center text-xs text-ink-soft">{b.prensaKitNote}</p>
      </section>

      <section className="mx-auto max-w-lg px-4 pb-24 text-center sm:px-6">
        <div className="rounded-2xl bg-surface-2 p-8">
          <p className="font-semibold">{b.prensaContactTitle}</p>
          <p className="mt-2 text-sm text-ink-soft">{b.prensaContactText}</p>
          <a href="/contacto" className="mt-4 inline-block rounded-full bg-ink px-6 py-3 text-sm font-semibold text-ivory">
            {b.prensaContactButton}
          </a>
        </div>
      </section>
    </>
  );
}
