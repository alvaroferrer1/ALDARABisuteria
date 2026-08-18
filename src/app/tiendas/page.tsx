import type { Metadata } from "next";
import { STOCKISTS } from "@/lib/stockists";
import { TiendasContent } from "@/components/TiendasContent";
import { WHATSAPP_DISPLAY, CONTACT_EMAIL } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Tiendas",
  description: "Dónde encontrar ALDARA — Puerto Almenara y futuros puntos de venta.",
};

// Tiendas / Stockists (Bloque 8, #88) — Puerto Almenara es real; el resto son
// marcadores DEMO explícitos ("Próxima ubicación"), no direcciones inventadas.
//
// LocalBusiness JSON-LD (POST_AUDIT_IMPROVEMENTS.md, bloque GG): SEO local
// real para el único taller/punto de venta verificado (Puerto Almenara) — mismos
// datos ya reales que se muestran en /contacto (dirección, horario,
// teléfono), nunca inventados. No se añade a los marcadores "próxima
// ubicación (demo)" porque no existen todavía como negocio real.
function buildLocalBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "JewelryStore",
    name: "ALDARA — Taller Puerto Almenara",
    image: "https://www.aldara.store/og-image.png",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Paseo de Cuéllar 45",
      addressLocality: "Puerto Almenara",
      addressCountry: "ES",
    },
    telephone: `+${WHATSAPP_DISPLAY.replace(/[^\d]/g, "")}`,
    email: CONTACT_EMAIL,
    openingHours: "Mo-Sa 10:00-20:30",
    url: "https://www.aldara.store/tiendas",
    description: "Taller y venta de bisutería artesanal ALDARA en Puerto Almenara, inspirada en Venezuela y Colombia.",
    priceRange: "€€",
  };
}

export default function TiendasPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(buildLocalBusinessJsonLd()) }} />
      <TiendasContent stockists={STOCKISTS} />
    </>
  );
}
