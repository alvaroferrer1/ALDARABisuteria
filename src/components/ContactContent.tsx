"use client";

import { ContactForm } from "./ContactForm";
import { ProductPlate } from "./ProductPlate";
import { useTranslations } from "@/lib/i18n/localeStore";
import { whatsappHref, WHATSAPP_DISPLAY, WHATSAPP_HOURS, STORE_ADDRESS, STORE_HOURS, CONTACT_EMAIL } from "@/lib/whatsapp";
import type { Product } from "@/lib/types";

/**
 * Contenido de /contacto extraído a componente cliente para traducir de
 * verdad en ES/EN/FR (antes fijo en español pese a cambiar de idioma —
 * gap real detectado en auditoría visual, mismo patrón que el resto de
 * páginas ya cerradas: shop/pdp/checkout/account/...).
 */
export function ContactContent({ heroProduct }: { heroProduct?: Product }) {
  const { t } = useTranslations();
  const c = t.contact;
  const trustRow = [
    [c.trust1, c.trust1sub],
    [c.trust2, c.trust2sub],
    [c.trust3, c.trust3sub],
    [c.trust4, c.trust4sub],
  ];
  const whyContact = [c.why1, c.why2, c.why3, c.why4, c.why5, c.why6];

  return (
    <>
      <section className="relative grid gap-8 overflow-hidden border-b border-line md:grid-cols-2 md:items-center">
        <div
          className="absolute inset-0 -z-10 opacity-40"
          style={{ background: heroProduct ? `radial-gradient(circle at 30% 20%, var(--gold-light), transparent 60%)` : undefined }}
          aria-hidden="true"
        />
        <div className="px-4 py-16 sm:px-6 md:py-24">
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-terracotta">{c.eyebrow}</p>
          <h1 className="font-display text-4xl font-semibold sm:text-5xl">
            {c.title1} <em className="not-italic text-terracotta">{c.title2}</em>
          </h1>
          <p className="mt-4 max-w-md text-ink-soft">{c.subtitle}</p>
          <a
            href={whatsappHref()}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-ivory hover:-translate-y-0.5 transition-transform"
          >
            {c.goToWhatsapp}
            <span aria-hidden="true">→</span>
          </a>
        </div>
        {heroProduct && <ProductPlate product={heroProduct} className="aspect-4/3 rounded-none md:aspect-square" iconSize={220} />}
      </section>

      <section className="border-b border-line px-4 py-8 sm:px-6">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-6 text-center lg:grid-cols-4">
          {trustRow.map(([title, sub]) => (
            <div key={title}>
              <p className="font-semibold">{title}</p>
              <p className="mt-1 text-xs text-ink-soft">{sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Bug real corregido: la rejilla anterior era de 3 columnas
          (0.8fr/1.2fr/0.8fr) con la MISMA altura de fila forzada por CSS
          Grid — como el formulario es mucho más alto que las otras dos
          columnas, quedaba muchísimo hueco vacío dentro de esa fila,
          especialmente visible en dark mode (fondo oscuro uniforme sin
          ninguna tarjeta que lo rompiera). Reestructurado a 2 columnas con
          `items-start`: el formulario a la izquierda, y a la derecha las
          dos secciones cortas apiladas una encima de otra en vez de una al
          lado de la otra — su altura combinada se acerca mucho más a la
          del formulario, así que ya no queda una columna corta "flotando"
          en medio de una fila alta. */}
      <section className="mx-auto grid max-w-6xl items-start gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          <h2 className="mb-1 font-display text-xl font-semibold">{c.writeTitle}</h2>
          <p className="mb-4 text-sm text-ink-soft">{c.writeSubtitle}</p>
          <ContactForm />
        </div>

        <div className="flex flex-col gap-10">
          <div>
            <h2 className="mb-4 font-display text-xl font-semibold">{c.otherChannelsTitle}</h2>
            <div className="flex flex-col gap-4">
              <a href={whatsappHref()} target="_blank" rel="noopener noreferrer" className="block rounded-2xl bg-surface-2 p-4">
                <p className="font-semibold">{c.whatsappLabel}</p>
                <p className="mt-1 text-sm text-terracotta">{WHATSAPP_DISPLAY}</p>
                <p className="mt-0.5 text-xs text-ink-soft">{WHATSAPP_HOURS}</p>
              </a>
              <a href={`mailto:${CONTACT_EMAIL}`} className="block rounded-2xl border border-line p-4">
                <p className="font-semibold">{c.emailLabel}</p>
                <p className="mt-1 text-sm text-ink-soft">{CONTACT_EMAIL}</p>
                <p className="mt-0.5 text-xs text-ink-soft">{c.emailResponse}</p>
              </a>
              <div className="rounded-2xl border border-line p-4">
                <p className="font-semibold">{c.storeLabel}</p>
                <p className="mt-1 text-sm text-ink-soft">{STORE_ADDRESS}</p>
                <p className="mt-0.5 text-xs text-ink-soft">{STORE_HOURS}</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-surface-2 p-6">
            <h2 className="mb-4 font-display text-xl font-semibold">{c.whyTitle}</h2>
            <ul className="flex flex-col gap-3 text-sm text-ink-soft">
              {whyContact.map((w) => (
                <li key={w} className="flex items-start gap-2 border-b border-line pb-3 last:border-b-0 last:pb-0">
                  <span className="mt-0.5 text-terracotta">✓</span>
                  {w}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="mx-auto mb-16 flex max-w-4xl flex-wrap items-center justify-between gap-4 rounded-2xl bg-surface-2 px-6 py-6 sm:mx-6">
        <div>
          <p className="font-semibold">{c.helpNowTitle}</p>
          <p className="text-sm text-ink-soft">{c.helpNowSubtitle}</p>
        </div>
        <a href={whatsappHref()} target="_blank" rel="noopener noreferrer" className="rounded-full bg-ink px-6 py-3 text-sm font-semibold text-ivory">
          {c.goToWhatsapp}
        </a>
      </section>

      <section className="mx-auto mb-24 max-w-5xl overflow-hidden rounded-2xl border border-line shadow-lg sm:mx-6">
        {/* Puerto Almenara es un lugar inventado para esta demo — un iframe de
            Google Maps real no encontraría nada (o encontraría un sitio
            equivocado), así que en vez de fingir una integración real se usa
            un plano ilustrativo propio, honesto sobre lo que es. */}
        <div className="relative aspect-video w-full sm:aspect-21/9">
          <StoreMapIllustration />
        </div>
        <div className="flex flex-col items-center gap-4 bg-surface-2 px-6 py-8 text-center sm:flex-row sm:justify-between sm:text-left">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-terracotta">{c.storeLabel}</p>
            <p className="mt-2 font-display text-xl font-semibold">{STORE_ADDRESS}</p>
            <p className="mt-1 text-sm text-ink-soft">{STORE_HOURS}</p>
          </div>
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(STORE_ADDRESS)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-ivory"
          >
            {c.howToArrive}
          </a>
        </div>
      </section>
    </>
  );
}

function StoreMapIllustration() {
  return (
    <svg viewBox="0 0 800 300" className="h-full w-full" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <rect width="800" height="300" fill="#e7dcc8" />
      {/* Costa: franja de mar a la derecha */}
      <path d="M560 0 C 620 60, 600 140, 660 200 C 700 240, 760 260, 800 250 L 800 300 L 560 300 Z" fill="#a9c9c9" opacity="0.55" />
      {/* Calles */}
      <path d="M0 90 H 800" stroke="#c9b48f" strokeWidth="3" />
      <path d="M0 190 H 800" stroke="#c9b48f" strokeWidth="3" />
      <path d="M180 0 V 300" stroke="#c9b48f" strokeWidth="3" />
      <path d="M420 0 V 300" stroke="#c9b48f" strokeWidth="3" />
      <path d="M300 90 L 340 190" stroke="#c9b48f" strokeWidth="2" opacity="0.7" />
      {/* Manzanas */}
      {[
        [40, 20, 110, 50],
        [220, 20, 160, 50],
        [40, 120, 110, 50],
        [460, 20, 80, 50],
        [220, 220, 160, 50],
        [40, 220, 110, 50],
      ].map(([x, y, w, h], i) => (
        <rect key={i} x={x} y={y} width={w} height={h} fill="#f0e6d8" stroke="#c9b48f" strokeWidth="1.5" rx="4" />
      ))}
      {/* Pin de la tienda */}
      <g transform="translate(300 140)">
        <circle cx="0" cy="0" r="22" fill="#b87333" opacity="0.18" />
        <path d="M0 -26c-11 0-19 8-19 19 0 14 19 33 19 33s19-19 19-33c0-11-8-19-19-19Z" fill="#b87333" />
        <circle cx="0" cy="-7" r="7" fill="#faf6f0" />
      </g>
    </svg>
  );
}
