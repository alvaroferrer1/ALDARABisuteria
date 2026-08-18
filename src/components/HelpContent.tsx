"use client";

import Link from "next/link";
import { useTranslations } from "@/lib/i18n/localeStore";

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
    <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <p className="mb-3 text-xs font-bold uppercase tracking-widest text-terracotta">{m.helpEyebrow}</p>
      <h1 className="mb-4 font-display text-4xl font-semibold sm:text-5xl">{m.helpTitle}</h1>
      <p className="mb-10 max-w-lg text-ink-soft">
        {m.helpSubtitleBefore}{" "}
        <Link href="/contacto" className="underline">
          {m.helpSubtitleLink}
        </Link>
        .
      </p>
      <div className="grid gap-8 sm:grid-cols-2">
        {sections.map((s) => (
          <div key={s.title}>
            <h2 className="mb-3 font-semibold">{s.title}</h2>
            <ul className="flex flex-col gap-2">
              {s.links.map((l, i) => (
                <li key={l.label + i}>
                  <Link href={l.href} className="text-sm text-ink-soft hover:text-terracotta">
                    {l.label} →
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
