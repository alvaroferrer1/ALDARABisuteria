"use client";

import Link from "next/link";
import { DemoPhoto } from "./DemoPhoto";
import { PhotoSlot } from "./PhotoSlot";
import { useTranslations } from "@/lib/i18n/localeStore";
import type { AldaraEvent } from "@/lib/events";

const LOCALE_TAG: Record<string, string> = { es: "es-ES", en: "en-US", fr: "fr-FR" };

export function EventosContent({ upcoming, past }: { upcoming: AldaraEvent[]; past: AldaraEvent[] }) {
  const { t, locale } = useTranslations();
  const b = t.bloque8;
  const dateLocale = LOCALE_TAG[locale] ?? "es-ES";

  return (
    <>
      <section className="px-4 pb-8 pt-24 text-center sm:px-6">
        <div className="relative mx-auto mb-8 aspect-21/9 max-w-4xl overflow-hidden rounded-3xl">
          <PhotoSlot name="eventos-hero" alt="" fallback={<div className="absolute inset-0 bg-surface-2" />} />
        </div>
        <p className="mb-3 text-xs font-bold uppercase tracking-widest text-terracotta">{b.eventosEyebrow}</p>
        <h1 className="font-display text-4xl font-semibold sm:text-5xl">{b.eventosTitle}</h1>
        <p className="mx-auto mt-4 max-w-lg text-ink-soft">{b.eventosSubtitle}</p>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <h2 className="mb-6 text-sm font-semibold uppercase tracking-wide text-ink-soft">{b.eventosUpcoming}</h2>
        {upcoming.length === 0 ? (
          <p className="rounded-2xl bg-surface-2 p-8 text-center text-ink-soft">{b.eventosNone}</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {upcoming.map((e) => (
              <Link key={e.slug} href={`/eventos/${e.slug}`} className="group overflow-hidden rounded-2xl border border-line">
                <div className="relative aspect-4/3 overflow-hidden">
                  <DemoPhoto seed={e.slug} tone={e.tone} />
                  <span className="absolute left-3 top-3 rounded-full bg-black/50 px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-wide text-white">
                    Demo
                  </span>
                  <span className="absolute right-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[0.65rem] font-bold uppercase text-ink">{e.type}</span>
                </div>
                <div className="p-5">
                  <p className="text-xs font-semibold text-terracotta">{new Date(e.date).toLocaleDateString(dateLocale, { day: "numeric", month: "long" })}</p>
                  <p className="mt-1 font-semibold group-hover:text-terracotta">{e.title}</p>
                  <p className="mt-1 text-sm text-ink-soft">{e.location}</p>
                  <p className="mt-2 text-sm font-semibold">{e.price === "Gratis" ? "Gratis" : `${e.price} €`}</p>
                </div>
              </Link>
            ))}
          </div>
        )}

        <h2 className="mb-6 mt-14 text-sm font-semibold uppercase tracking-wide text-ink-soft">{b.eventosPast}</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {past.map((e) => (
            <Link key={e.slug} href={`/eventos/${e.slug}`} className="rounded-2xl border border-line p-5 opacity-70 hover:opacity-100">
              <p className="text-xs font-semibold text-ink-soft">
                {new Date(e.date).toLocaleDateString(dateLocale, { day: "numeric", month: "long", year: "numeric" })}
              </p>
              <p className="mt-1 font-semibold">{e.title}</p>
              <p className="mt-1 text-xs text-ink-soft">{e.spotsLeft === 0 ? "Plazas agotadas" : "Finalizado"}</p>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
