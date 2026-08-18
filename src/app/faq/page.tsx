import type { Metadata } from "next";
import { FaqList, type FaqGroup } from "@/components/FaqList";
import { FaqHero, FaqContactCta } from "@/components/FaqChrome";

export const metadata: Metadata = {
  title: "Preguntas frecuentes",
  description: "Resuelve tus dudas sobre pedidos, pagos, envíos, materiales, personalización y cuidados de la bisutería artesanal ALDARA.",
};

const GROUPS: FaqGroup[] = [
  {
    title: "Pedidos y pagos",
    items: [
      {
        q: "¿Cómo pago mi pedido?",
        a: "Este pedido es de demostración: no hay pasarela de pago real conectada. Al confirmar, coordinamos el pago (transferencia o Bizum) contigo por WhatsApp o email.",
      },
      { q: "¿Puedo cancelar o modificar mi pedido?", a: "Sí, mientras no lo hayamos enviado. Escríbenos indicando tu número de pedido y lo ajustamos sin problema." },
      { q: "¿Hacéis facturas?", a: "Sí, si la necesitas para tu empresa o autónomo, indícanoslo al confirmar el pedido." },
    ],
  },
  {
    title: "Envíos",
    items: [
      { q: "¿Hacéis envíos fuera de Puerto Almenara?", a: "Sí, enviamos a toda España peninsular (2-4 días laborables) y consultamos Baleares, Canarias y el resto de Europa." },
      { q: "¿Puedo recoger en persona?", a: "Sí, si eres de Puerto Almenara puedes recoger sin coste de envío, previa cita por WhatsApp." },
      { q: "¿Qué pasa si mi pedido llega dañado?", a: "Escríbenos con fotos en las primeras 48 horas y lo sustituimos o reembolsamos sin coste para ti." },
    ],
  },
  {
    title: "Producto y materiales",
    items: [
      { q: "¿De qué están hechas las piezas?", a: "Baño de oro 18k sobre acero quirúrgico y latón, piedras naturales, perlas cultivadas y cristal checo." },
      { q: "¿Las piezas llevan níquel?", a: "No trabajamos con níquel. Si tienes alergias severas, consúltanos el material exacto antes de comprar." },
      { q: "¿Cómo cuido mi bisutería ALDARA?", a: "Evita perfume, agua salada y cloro directo, y guárdala en su bolsita para que no roce con otras piezas." },
    ],
  },
  {
    title: "Personalización",
    items: [
      { q: "¿Puedo personalizar una pieza?", a: "Claro. Iniciales, nombres, banderas o combinaciones a medida: escríbenos con tu idea y te confirmamos plazo y precio." },
      { q: "¿Cuánto tarda un pedido personalizado?", a: "Entre 3 y 7 días laborables según la complejidad, siempre confirmado contigo antes de empezar." },
    ],
  },
];

// JSON-LD FAQPage generado a partir de las mismas preguntas/respuestas ya
// visibles en la página (GROUPS, arriba) — no se inventa contenido nuevo
// para el schema. Metadata invisible, no cambia nada del diseño ni de la
// interacción. Nota honesta (P2, no P1): añadir este marcado no garantiza
// que Google muestre rich results/acordeones en el buscador — esa decisión
// depende por completo de Google, no de si el sitio tiene el schema.
function buildFaqJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: GROUPS.flatMap((g) =>
      g.items.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: { "@type": "Answer", text: item.a },
      }))
    ),
  };
}

export default function FaqPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(buildFaqJsonLd()) }} />
      <FaqHero />

      <section className="mx-auto max-w-3xl px-4 pb-16 sm:px-6">
        <FaqList groups={GROUPS} />
      </section>

      <FaqContactCta />
    </>
  );
}
