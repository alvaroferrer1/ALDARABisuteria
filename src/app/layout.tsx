import type { Metadata } from "next";
import { Cormorant_Garamond, Montserrat } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { PhotoManifestProvider } from "@/context/PhotoManifestContext";
import { getAvailablePhotos } from "@/lib/photoManifest";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/CartDrawer";
import { ChatWidget } from "@/components/ChatWidget";
import { CompareBar } from "@/components/CompareBar";
import { SearchOverlay } from "@/components/SearchOverlay";
import { ServiceWorkerRegister } from "@/components/ServiceWorkerRegister";
import { PageTransition } from "@/components/PageTransition";
import { CookieConsentBanner } from "@/components/CookieConsentBanner";

// Cormorant Garamond (titulares) + Montserrat (cuerpo/UI) — tipografía exacta
// de ALDARA_Propuesta_Cliente_FINAL_v2.pdf, Bloque 04 "Tipografía y jerarquía
// editorial". SemiBold/Medium para display, Regular/Medium para cuerpo.
const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.aldara.store"),
  title: {
    default: "ALDARA — Bisutería artesanal que une culturas | Puerto Almenara",
    template: "%s | ALDARA",
  },
  description:
    "Bisutería artesanal hecha a mano en Puerto Almenara que fusiona la tradición de Venezuela y Colombia. Pendientes, pulseras, colgantes y charms con identidad latina.",
  openGraph: {
    type: "website",
    locale: "es_ES",
    siteName: "ALDARA",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

// El tema se guarda serializado en JSON (igual que el resto del store
// compartido en lib/store.ts), por eso aquí se hace JSON.parse en vez
// de comparar el string crudo — si no, el tema oscuro no sobrevive a
// un refresco de página.
const THEME_INIT_SCRIPT = `(function(){try{var raw=localStorage.getItem('aldara_theme');var s=raw?JSON.parse(raw):null;if(s==='dark'||(!s&&matchMedia('(prefers-color-scheme: dark)').matches))document.documentElement.setAttribute('data-theme','dark');}catch(e){}})();`;

// JSON-LD Organization global — antes solo existía el schema Product en PDP,
// ninguna página declaraba quién es ALDARA como entidad (nombre, logo, redes
// reales, dirección). Es el schema de mayor impacto SEO por menor esfuerzo:
// cubre a la vez el conocimiento de marca en buscadores y el sameAs con
// Instagram real.
const ORGANIZATION_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "ALDARA",
  url: "https://www.aldara.store",
  logo: "https://www.aldara.store/apple-touch-icon.png",
  description: "Bisutería artesanal hecha a mano en Puerto Almenara que fusiona la tradición de Venezuela y Colombia.",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Calle del Almendro 12",
    addressLocality: "Puerto Almenara",
    addressCountry: "ES",
  },
  sameAs: ["https://www.instagram.com/aldara.bisuteria"],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${cormorant.variable} ${montserrat.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ORGANIZATION_JSON_LD) }} />
      </head>
      <body className="flex min-h-screen flex-col antialiased">
        <a href="#main" className="skip-link">
          Saltar al contenido
        </a>
        <PhotoManifestProvider available={getAvailablePhotos()}>
          <CartProvider>
            <WishlistProvider>
              {/* print:hidden en todo el chrome global — necesario para el
                  recibo/factura imprimible de "Mi pedido" (ver
                  /account/pedidos/[id]): al usar la función nativa
                  "Imprimir → Guardar como PDF" del navegador, sin esto se
                  imprimiría también el header/footer/chat/carrito. */}
              <div className="print:hidden">
                <Header />
              </div>
              <main id="main" className="flex-1">
                <PageTransition>{children}</PageTransition>
              </main>
              <div className="print:hidden">
                <Footer />
                <CartDrawer />
                <ChatWidget />
                <CompareBar />
                <SearchOverlay />
                <CookieConsentBanner />
              </div>
            </WishlistProvider>
          </CartProvider>
        </PhotoManifestProvider>
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
