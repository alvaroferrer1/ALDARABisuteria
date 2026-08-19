"use client";

import Link from "next/link";
import { useTranslations } from "@/lib/i18n/localeStore";
import { Icon } from "@/components/Icon";

// Tarjetas con acento de color + icono por tema — antes era una simple lista
// de enlaces en dos columnas sin ninguna jerarquía visual, la página de
// ayuda más plana del sitio pese a ser un punto de entrada importante.
const SECTION_ACCENTS = ["var(--terracotta)", "var(--gold)", "var(--blue)", "var(--gold-light)"];

export function HelpContent() {
  const { t } = useTranslations();
  const m = t.misc;
  const sections = [
    {
      title: m.helpSection1,
      links: [
        { href: "/legal/envios-devoluciones", label: m.helpLink1 },
        { href: "/aftercare", label: m.helpLink2 },
        { href: "/aftercare", label: m.helpLink3 },
      ],
    },
    {
      title: m.helpSection2,
      links: [
        { href: "/materiales", label: m.helpLink4 },
        { href: "/cuidados", label: m.helpLink5 },
        { href: "/faq", label: m.helpLink6 },
      ],
    },
    {
      title: m.helpSection3,
      links: [
        { href: "/account", label: m.helpLink7 },
        { href: "/legal/aviso-legal", label: m.helpLink8 },
        { href: "/legal/privacidad", label: m.helpLink9 },
        { href: "/accesibilidad", label: m.helpLink10 },
      ],
    },
    {
      title: m.helpSection4,
      links: [
        { href: "/regalos", label: m.helpLink11 },
        { href: "/concierge", label: m.helpLink12 },
        { href: "/charms-studio", label: m.helpLink13 },
        { href: "/style-lab/ear-stack", label: m.helpLink14 },
      ],
    },
  ];

  return (
    <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <p className="mb-3 text-xs font-bold uppercase tracking-widest text-terracotta">{m.helpEyebrow}</p>
      <h1 className="mb-4 font-display text-4xl font-semibold sm:text-5xl">{m.helpTitle}</h1>
      <p className="mb-10 max-w-lg text-ink-soft">
        {m.helpSubtitleBefore}{" "}
        <Link href="/contacto" className="underline">
          {m.helpSubtitleLink}
        </Link>
        .
      </p>
      <div className="grid gap-6 sm:grid-cols-2">
        {sections.map((s, i) => {
          const accent = SECTION_ACCENTS[i % SECTION_ACCENTS.length];
          return (
            <div key={s.title} className="rounded-2xl border border-line p-6" style={{ borderTopColor: accent, borderTopWidth: 3 }}>
              <h2 className="mb-4 font-display text-lg font-semibold" style={{ color: accent }}>
                {s.title}
              </h2>
              <ul className="flex flex-col gap-1">
                {s.links.map((l, j) => (
                  <li key={l.label + j}>
                    <Link
                      href={l.href}
                      className="group flex items-center justify-between rounded-lg px-2 py-2 text-sm text-ink-soft hover:bg-surface-2 hover:text-ink"
                    >
                      {l.label}
                      <span aria-hidden="true" className="text-ink-soft transition-transform group-hover:translate-x-0.5 group-hover:text-terracotta">
                        →
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      <div className="mt-10 flex flex-col items-center gap-3 rounded-2xl bg-surface-2 p-8 text-center sm:flex-row sm:justify-between sm:text-left">
        <div>
          <p className="font-semibold">{m.helpContactTitle}</p>
          <p className="mt-1 text-sm text-ink-soft">{m.helpContactText}</p>
        </div>
        <Link href="/contacto" className="inline-flex shrink-0 items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-ivory">
          <Icon name="whatsapp" size={16} />
          Contactar
        </Link>
      </div>
    </section>
  );
}
