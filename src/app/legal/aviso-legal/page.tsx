import type { Metadata } from "next";
import { LegalLayout } from "@/components/LegalLayout";

export const metadata: Metadata = { title: "Aviso legal", robots: { index: false, follow: true } };

export default function AvisoLegalPage() {
  return (
    <LegalLayout
      title="Aviso legal"
      updated="agosto de 2026"
      note="Documento de ejemplo generado para la puesta en marcha de la web. Revísalo con un/a profesional antes de publicar la tienda (datos de autónomo/sociedad, NIF, registro)."
    >
      <h2>1. Datos identificativos</h2>
      <p>
        En cumplimiento del artículo 10 de la Ley 34/2002 (LSSI-CE), el titular de este sitio web es ALDARA, con domicilio a
        efectos de notificaciones en Paseo de Cuéllar 45, Puerto Almenara, España, y correo electrónico hola@aldara.store.
      </p>
      <h2>2. Objeto</h2>
      <p>Mostrar el catálogo de bisutería artesanal de ALDARA y gestionar pedidos de demostración a través de esta web.</p>
      <h2>3. Propiedad intelectual</h2>
      <p>Los textos, imágenes y marca «ALDARA» son titularidad de ALDARA, quedando prohibida su reproducción sin autorización.</p>
      <h2>4. Legislación aplicable</h2>
      <p>Estas condiciones se rigen por la legislación española.</p>
    </LegalLayout>
  );
}
