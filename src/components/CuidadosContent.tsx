"use client";

import Link from "next/link";
import { useTranslations } from "@/lib/i18n/localeStore";
import { PhotoSlot } from "@/components/PhotoSlot";

// Iconos de línea por consejo — calcado de la fila "Cuida tus piezas ALDARA"
// del mockup (p.38: gota de agua / perfume / paño / caja / sol), antes era
// una lista numerada sin apoyo visual — gap real detectado en la auditoría.
const ICONS = [
  "M12 2c3 4 6 8 6 12a6 6 0 1 1-12 0c0-4 3-8 6-12Z",
  "M9 3h6v3H9V3Zm-1 5h8l1 3v10a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V11l1-3Z",
  "M4 4h12l4 4v12H4V4Zm0 0 16 16",
  "M4 8h16v12H4V8Zm4 0V6a4 4 0 0 1 8 0v2",
  "M12 3v3m0 12v3m9-9h-3M6 12H3m14.5-6.5-2 2m-9 9-2 2m0-13 2 2m9 9 2 2M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z",
];

export function CuidadosContent() {
  const { t } = useTranslations();
  const tips = [
    [t.cuidados.tip1Title, t.cuidados.tip1Text],
    [t.cuidados.tip2Title, t.cuidados.tip2Text],
    [t.cuidados.tip3Title, t.cuidados.tip3Text],
    [t.cuidados.tip4Title, t.cuidados.tip4Text],
    [t.cuidados.tip5Title, t.cuidados.tip5Text],
  ];

  return (
    <>
      <section className="px-4 pb-8 pt-24 text-center sm:px-6">
        <div className="relative mx-auto mb-8 aspect-21/9 max-w-4xl overflow-hidden rounded-3xl">
          <PhotoSlot name="cuidados-hero" alt="" fallback={<div className="absolute inset-0 bg-surface-2" />} />
        </div>
        <p className="mb-3 text-xs font-bold uppercase tracking-widest text-terracotta">{t.cuidados.eyebrow}</p>
        <h1 className="font-display text-4xl font-semibold sm:text-5xl">{t.cuidados.title}</h1>
        <p className="mx-auto mt-4 max-w-lg text-ink-soft">{t.cuidados.subtitle}</p>
      </section>

      <section className="mx-auto max-w-5xl px-4 pb-16 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-3 lg:grid-cols-5">
          {tips.map(([title, text], i) => (
            <div key={title} className="text-center">
              <svg viewBox="0 0 24 24" width="30" className="mx-auto text-terracotta" aria-hidden="true">
                <path d={ICONS[i]} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <h2 className="mt-3 font-semibold">{title}</h2>
              <p className="mt-1 text-sm text-ink-soft">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 pb-24 sm:px-6">
        <div className="overflow-hidden rounded-2xl border border-line sm:grid sm:grid-cols-2 sm:items-stretch">
          <div className="relative aspect-4/3 sm:aspect-auto">
            <PhotoSlot name="cuidados-detalle" alt="" fallback={<div className="absolute inset-0 bg-surface-2" />} />
          </div>
          <div className="p-6 text-center sm:p-8 sm:text-left">
            <p className="font-semibold">{t.cuidados.moreTitle}</p>
            <p className="mt-1 text-sm text-ink-soft">{t.cuidados.moreSubtitle}</p>
            <Link href="/aftercare" className="mt-4 inline-block rounded-full bg-ink px-6 py-3 text-sm font-semibold text-ivory">
              {t.cuidados.goToAftercare}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
