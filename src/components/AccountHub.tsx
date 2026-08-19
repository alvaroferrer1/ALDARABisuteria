"use client";

import Link from "next/link";
import { useTranslations } from "@/lib/i18n/localeStore";
import { useCart } from "@/context/CartContext";
import { money } from "@/lib/storage";
import type { DemoOrder } from "@/lib/types";

/**
 * Espacio "Mi cuenta" (chrome real de la página, no los datos) extraído a
 * cliente para traducir de verdad ES/EN/FR — antes fijo en español (ref.
 * 0.6). Los datos del propio pedido (nombres de producto, precios) siguen
 * viniendo del servidor tal cual, no se traducen porque son contenido real.
 */
const LOCALE_TAG: Record<string, string> = { es: "es-ES", en: "en-US", fr: "fr-FR" };

export function AccountGreeting({ userName, memberSinceISO }: { userName: string; memberSinceISO: string | null }) {
  const { t, locale } = useTranslations();
  const memberSince = memberSinceISO
    ? new Date(memberSinceISO).toLocaleDateString(LOCALE_TAG[locale], { month: "long", year: "numeric" })
    : null;
  return (
    <div>
      <p className="mb-1 text-xs font-bold uppercase tracking-widest text-terracotta">{t.account.yourSpace}</p>
      <h1 className="font-display text-3xl font-semibold sm:text-4xl">
        {t.account.hello} {userName}
      </h1>
      {memberSince && (
        <p className="mt-1 text-sm text-ink-soft">
          {t.account.memberSince} {memberSince}
        </p>
      )}
    </div>
  );
}

export function AccountHub({ orders }: { orders: DemoOrder[] }) {
  const { t } = useTranslations();
  const { addItem } = useCart();

  // "Volver a comprar" (POST_AUDIT_IMPROVEMENTS.md, bloque S): añade a la
  // cesta todas las piezas de un pedido anterior con un clic — no navega,
  // se queda en la propia página para que se note el añadido.
  function reorder(order: DemoOrder, e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    for (const item of order.items) addItem(item.productId, item.quantity);
  }

  const SPACE_LINKS = [
    { href: "/account/jewelry-box", label: t.account.jewelryBox, sub: t.account.jewelryBoxSub, icon: "M12 3l3 6 6 1-4.5 4 1 6-5.5-3-5.5 3 1-6L3 10l6-1Z" },
    { href: "/wishlist", label: t.account.wishlist, sub: t.account.wishlistSub, icon: "M12 21s-7.5-4.6-10-9.3C.4 8.3 2.1 5 5.6 5c2 0 3.4 1 4.4 2.4C11 6 12.4 5 14.4 5c3.5 0 5.2 3.3 3.6 6.7C19.5 16.4 12 21 12 21Z" },
    { href: "/club", label: t.account.club, sub: t.account.clubSub, icon: "M12 2 3 7v6c0 5 4 8 9 9 5-1 9-4 9-9V7l-9-5Z" },
    { href: "/account/direcciones", label: t.account.addresses, sub: t.account.addressesSub, icon: "M12 21s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12Zm0-9a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" },
    { href: "/account/preferencias", label: t.account.preferences, sub: t.account.preferencesSub, icon: "M12 4a4 4 0 0 1 4 4c0 3-4 8-4 8s-4-5-4-8a4 4 0 0 1 4-4Z" },
    { href: "/account/seguridad", label: t.account.security, sub: t.account.securitySub, icon: "M6 11V8a6 6 0 1 1 12 0v3m-14 0h16v9H4v-9Z" },
    {
      href: "/account/notificaciones",
      label: t.account.notifications,
      sub: t.account.notificationsSub,
      icon: "M15 17h5l-1.4-1.4A2 2 0 0 1 18 14.2V11a6 6 0 1 0-12 0v3.2a2 2 0 0 1-.6 1.4L4 17h5m6 0v1a3 3 0 1 1-6 0v-1m6 0H9",
    },
    { href: "/compare", label: t.account.compare, sub: t.account.compareSub, icon: "M8 3v18M16 3v18M4 8h4M16 8h4M4 16h4M16 16h4" },
    { href: "/gift-cards", label: t.account.giftCard, sub: t.account.giftCardSub, icon: "M8 20h32v20H8ZM8 20 24 8l16 12M24 8v32" },
    {
      href: "/account/reparaciones",
      label: t.account.repairs,
      sub: t.account.repairsSub,
      icon: "M14.7 6.3a4 4 0 0 1 5.6 5.6l-9 9-6-1 1-6 8.4-7.6ZM4 20h16",
    },
    {
      href: "/account/year-in-aldara",
      label: t.account.yearInAldara,
      sub: t.account.yearInAldaraSub,
      icon: "M4 19V5a2 2 0 0 1 2-2h9l5 5v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Zm7-7 3 3 5-6",
    },
  ];

  return (
    <>
      <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <div className="grid gap-4 sm:grid-cols-2">
          {SPACE_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="group flex items-center gap-4 rounded-2xl border border-line p-5 hover:border-terracotta hover:bg-surface-2">
              <svg viewBox="0 0 24 24" width="24" height="24" className="shrink-0 text-terracotta" aria-hidden="true">
                <path d={link.icon} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span>
                <span className="block font-semibold group-hover:text-terracotta">{link.label}</span>
                <span className="block text-sm text-ink-soft">{link.sub}</span>
              </span>
            </Link>
          ))}
        </div>

        <h2 className="mb-4 mt-12 font-semibold">{t.account.yourOrders}</h2>
        {orders.length === 0 ? (
          <p className="rounded-2xl bg-surface-2 p-8 text-center text-ink-soft">{t.account.noOrders}</p>
        ) : (
          <ul className="flex flex-col gap-3">
            {orders.map((order) => (
              <li key={order.id}>
                <Link href={`/account/pedidos/${order.id}`} className="block rounded-2xl border border-line p-5 hover:border-terracotta hover:bg-surface-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-semibold">
                      {t.account.order} #{order.id.slice(0, 8)}
                    </span>
                    <span className="rounded-full bg-surface-2 px-3 py-1 text-xs font-semibold uppercase text-ink-soft">{order.status}</span>
                  </div>
                  <p className="mt-1 text-xs text-ink-soft">{new Date(order.createdAt).toLocaleDateString("es-ES")}</p>
                  <p className="mt-2 text-sm text-ink-soft">{order.items.map((i) => `${i.quantity}x ${i.name}`).join(", ")}</p>
                  <div className="mt-2 flex items-center justify-between gap-3">
                    <p className="font-semibold">{money(order.total)}</p>
                    <button
                      type="button"
                      onClick={(e) => reorder(order, e)}
                      className="rounded-full border border-line px-4 py-1.5 text-xs font-semibold hover:border-terracotta hover:text-terracotta"
                    >
                      Volver a comprar
                    </button>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
