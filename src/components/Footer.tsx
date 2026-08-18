"use client";

import Link from "next/link";
import { NewsletterForm } from "./NewsletterForm";
import { LogoMark } from "./Logo";
import { openCookiePreferences } from "@/lib/cookieConsentStore";
import { Icon } from "./Icon";
import { useTranslations } from "@/lib/i18n/localeStore";

// Estructura de 4 columnas exacta de ALDARA_Propuesta_Cliente_FINAL_v2.pdf
// (footer presente en todas las páginas del mockup): DESCUBRIR · TIENDA · AYUDA · SUSCRÍBETE.
// Las etiquetas viven en el namespace `footerLinks` (bug real corregido: antes
// estaban hardcodeadas en español y no cambiaban con el idioma, aunque los
// títulos de columna sí — detectado en auditoría visual EN/FR).
function useFooterLinkGroups() {
  const { t } = useTranslations();
  const fl = t.footerLinks;
  return {
    discover: [
      { href: "/nosotros", label: fl.ourStory },
      { href: "/atelier", label: fl.craftsmanship },
      { href: "/experiencias", label: fl.experiences },
      { href: "/edit", label: fl.theEdit },
      { href: "/mood-shop", label: fl.moodShop },
      { href: "/shop-the-moment", label: fl.shopTheMoment },
      { href: "/lookbook", label: fl.lookbook },
      { href: "/try-on", label: fl.tryOn },
      { href: "/materiales", label: fl.materials },
      { href: "/packaging", label: fl.packaging },
      { href: "/cuidados", label: fl.jewelryCare },
      { href: "/journal", label: fl.blog },
    ],
    shop: [
      { href: "/shop", label: fl.allJewelry },
      { href: "/mas-queridas", label: fl.bestSellers },
      { href: "/shop?categoria=charms", label: fl.charms },
      { href: "/shop?categoria=pulseras", label: fl.bracelets },
      { href: "/shop?categoria=pendientes", label: fl.earrings },
      { href: "/shop?categoria=colgantes", label: fl.pendants },
      { href: "/colecciones", label: fl.collections },
    ],
    help: [
      { href: "/concierge", label: fl.conciergeAldara },
      { href: "/citas", label: fl.appointments },
      { href: "/aftercare", label: fl.aftercare },
      { href: "/gift-cards", label: fl.giftCard },
      { href: "/faq", label: fl.faq },
      { href: "/legal/envios-devoluciones", label: fl.shipping },
      { href: "/legal/envios-devoluciones", label: fl.returns },
      { href: "/contacto", label: fl.contact },
    ],
    // Columna "Cuenta" real del footer (Bloque 2 del PDF de propuesta, p.21) —
    // confirma el naming "Joyero digital" para lo que ya construimos como Jewelry Box.
    // Ampliada con el resto de páginas de cuenta reales que ya existían en el código
    // pero no estaban enlazadas desde ningún sitio del footer (gap real: la columna
    // se quedaba en 4 enlaces y dejaba un hueco enorme frente a Descubrir con 12).
    account: [
      { href: "/account", label: fl.myAccount },
      { href: "/account", label: fl.orders },
      { href: "/wishlist", label: fl.wishlist },
      { href: "/account/jewelry-box", label: fl.jewelryBox },
      { href: "/club", label: fl.club },
      { href: "/compare", label: fl.compare },
      { href: "/account/direcciones", label: fl.addresses },
      { href: "/account/seguridad", label: fl.security },
      { href: "/account/notificaciones", label: fl.notifications },
      { href: "/account/privacidad", label: fl.accountPrivacy },
    ],
    legal: [
      { href: "/legal/privacidad", label: fl.privacy },
      { href: "/legal/cookies", label: fl.cookies },
      { href: "/legal/terminos", label: fl.terms },
      { href: "/legal/aviso-legal", label: fl.legalNotice },
      { href: "/accesibilidad", label: fl.accessibility },
    ],
  };
}

