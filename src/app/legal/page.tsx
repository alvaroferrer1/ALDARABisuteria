"use client";

import Link from "next/link";
import { useTranslations } from "@/lib/i18n/localeStore";

// Hub de páginas legales — calcado del panel "3) Privacidad y legal" del
// mockup "08 · Utilidad y legal" (p.41): rejilla de 4 tarjetas + tarjeta de
// contacto. Traducido de verdad ES/EN/FR (namespace `legal`) — antes fijo
// en español pese al selector de idioma.
export default function LegalHubPage() {
  const { t } = useTranslations();

  const LEGAL_CARDS = [
    { href: "/legal/privacidad", title: t.legal.privacyTitle, sub: t.legal.privacySub, icon: "M12 3 5 6v6c0 5 3 8.5 7 9 4-.5 7-4 7-9V6l-7-3Z" },
    { href: "/legal/cookies", title: t.legal.cookiesTitle, sub: t.legal.cookiesSub, icon: "M12 3a9 9 0 1 0 9 9c-2 0-3-1-3-3s1-3-1-4-3 0-4-1-1-1-1-1Z" },
    { href: "/legal/terminos", title: t.legal.termsTitle, sub: t.legal.termsSub, icon: "M6 3h9l3 3v15H6V3Zm2 6h8m-8 4h8m-8 4h5" },
    { href: "/accesibilidad", title: t.legal.accessibilityTitle, sub: t.legal.accessibilitySub, icon: "M12 4a2 2 0 1 1 0 4 2 2 0 0 1 0-4Zm-7 8 5-1.5V21m9-9-5-1.5V21M5 12h14" },
  ];

  return (
    <section className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6">
      <h1 className="font-display text-4xl font-semibold sm:text-5xl">{t.legal.title}</h1>
      <p className="mx-auto mt-4 max-w-xl text-ink-soft">{t.legal.subtitle}</p>

      <div className="mt-10 grid gap-5 text-left sm:grid-cols-2">
        {LEGAL_CARDS.map((c) => (
          <Link key={c.href} href={c.href} className="rounded-2xl border border-line p-6 hover:border-terracotta">
            <svg viewBox="0 0 24 24" width="28" className="text-terracotta" aria-hidden="true">
              <path d={c.icon} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <p className="mt-3 font-semibold">{c.title}</p>
            <p className="mt-1 text-sm text-ink-soft">{c.sub}</p>
            <span className="mt-3 inline-block text-sm font-semibold text-terracotta">{t.legal.viewPolicy}</span>
          </Link>
        ))}
      </div>

      <div className="mt-8 rounded-2xl bg-surface-2 p-6">
        <p className="font-semibold">{t.legal.anyDoubt}</p>
        <p className="mt-1 text-sm text-ink-soft">{t.legal.teamHelp}</p>
        <Link href="/contacto" className="mt-3 inline-block rounded-full bg-ink px-6 py-2.5 text-sm font-semibold text-ivory">
          {t.legal.contact}
        </Link>
      </div>
    </section>
  );
}
