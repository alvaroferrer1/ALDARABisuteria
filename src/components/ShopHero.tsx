"use client";

import Link from "next/link";
import { useTranslations } from "@/lib/i18n/localeStore";
import type { ProductCategory } from "@/lib/types";
import { DemoPhoto } from "./DemoPhoto";
import { PhotoSlot } from "./PhotoSlot";

/**
 * Breadcrumb "Inicio / Catálogo" — presente en el mockup de /shop (p.14,
 * "Inicio > Tienda / Catálogo") y ausente en la implementación real, gap
 * detectado en la comparación directa PDF↔LIVE.
 */
export function ShopBreadcrumb() {
  const { t } = useTranslations();
  return (
    <div className="mx-auto max-w-6xl px-4 pt-8 text-sm text-ink-soft sm:px-6">
      <Link href="/" className="hover:text-terracotta">
        {t.common.home}
      </Link>{" "}
      / {t.pdp.breadcrumbCatalog}
    </div>
  );
}

/**
 * Banner "Joyas con propósito" bajo la rejilla del catálogo — calcado del
 * mockup (p.14): foto a sangre + texto de marca + 3 insignias, ausente en
 * la implementación real (gap real detectado en comparación directa
 * PDF↔LIVE, no listado antes porque las pasadas previas de esta auditoría
 * no habían comparado /shop imagen contra imagen).
 */
export function ShopPurposeBanner() {
  const { t } = useTranslations();
  const p = t.shopPurpose;
  const badges = [
    [p.badge1, p.badge1sub],
    [p.badge2, p.badge2sub],
    [p.badge3, p.badge3sub],
  ];
  return (
    <section className="mt-14 grid overflow-hidden rounded-3xl border border-line lg:grid-cols-2">
      <div className="relative min-h-56 sm:min-h-72">
        <DemoPhoto seed="shop-purpose" tone="var(--gold)" />
      </div>
      <div className="flex flex-col justify-center bg-surface-2 p-8 sm:p-12">
        <h2 className="font-display text-2xl font-semibold sm:text-3xl">{p.title}</h2>
        <p className="mt-3 text-ink-soft">{p.description}</p>
        <Link href="/colecciones" className="mt-4 inline-block font-semibold text-terracotta hover:underline">
          {p.cta}
        </Link>
        <div className="mt-6 grid grid-cols-1 gap-4 border-t border-line pt-6 sm:grid-cols-3">
          {badges.map(([title, sub]) => (
            <div key={title}>
              <p className="text-xs font-bold uppercase tracking-wide text-ink-soft">{title}</p>
              <p className="mt-1 text-xs text-ink-soft">{sub}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * Hero de categoría del catálogo — extraído a componente cliente para
 * poder usar `useTranslations` (i18n real ES/EN/FR), ya que `shop/page.tsx`
 * es un Server Component sin acceso al locale guardado en localStorage.
 * Antes el hero de categoría quedaba siempre en español pese a cambiar de
 * idioma — gap real detectado en la auditoría (ref. 0.6).
 */
export function ShopHero({ category }: { category: ProductCategory | "todos" }) {
  const { t } = useTranslations();
  const key = category;
  const eyebrow = t.shop[`${key}Eyebrow` as keyof typeof t.shop];
  const title = t.shop[`${key}Title` as keyof typeof t.shop];
  const description = t.shop[`${key}Description` as keyof typeof t.shop];

  return (
    <section className="relative flex min-h-72 flex-col items-center justify-center overflow-hidden px-4 py-16 text-center sm:px-6">
      <PhotoSlot name="shop-hero" alt="" fallback={<div className="absolute inset-0" style={{ backgroundColor: "#2a2116" }} />} />
      <div className="absolute inset-0 bg-linear-to-t from-black/55 via-black/20 to-black/10" />
      <p className="relative mb-3 text-xs font-bold uppercase tracking-widest text-[#e3c665]">{eyebrow}</p>
      <h1 className="relative font-display text-4xl font-semibold text-white sm:text-5xl">{title}</h1>
      <p className="relative mx-auto mt-4 max-w-lg text-white/85">{description}</p>
    </section>
  );
}
