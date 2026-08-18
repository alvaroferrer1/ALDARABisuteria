"use client";

import Link from "next/link";
import { useTranslations } from "@/lib/i18n/localeStore";

export function PreferencesChrome({
  newsletterToggle,
  languageSwitcher,
}: {
  newsletterToggle: React.ReactNode;
  languageSwitcher: React.ReactNode;
}) {
  const { t } = useTranslations();
  return (
    <>
      <Link href="/account" className="mb-6 inline-block text-sm text-ink-soft hover:text-terracotta">
        {t.accountMore.backToAccount}
      </Link>
      <p className="mb-2 text-xs font-bold uppercase tracking-widest text-terracotta">{t.accountMore.myAccount}</p>
      <h1 className="mb-8 font-display text-3xl font-semibold">{t.accountMore.preferencesTitle}</h1>

      <div className="flex items-center justify-between gap-4 rounded-2xl border border-line p-5">
        <div>
          <p className="font-semibold">{t.accountMore.newsletterTitle}</p>
          <p className="text-sm text-ink-soft">{t.accountMore.newsletterBody}</p>
        </div>
        {newsletterToggle}
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-line p-5">
        <div>
          <p className="font-semibold">{t.accountMore.languageTitle}</p>
          <p className="text-sm text-ink-soft">{t.accountMore.languageBody}</p>
        </div>
        {languageSwitcher}
      </div>

      <div className="mt-4 flex items-center justify-between gap-4 rounded-2xl border border-line p-5">
        <div>
          <p className="font-semibold">{t.accountMore.appearanceTitle}</p>
          <p className="text-sm text-ink-soft">{t.accountMore.appearanceBody}</p>
        </div>
      </div>
    </>
  );
}

export function NotificationsChrome() {
  const { t } = useTranslations();
  return (
    <>
      <Link href="/account" className="mb-6 inline-block text-sm text-ink-soft hover:text-terracotta">
        {t.accountMore.backToAccount}
      </Link>
      <p className="mb-2 text-xs font-bold uppercase tracking-widest text-terracotta">{t.accountMore.myAccount}</p>
      <h1 className="mb-2 font-display text-3xl font-semibold">{t.accountMore.notificationsTitle}</h1>
      <p className="mb-8 text-sm text-ink-soft">{t.accountMore.notificationsBody}</p>
    </>
  );
}

export function JewelryBoxHeader() {
  const { t } = useTranslations();
  return (
    <div className="mb-10">
      <p className="mb-2 text-xs font-bold uppercase tracking-widest text-terracotta">{t.accountMore.jewelryBoxEyebrow}</p>
      <h1 className="font-display text-3xl font-semibold sm:text-4xl">{t.accountMore.jewelryBoxTitle}</h1>
      <p className="mt-2 text-ink-soft">{t.accountMore.jewelryBoxSubtitle}</p>
    </div>
  );
}

export function JewelryBoxEmpty() {
  const { t } = useTranslations();
  return (
    <div className="rounded-2xl bg-surface-2 p-10 text-center">
      <p className="text-ink-soft">{t.accountMore.jewelryEmptyBody}</p>
      <Link href="/shop" className="mt-4 inline-block rounded-full bg-ink px-6 py-3 font-semibold text-ivory">
        {t.accountMore.viewCatalog}
      </Link>
    </div>
  );
}

export function JewelryLoginPrompt() {
  const { t } = useTranslations();
  return (
    <>
      <h1 className="mb-2 text-center font-display text-3xl font-semibold">{t.accountMore.jewelryBoxEyebrow}</h1>
      <p className="mb-8 text-center text-sm text-ink-soft">{t.accountMore.loginToViewJewelry}</p>
    </>
  );
}

export function JewelryCareLabel({ care }: { care: string }) {
  const { t } = useTranslations();
  return (
    <details className="mt-1 text-sm text-ink-soft">
      <summary className="cursor-pointer font-medium text-ink">{t.accountMore.careHow}</summary>
      <p className="mt-2">{care}</p>
    </details>
  );
}

