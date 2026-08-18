"use client";

import Link from "next/link";
import { useTranslations } from "@/lib/i18n/localeStore";
import { PhotoSlot } from "./PhotoSlot";

const TINT_VAR = ["var(--gold)", "var(--terracotta)", "var(--blue)"] as const;

/**
 * "Así se lleva" — franja de contexto de uso (persona + pieza), calcada de
 * "LO LLEVAN ASÍ" del mockup de PDP (p.19). Reutiliza la silueta de persona
 * ya usada en `/lookbook` (mismo lenguaje visual) en vez de fabricar
 * reseñas/fotos que no existen — antes la PDP no tenía ningún contexto de
 * "puesto", solo el plano de estudio, gap real detectado en comparación
 * directa PDF↔LIVE. Cada una de las 4 miniaturas es su propio slot de foto
 * (`worn-<slug>-<i>`), preparado para 4 fotos reales de la pieza puesta.
 */
export function PdpWornGallery({ productSlug, tint }: { productSlug: string; tint: 0 | 1 | 2 }) {
  const { t } = useTranslations();
  const color = TINT_VAR[tint];
  return (
    <section className="mx-auto max-w-6xl px-4 pb-4 pt-2 sm:px-6">
      <p className="mb-1 text-xs font-bold uppercase tracking-widest text-terracotta">{t.pdp.wornTitle}</p>
      <p className="mb-6 text-sm text-ink-soft">{t.pdp.wornSubtitle}</p>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="relative flex aspect-3/4 items-center justify-center overflow-hidden rounded-2xl"
            style={{ background: `radial-gradient(120% 90% at 50% ${10 + i * 5}%, color-mix(in srgb, ${color} ${18 + i * 2}%, var(--surface)) 0%, var(--surface-2) 75%)` }}
          >
            <PhotoSlot
              name={`worn-${productSlug}-${i}`}
              alt=""
              fallback={
                <svg viewBox="0 0 300 400" width="60%" aria-hidden="true">
                  <path
                    d="M150 40c-30 0-45 25-45 55 0 20 8 35 8 35s-38 20-45 60c-8 45 0 150 0 150h164s8-105 0-150c-7-40-45-60-45-60s8-15 8-35c0-30-15-55-45-55Z"
                    fill="none"
                    stroke={color}
                    strokeWidth="1.5"
                    opacity="0.5"
                  />
                </svg>
              }
            />
          </div>
        ))}
      </div>
    </section>
  );
}

/**
 * Bloques de texto estructural de la PDP (breadcrumb, acordeones, secciones
 * cruzadas) extraídos a componente cliente para traducir de verdad en
 * ES/EN/FR — antes fijos en español pese a cambiar de idioma (ref. 0.6).
 * El contenido específico de cada pieza (nombre, descripción, historia,
 * materiales, cuidados) sigue en español porque es contenido real de
 * catálogo sin traducción todavía, no texto de interfaz — se muestra tal
 * cual en los tres idiomas, documentado como alcance pendiente.
 */
export function PdpBreadcrumb({ categoryLabel }: { categoryLabel: string }) {
  const { t } = useTranslations();
  return (
    <div className="mx-auto max-w-6xl px-4 pt-8 text-sm text-ink-soft sm:px-6">
      <Link href="/shop" className="hover:text-terracotta">
        {t.pdp.breadcrumbCatalog}
      </Link>{" "}
      / {categoryLabel}
    </div>
  );
}

// Fila de confianza (envíos/devoluciones/pago) + insignia "Hecha a mano" —
// presentes en el mockup (p.19) bajo el botón de compra, ausentes en la
// implementación (gap real detectado en auditoría visual PDF vs. live).
export function PdpHandmadeBadge() {
  const { t } = useTranslations();
  return (
    <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-surface-2 px-3 py-1.5 text-xs font-semibold text-ink-soft">
      <svg viewBox="0 0 24 24" width="14" aria-hidden="true">
        <path d="M12 21s-7.5-4.6-10-9.3C.4 8.3 2.1 5 5.6 5c2 0 3.4 1 4.4 2.4C11 6 12.4 5 14.4 5c3.5 0 5.2 3.3 3.6 6.7C19.5 16.4 12 21 12 21Z" fill="none" stroke="currentColor" strokeWidth="1.5" />
      </svg>
      {t.pdp.handmadeBadge}
    </span>
  );
}