export function Footer() {
  const { t } = useTranslations();
  const { discover: DISCOVER_LINKS, shop: SHOP_LINKS, help: HELP_LINKS, account: ACCOUNT_LINKS, legal: LEGAL_LINKS } = useFooterLinkGroups();
  return (
    <footer style={{ backgroundColor: "#0d1220" }} className="relative overflow-hidden pt-16 text-white">
      {/* Rama floral dorada — calcada de p.2 del PDF de propuesta (esquina inferior
          derecha del footer, junto a "Suscríbete"): tallo desde abajo-izquierda,
          2 hojas + 1 capullo, flor tipo magnolia de 6 pétalos en abanico.
          La versión anterior era un garabato abstracto sin relación real con
          el mockup — redibujada pétalo a pétalo sobre el crop exacto de la p.2. */}
      <svg
        viewBox="0 0 220 260"
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 right-0 hidden w-40 text-[#d4af37]/25 sm:block lg:w-56"
      >
        {/* Tallo principal */}
        <path d="M30,258 C46,208 52,168 68,138 C88,102 122,86 152,80 C160,78 165,77 168,76" fill="none" stroke="currentColor" strokeWidth="1.5" />
        {/* Hoja grande inferior */}
        <path d="M68,138 C60,150 46,158 30,156" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <g transform="translate(30,156) rotate(-100)">
          <path d="M0,0 C-11,-16 -11,-38 0,-56 C11,-38 11,-16 0,0 Z" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <path d="M0,-4 L0,-50" stroke="currentColor" strokeWidth="1" opacity="0.6" />
        </g>
        {/* Hoja pequeña junto a la flor */}
        <path d="M140,95 C148,102 158,104 168,100" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <g transform="translate(168,100) rotate(70)">
          <path d="M0,0 C-6,-9 -6,-21 0,-30 C6,-21 6,-9 0,0 Z" fill="none" stroke="currentColor" strokeWidth="1.5" />
        </g>
        {/* Capullo derecho */}
        <path d="M172,80 C182,88 190,96 196,108" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <g transform="translate(196,108) rotate(95)">
          <path d="M0,0 C-5,-7 -5,-16 0,-22 C5,-16 5,-7 0,0 Z" fill="none" stroke="currentColor" strokeWidth="1.5" />
        </g>
        {/* Flor: 6 pétalos en abanico, calcados en ángulo/proporción del crop de la p.2 */}
        <g transform="translate(168,78)">
          <g transform="rotate(-58)"><path d="M0,0 C-11,-16 -10,-38 0,-58 C10,-38 11,-16 0,0 Z" fill="none" stroke="currentColor" strokeWidth="1.5" /></g>
          <g transform="rotate(-32)"><path d="M0,0 C-13,-21 -12,-50 0,-74 C12,-50 13,-21 0,0 Z" fill="none" stroke="currentColor" strokeWidth="1.5" /></g>
          <g transform="rotate(-8)"><path d="M0,0 C-13,-24 -13,-58 0,-84 C13,-58 13,-24 0,0 Z" fill="none" stroke="currentColor" strokeWidth="1.5" /></g>
          <g transform="rotate(14)"><path d="M0,0 C-12,-23 -12,-55 0,-80 C12,-55 12,-23 0,0 Z" fill="none" stroke="currentColor" strokeWidth="1.5" /></g>
          <g transform="rotate(38)"><path d="M0,0 C-11,-19 -10,-46 0,-68 C10,-46 11,-19 0,0 Z" fill="none" stroke="currentColor" strokeWidth="1.5" /></g>
          <g transform="rotate(64)"><path d="M0,0 C-9,-15 -9,-35 0,-52 C9,-35 9,-15 0,0 Z" fill="none" stroke="currentColor" strokeWidth="1.5" /></g>
        </g>
      </svg>

      {/* Bug real corregido: había 6 bloques (marca, descubrir, tienda, ayuda,
          cuenta, suscríbete) sobre una plantilla de solo 5 columnas — el 6º
          bloque caía a una fila nueva bajo la 1ª columna, dejando un hueco
          horizontal enorme en las columnas 2-5 de esa fila. */}
      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 pb-12 sm:px-6 md:grid-cols-[1.1fr_0.7fr_0.7fr_0.7fr_0.7fr_0.9fr]">
        <div>
          <div className="mb-3 flex items-center gap-2.5">
            <LogoMark size={34} className="text-[#d4af37]" />
            <span className="font-display text-xl font-semibold tracking-[0.1em]">ALDARA</span>
          </div>
          <p className="max-w-[240px] text-sm text-white/60">{t.footer.tagline}</p>
          <div className="mt-5 flex items-center gap-2" aria-label="Culturas ALDARA">
            <svg viewBox="0 0 3 2" width="22" role="img" aria-label="Colombia">
              <rect width="3" height="2" fill="#0067C6" />
              <rect width="3" height="0.666" y="0.666" fill="#fff" />
            </svg>
            <svg viewBox="0 0 3 2" width="22" role="img" aria-label="Venezuela">
              <rect width="3" height="2" fill="#00247D" />
              <rect width="3" height="0.666" fill="#FFCC00" />
              <rect width="3" height="0.666" y="1.333" fill="#CF142B" />
            </svg>
            <svg viewBox="0 0 3 2" width="22" role="img" aria-label="España">
              <rect width="3" height="2" fill="#AA151B" />
              <rect width="3" height="1" y="0.5" fill="#F1BF00" />
            </svg>
          </div>
          <div className="mt-5 flex items-center gap-3">
            <a
              href="https://www.instagram.com/aldara.bisuteria/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram de ALDARA"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 hover:border-[#d4af37] hover:text-[#d4af37]"
            >
              <Icon name="instagram" size={15} />
            </a>
          </div>
        </div>

        <nav aria-label={t.footer.discover} className="flex flex-col gap-2.5 text-sm">
          <p className="mb-1 text-xs font-bold uppercase tracking-widest text-[#d4af37]">{t.footer.discover}</p>
          {DISCOVER_LINKS.map((link, i) => (
            <Link key={link.label + i} href={link.href} className="text-white/75 hover:text-white">
              {link.label}
            </Link>
          ))}
        </nav>

        <nav aria-label={t.footer.shop} className="flex flex-col gap-2.5 text-sm">
          <p className="mb-1 text-xs font-bold uppercase tracking-widest text-[#d4af37]">{t.footer.shop}</p>
          {SHOP_LINKS.map((link, i) => (
            <Link key={link.label + i} href={link.href} className="text-white/75 hover:text-white">
              {link.label}
            </Link>
          ))}
        </nav>

        <nav aria-label={t.footer.help} className="flex flex-col gap-2.5 text-sm">
          <p className="mb-1 text-xs font-bold uppercase tracking-widest text-[#d4af37]">{t.footer.help}</p>
          {HELP_LINKS.map((link, i) => (
            <Link key={link.label + i} href={link.href} className="text-white/75 hover:text-white">
              {link.label}
            </Link>
          ))}
        </nav>

        <nav aria-label={t.footer.account} className="flex flex-col gap-2.5 text-sm">
          <p className="mb-1 text-xs font-bold uppercase tracking-widest text-[#d4af37]">{t.footer.account}</p>
          {ACCOUNT_LINKS.map((link, i) => (
            <Link key={link.label + i} href={link.href} className="text-white/75 hover:text-white">
              {link.label}
            </Link>
          ))}
        </nav>

        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-[#d4af37]">{t.footer.subscribe}</p>
          <p className="mb-2 text-xs text-white/60">{t.footer.subscribeText}</p>
          <NewsletterForm />
        </div>
      </div>

      <div className="border-t border-white/10 py-5">
        <div className="mx-auto flex max-w-7xl flex-col-reverse items-center justify-between gap-3 px-4 text-xs text-white/50 sm:flex-row sm:px-6">
          <p>
            © {new Date().getFullYear()} ALDARA. {t.footer.rights}
          </p>
          <nav aria-label="Legal" className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
            {LEGAL_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className="hover:text-white">
                {link.label}
              </Link>
            ))}
            <button type="button" onClick={openCookiePreferences} className="hover:text-white">
              {t.footerLinks.cookiePreferences}
            </button>
          </nav>
        </div>
      </div>
    </footer>
  );
}
