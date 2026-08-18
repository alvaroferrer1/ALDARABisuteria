"use client";

import Link from "next/link";
import { useId, useRef, useState } from "react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { ThemeToggle } from "./ThemeToggle";
import { COLLECTIONS } from "@/lib/collections";
import { LogoMark, LogoWordmark } from "./Logo";
import { openSearch } from "@/lib/searchOverlayStore";
import { useTranslations, setLocale } from "@/lib/i18n/localeStore";
import { LOCALES, type Locale } from "@/lib/i18n/locales";
import { AnnouncementTicker } from "./AnnouncementTicker";
import { Icon } from "./Icon";

const CATEGORY_MEGA_LINKS: Array<{ href: string; label: string; icon: string }> = [
  { href: "/shop?categoria=pendientes", label: "Pendientes", icon: "earring" },
  { href: "/shop?categoria=colgantes", label: "Colgantes", icon: "pendant" },
  { href: "/shop?categoria=pulseras", label: "Pulseras", icon: "bracelet" },
  { href: "/shop?categoria=charms", label: "Charms", icon: "charm" },
];

const MEGA_ICON_PATHS: Record<string, string> = {
  earring: "M12 3v6m0 0a5 5 0 1 0 5 5",
  pendant: "M8 3h8l-1.5 6a2.5 2.5 0 1 1-5 0Z",
  bracelet: "M4 12a8 4 0 1 0 16 0 8 4 0 1 0-16 0Z",
  charm: "M12 4a4 4 0 0 1 4 4c0 3-4 8-4 8s-4-5-4-8a4 4 0 0 1 4-4Z",
};

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState<"catalogo" | "colecciones" | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const megaId = useId();
  const { totalItems, openCart } = useCart();
  const { ids } = useWishlist();
  const { locale, t } = useTranslations();

  // Estructura de navegación real de ALDARA_Propuesta_Cliente_FINAL_v2.pdf
  // (nav bar de todas las páginas de la propuesta), con etiquetas traducidas.
  const NAV_LINKS = [
    { href: "/drops", label: t.nav.new },
    { href: "/shop", label: t.nav.jewelry, mega: "catalogo" as const },
    { href: "/colecciones", label: t.nav.collections, mega: "colecciones" as const },
    { href: "/personaliza", label: t.nav.personalized },
    { href: "/regalos", label: t.nav.giftFinder },
    { href: "/regalos/ideas", label: t.nav.gifts },
    { href: "/nosotros", label: t.nav.about },
    { href: "/contacto", label: t.nav.contact },
  ];

  const ANNOUNCEMENTS = [
    { icon: "♡", text: t.announcements.handmade },
    { icon: "🌐", text: t.announcements.cultures },
    { icon: "🚚", text: t.announcements.shipping },
  ];

  function openMega(key: "catalogo" | "colecciones") {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setMegaOpen(key);
  }

  function scheduleClose() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setMegaOpen(null), 120);
  }

  return (
    <header className="sticky top-0 z-40" style={{ backgroundColor: "#0d1220" }}>
      {/* Barra de anuncios — siempre azul profundo fijo, igual en claro/oscuro (identidad de marca, no tema) */}
      <div className="hidden items-center justify-between border-b border-white/10 px-6 py-2 text-[0.7rem] text-white/80 sm:flex">
        <div className="flex items-center gap-6">
          {ANNOUNCEMENTS.map((a) => (
            <span key={a.text} className="flex items-center gap-1.5">
              <span aria-hidden="true">{a.icon}</span> {a.text}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 font-semibold tracking-wide" role="group" aria-label="Selector de idioma / Language selector / Sélecteur de langue">
            {LOCALES.map((l, i) => (
              <span key={l} className="flex items-center gap-1.5">
                {i > 0 && <span className="text-white/30">|</span>}
                <button
                  type="button"
                  onClick={() => setLocale(l as Locale)}
                  aria-current={locale === l}
                  className={locale === l ? "text-[#d4af37]" : "text-white/50 hover:text-white/80"}
                >
                  {l.toUpperCase()}
                </button>
              </span>
            ))}
          </div>
          <ThemeToggle className="text-white/80 hover:bg-white/10" />
        </div>
      </div>
      <AnnouncementTicker items={ANNOUNCEMENTS} />

      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5 text-white" aria-label="ALDARA, inicio">
          <LogoMark size={38} className="text-[#d4af37]" />
          <LogoWordmark className="hidden text-white min-[420px]:inline" />
        </Link>

        <nav className="hidden gap-7 lg:flex" aria-label="Navegación principal" onMouseLeave={scheduleClose}>
          {NAV_LINKS.map((link) =>
            link.mega ? (
              <div
                key={link.href}
                className="relative"
                onMouseEnter={() => openMega(link.mega!)}
                onFocus={() => openMega(link.mega!)}
                onBlur={scheduleClose}
              >
                <Link
                  href={link.href}
                  aria-expanded={megaOpen === link.mega}
                  aria-controls={`${megaId}-${link.mega}`}
                  className="text-sm font-medium tracking-wide text-white/90 hover:text-[#d4af37]"
                >
                  {link.label}
                </Link>
                {megaOpen === link.mega && (
                  <div
                    id={`${megaId}-${link.mega}`}
                    role="menu"
                    className="absolute left-1/2 top-full z-50 w-[min(640px,90vw)] -translate-x-1/2 pt-4"
                  >
                    <div className="rounded-lg border border-line bg-ivory p-6 text-ink shadow-lg">
                      {link.mega === "catalogo" ? (
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                          {CATEGORY_MEGA_LINKS.map((cat) => (
                            <Link
                              key={cat.href}
                              href={cat.href}
                              role="menuitem"
                              className="group flex flex-col items-center gap-2 rounded-md p-3 text-center hover:bg-surface-2"
                            >
                              <svg viewBox="0 0 24 24" width="26" height="26" className="text-ink group-hover:text-terracotta" aria-hidden="true">
                                <path d={MEGA_ICON_PATHS[cat.icon]} fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                              </svg>
                              <span className="text-sm font-medium text-ink">{cat.label}</span>
                            </Link>
                          ))}
                          <Link
                            href="/shop"
                            role="menuitem"
                            className="col-span-2 flex items-center justify-center rounded-md border border-line p-3 text-sm font-semibold text-terracotta hover:bg-surface-2 sm:col-span-4"
                          >
                            {t.mega.viewAll}
                          </Link>
                        </div>
                      ) : (
                        <div>
                          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                            {COLLECTIONS.slice(0, 3).map((c) => (
                              <Link
                                key={c.slug}
                                href={`/colecciones/${c.slug}`}
                                role="menuitem"
                                className="group rounded-md p-3 hover:bg-surface-2"
                              >
                                <span className="block font-display text-base text-ink group-hover:text-terracotta">{c.name}</span>
                                <span className="mt-1 block text-xs text-ink/60">{c.tagline}</span>
                              </Link>
                            ))}
                          </div>
                          <div className="mt-3 grid grid-cols-3 gap-2 border-t border-line pt-3 text-center text-xs font-semibold sm:grid-cols-4 lg:grid-cols-7">
                            <Link href="/lookbook" role="menuitem" className="rounded-md p-2 text-ink-soft hover:bg-surface-2 hover:text-terracotta">
                              Lookbook
                            </Link>
                            <Link href="/edit" role="menuitem" className="rounded-md p-2 text-ink-soft hover:bg-surface-2 hover:text-terracotta">
                              The Edit
                            </Link>
                            <Link href="/mood-shop" role="menuitem" className="rounded-md p-2 text-ink-soft hover:bg-surface-2 hover:text-terracotta">
                              Mood Shop
                            </Link>
                            <Link
                              href="/shop-the-moment"
                              role="menuitem"
                              className="rounded-md p-2 text-ink-soft hover:bg-surface-2 hover:text-terracotta"
                            >
                              Shop the Moment
                            </Link>
                            <Link href="/atelier" role="menuitem" className="rounded-md p-2 text-ink-soft hover:bg-surface-2 hover:text-terracotta">
                              Atelier
                            </Link>
                            <Link href="/journal" role="menuitem" className="rounded-md p-2 text-ink-soft hover:bg-surface-2 hover:text-terracotta">
                              Journal
                            </Link>
                            <Link href="/faq" role="menuitem" className="rounded-md p-2 text-ink-soft hover:bg-surface-2 hover:text-terracotta">
                              Preguntas frecuentes
                            </Link>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link key={link.href} href={link.href} className="text-sm font-medium tracking-wide text-white/90 hover:text-[#d4af37]">
                {link.label}
              </Link>
            )
          )}
        </nav>

        <div className="flex items-center gap-0.5 sm:gap-2">
          <button
            type="button"
            onClick={openSearch}
            aria-label={t.header.search}
            className="flex h-9 w-9 items-center justify-center rounded-full text-white hover:bg-white/10"
          >
            <Icon name="search" size={18} />
          </button>
          <Link
            href="/wishlist"
            aria-label={t.header.wishlist}
            className="relative flex h-9 w-9 items-center justify-center rounded-full text-white hover:bg-white/10"
          >
            <Icon name="heart-filled" size={18} />
            {ids.length > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#d4af37] px-1 text-[0.6rem] font-bold text-[#0d1220]">
                {ids.length}
              </span>
            )}
          </Link>
          <button
            type="button"
            onClick={openCart}
            aria-haspopup="dialog"
            aria-label={t.header.cart}
            className="relative flex h-9 w-9 items-center justify-center rounded-full text-white hover:bg-white/10"
          >
            <Icon name="cart" size={20} />
            {totalItems > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#d4af37] px-1 text-[0.6rem] font-bold text-[#0d1220]">
                {totalItems}
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            aria-label={menuOpen ? t.header.closeMenu : t.header.menu}
            className="flex h-9 w-9 flex-col items-center justify-center gap-1.5 lg:hidden"
          >
            <span className={`h-[1.5px] w-5 bg-white transition-transform ${menuOpen ? "translate-y-[6px] rotate-45" : ""}`} />
            <span className={`h-[1.5px] w-5 bg-white transition-opacity ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`h-[1.5px] w-5 bg-white transition-transform ${menuOpen ? "-translate-y-[6px] -rotate-45" : ""}`} />
          </button>
        </div>
      </div>

      <nav
        id="mobile-nav"
        aria-label="Navegación móvil"
        className={`overflow-y-auto border-t border-white/10 transition-[max-height] duration-300 lg:hidden ${
          menuOpen ? "max-h-[80vh]" : "max-h-0"
        }`}
        style={{ backgroundColor: "#0d1220" }}
      >
        <ul className="flex flex-col px-4">
          {NAV_LINKS.map((link) => (
            <li key={link.href} className="border-b border-white/10">
              <Link href={link.href} onClick={() => setMenuOpen(false)} className="block py-3.5 text-sm font-medium text-white">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
        {/* Selector de idioma + tema — en desktop vive en la barra superior
            (oculta por debajo de sm), así que en mobile necesita un sitio
            propio; antes no existía en absoluto por debajo de sm (gap real). */}
        <div className="flex items-center justify-between border-t border-white/10 px-4 py-3.5">
          <div className="flex items-center gap-1.5 text-sm font-semibold tracking-wide" role="group" aria-label="Selector de idioma">
            {LOCALES.map((l, i) => (
              <span key={l} className="flex items-center gap-1.5">
                {i > 0 && <span className="text-white/30">|</span>}
                <button
                  type="button"
                  onClick={() => setLocale(l as Locale)}
                  aria-current={locale === l}
                  className={locale === l ? "text-[#d4af37]" : "text-white/60"}
                >
                  {l.toUpperCase()}
                </button>
              </span>
            ))}
          </div>
          <ThemeToggle className="text-white/80 hover:bg-white/10" />
        </div>
      </nav>
    </header>
  );
}