export function JewelryPassportLink({ href }: { href: string }) {
  const { t } = useTranslations();
  return (
    <Link href={href} className="mt-1 text-sm font-medium text-terracotta hover:underline">
      {t.accountMore.viewPassport}
    </Link>
  );
}

export function JewelryPassportNote() {
  const { t } = useTranslations();
  return <p className="text-sm text-ink-soft">{t.accountMore.passportNote}</p>;
}

export function PassportChrome({
  productName,
  productSlug,
  purchasedAt,
  pricePaid,
  materials,
  variant,
  reference,
  limitedEdition,
  collection,
  story,
  care,
  qrSlot,
}: {
  productName: string;
  productSlug: string;
  purchasedAt: string;
  pricePaid: string;
  materials: string;
  /** Primer material del listado, como "variante" honesta (no una talla/acabado inventado). */
  variant: string;
  /** Referencia interna determinista (slug + últimos caracteres del id de pedido) — nunca se presenta como "número de serie verificado". */
  reference: string;
  /** Solo si la pieza está en `LIMITED_EDITIONS` (datos demo reales, ver lib/limitedEditions.ts); si no, se muestra `passportEditionStandard`. */
  limitedEdition?: { claimed: number; size: number };
  collection?: { name: string; href: string };
  story: string;
  care: string;
  qrSlot: React.ReactNode;
}) {
  const { t, locale } = useTranslations();
  const LOCALE_TAG: Record<string, string> = { es: "es-ES", en: "en-US", fr: "fr-FR" };
  const dateLabel = new Date(purchasedAt).toLocaleDateString(LOCALE_TAG[locale] ?? "es-ES");

  return (
    <>
      {/* Breadcrumb completo — calcado del mockup (p.35: "Inicio > Pasaporte
          Digital > Collar Brújula Aldara"), antes solo había un enlace de
          vuelta al joyero, gap real detectado comparando directamente contra
          el PDF. */}
      <p className="mb-6 text-sm text-ink-soft">
        <Link href="/" className="hover:text-terracotta">
          {t.common.home}
        </Link>{" "}
        /{" "}
        <Link href="/account/jewelry-box" className="hover:text-terracotta">
          {t.accountMore.passportBreadcrumbHub}
        </Link>{" "}
        / {productName}
      </p>
      <p className="mb-2 text-xs font-bold uppercase tracking-widest text-terracotta">{t.accountMore.passportEyebrow}</p>
      <h1 className="mb-6 font-display text-3xl font-semibold sm:text-4xl">{productName}</h1>

      {/* ID de pieza — calcado del mockup, con datos honestos: variante real
          (material), una referencia interna determinista (no un "número de
          serie verificado" inventado) y la edición real si la pieza está en
          `LIMITED_EDITIONS`. */}
      <div className="mb-6 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-line bg-line text-sm sm:grid-cols-3">
        <div className="bg-surface p-4">
          <dt className="text-xs text-ink-soft">{t.accountMore.passportVariant}</dt>
          <dd className="mt-1 font-medium">{variant}</dd>
        </div>
        <div className="bg-surface p-4">
          <dt className="text-xs text-ink-soft">{t.accountMore.passportReference}</dt>
          <dd className="mt-1 font-medium">{reference}</dd>
        </div>
        <div className="bg-surface p-4">
          <dt className="text-xs text-ink-soft">{t.accountMore.passportEdition}</dt>
          <dd className="mt-1 font-medium">
            {limitedEdition ? `${t.accountMore.passportEditionLimited} · ${limitedEdition.claimed}/${limitedEdition.size}` : t.accountMore.passportEditionStandard}
          </dd>
        </div>
      </div>

      <dl className="divide-y divide-line rounded-2xl border border-line text-sm">
        <div className="flex justify-between p-4">
          <dt className="text-ink-soft">{t.accountMore.purchasedOn}</dt>
          <dd className="font-medium">{dateLabel}</dd>
        </div>
        <div className="flex justify-between p-4">
          <dt className="text-ink-soft">{t.accountMore.pricePaid}</dt>
          <dd className="font-medium">{pricePaid}</dd>
        </div>
        <div className="flex justify-between p-4">
          <dt className="text-ink-soft">{t.accountMore.materials}</dt>
          <dd className="text-right font-medium">{materials}</dd>
        </div>
        {collection && (
          <div className="flex justify-between p-4">
            <dt className="text-ink-soft">{t.accountMore.collectionLabel}</dt>
            <dd className="font-medium">
              <Link href={collection.href} className="underline">
                {collection.name}
              </Link>
            </dd>
          </div>
        )}
        <div className="flex justify-between p-4">
          <dt className="text-ink-soft">{t.accountMore.orderLabel}</dt>
          <dd className="font-medium">
            <Link href="/account" className="underline">
              {t.accountMore.viewInOrders}
            </Link>
          </dd>
        </div>
      </dl>

      <div className="mt-8">
        <h2 className="mb-2 font-semibold">{t.accountMore.pieceStory}</h2>
        <p className="mb-6 text-ink-soft">{story}</p>
        <h2 className="mb-2 font-semibold">{t.accountMore.careHow}</h2>
        <p className="text-ink-soft">{care}</p>
      </div>

      {/* Rejilla de tarjetas — Origen/Artesano/Reparación/Regalo, calcada del
          mockup (fila de 5 tarjetas bajo la historia). Se omiten a propósito
          "Verificado y Auténtico" y "Descargar certificado" del mockup: no
          existe ningún proceso real de verificación de autenticidad todavía
          — mostrarlos sería inventar un dato de confianza falso, lo mismo
          que ya se decidió con "número de serie" antes de esta pasada. */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-line p-5">
          <h3 className="mb-1.5 text-sm font-semibold">{t.accountMore.passportOriginTitle}</h3>
          <p className="text-sm text-ink-soft">{t.accountMore.passportOriginBody}</p>
        </div>
        <div className="rounded-2xl border border-line p-5">
          <h3 className="mb-1.5 text-sm font-semibold">{t.accountMore.passportWorkshopTitle}</h3>
          <p className="text-sm text-ink-soft">{t.accountMore.passportWorkshopBody}</p>
        </div>
        <div className="rounded-2xl border border-line p-5">
          <h3 className="mb-1.5 text-sm font-semibold">{t.accountMore.passportRepairTitle}</h3>
          <p className="mb-2 text-sm text-ink-soft">{t.accountMore.passportRepairBody}</p>
          <Link href="/reparaciones" className="text-sm font-semibold text-terracotta hover:underline">
            {t.accountMore.passportRepairCta}
          </Link>
        </div>
        <div className="rounded-2xl border border-line p-5">
          <h3 className="mb-1.5 text-sm font-semibold">{t.accountMore.passportGiftTitle}</h3>
          <p className="mb-2 text-sm text-ink-soft">{t.accountMore.passportGiftBody}</p>
          <Link href={`/gift-story/create?pieza=${encodeURIComponent(productSlug)}`} className="text-sm font-semibold text-terracotta hover:underline">
            {t.accountMore.passportGiftCta}
          </Link>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="mb-3 font-semibold">{t.accountMore.shareTitle}</h2>
        {qrSlot}
      </div>

      {/* Tarjeta de cierre de marca — calcada del mockup ("Cada pieza cuenta una historia"). */}
      <div className="mt-8 rounded-2xl bg-surface-2 p-6 text-center">
        <p className="font-display text-lg font-semibold">{t.accountMore.passportClosingTitle}</p>
        <p className="mt-1 text-sm text-ink-soft">{t.accountMore.passportClosingBody}</p>
      </div>

      <p className="mt-10 border-t border-line pt-6 text-sm text-ink-soft">{t.accountMore.passportDisclaimer}</p>
    </>
  );
}