export function PdpTrustRow() {
  const { t } = useTranslations();
  const items: Array<[string, string, string]> = [
    ["M2 7h20v5H2V7Zm0 5h13v5H2v-5Zm13 0h2l3 3v2h-5v-5Z", t.pdp.trustShipping, t.pdp.trustShippingSub],
    ["M4 4h16v4H4V4Zm0 8h16v8H4v-8Zm4 3h4", t.pdp.trustReturns, t.pdp.trustReturnsSub],
    ["M3 10h18M6 15h4M3 6h18v12H3V6Z", t.pdp.trustPayment, t.pdp.trustPaymentSub],
  ];
  return (
    <div className="mt-2 grid grid-cols-3 gap-3 border-t border-line pt-4 text-center">
      {items.map(([path, title, sub]) => (
        <div key={title} className="flex flex-col items-center gap-1">
          <svg viewBox="0 0 24 24" width="18" className="text-terracotta" aria-hidden="true">
            <path d={path} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="text-xs font-semibold">{title}</span>
          <span className="text-[0.65rem] text-ink-soft">{sub}</span>
        </div>
      ))}
    </div>
  );
}

export function PdpAccordion({
  story,
  materials,
  care,
  categoryLabel,
  stock,
}: {
  story: string;
  materials: string;
  care: string;
  categoryLabel: string;
  stock: number;
}) {
  const { t } = useTranslations();
  return (
    <div className="mt-4 divide-y divide-line border-y border-line">
      <details open className="group py-3.5">
        <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-semibold">
          {t.pdp.historyTitle}
          <span className="text-ink-soft transition-transform group-open:rotate-45" aria-hidden="true">
            +
          </span>
        </summary>
        <p className="mt-3 text-sm text-ink-soft">{story}</p>
      </details>
      <details className="group py-3.5">
        <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-semibold">
          {t.pdp.detailsTitle}
          <span className="text-ink-soft transition-transform group-open:rotate-45" aria-hidden="true">
            +
          </span>
        </summary>
        <ul className="mt-3 flex flex-col gap-1.5 text-sm text-ink-soft">
          <li>
            {t.pdp.material}: {materials}
          </li>
          <li>
            {t.pdp.category}: {categoryLabel}
          </li>
          <li>
            {t.pdp.stockAvailable}: {stock} {t.pdp.units}
          </li>
        </ul>
      </details>
      <details className="group py-3.5">
        <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-semibold">
          {t.pdp.shippingTitle}
          <span className="text-ink-soft transition-transform group-open:rotate-45" aria-hidden="true">
            +
          </span>
        </summary>
        <ul className="mt-3 flex flex-col gap-1.5 text-sm text-ink-soft">
          <li>{t.pdp.shippingEstimate}</li>
          <li>{t.pdp.freeShipping}</li>
          <li>{t.pdp.returns}</li>
        </ul>
      </details>
      <details className="group py-3.5">
        <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-semibold">
          {t.pdp.careTitle}
          <span className="text-ink-soft transition-transform group-open:rotate-45" aria-hidden="true">
            +
          </span>
        </summary>
        <p className="mt-3 text-sm text-ink-soft">{care}</p>
      </details>
    </div>
  );
}

export function PdpLookSection({ lookSlug, description }: { lookSlug: string; description: string }) {
  const { t } = useTranslations();
  return (
    <section className="border-y border-line bg-surface-2 py-14">
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-2 px-4 text-center sm:px-6">
        <p className="text-xs font-bold uppercase tracking-widest text-terracotta">{t.pdp.pairWithEyebrow}</p>
        <h2 className="font-display text-2xl font-semibold sm:text-3xl">{t.pdp.pairWithTitle}</h2>
        <p className="max-w-md text-ink-soft">{description}</p>
        <Link href={`/lookbook/${lookSlug}`} className="mt-4 rounded-full bg-ink px-6 py-3 font-semibold text-ivory hover:-translate-y-0.5 transition-transform">
          {t.pdp.viewFullLook}
        </Link>
      </div>
    </section>
  );
}

export function PdpCollectionSection({
  collectionSlug,
  collectionName,
  tagline,
  description,
  color,
}: {
  collectionSlug: string;
  collectionName: string;
  tagline: string;
  description: string;
  color: string;
}) {
  const { t } = useTranslations();
  return (
    <section className="border-y border-line bg-surface-2 py-14">
      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
        <p className="mb-3 text-xs font-bold uppercase tracking-widest" style={{ color }}>
          {t.pdp.completeLookEyebrow} {collectionName}
        </p>
        <h2 className="font-display text-2xl font-semibold sm:text-3xl">{tagline}</h2>
        <p className="mx-auto mt-3 max-w-xl text-ink-soft">{description}</p>
        <Link
          href={`/colecciones/${collectionSlug}`}
          className="mt-6 inline-block rounded-full border border-ink px-6 py-3 font-semibold hover:bg-ink hover:text-ivory"
        >
          {t.pdp.viewFullCollection} {collectionName} →
        </Link>
      </div>
    </section>
  );
}

export function PdpYouMayAlsoLike() {
  const { t } = useTranslations();
  return <h2 className="mb-8 font-display text-2xl font-semibold">{t.pdp.youMayAlsoLike}</h2>;
}
