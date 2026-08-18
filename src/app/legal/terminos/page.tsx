import type { Metadata } from "next";
import { LegalLayout } from "@/components/LegalLayout";
import { CONTACT_EMAIL } from "@/lib/whatsapp";

export const metadata: Metadata = { title: "Términos y condiciones", robots: { index: false, follow: true } };

export default function TerminosPage() {
  return (
    <LegalLayout title="Términos y condiciones" updated="agosto de 2026" note="Condiciones de ejemplo: revisar con asesoría legal antes de publicar.">
      <h2>Quiénes somos</h2>
      <p>ALDARA es bisutería artesanal hecha a mano en Puerto Almenara, España. Puedes contactarnos en {CONTACT_EMAIL}.</p>

      <h2>Uso del sitio</h2>
      <p>
        Este sitio y su catálogo son de uso personal y no comercial. No está permitido copiar el contenido, las
        fotografías ni los textos sin autorización.
      </p>

      <h2>Pedidos</h2>
      <p>
        Este es un entorno de demostración: los pedidos no se procesan con una pasarela de pago real todavía. Ver{" "}
        <a href="/legal/envios-devoluciones">envíos y devoluciones</a> para las condiciones de compra reales cuando
        estén activas.
      </p>

      <h2>Propiedad intelectual</h2>
      <p>Los diseños, el nombre ALDARA y el logotipo son propiedad de ALDARA. Todos los derechos reservados.</p>

      <h2>Cuentas de usuario</h2>
      <p>
        Eres responsable de mantener la confidencialidad de tu contraseña. Puedes cambiarla en cualquier momento desde{" "}
        <a href="/account/seguridad">tu cuenta</a>.
      </p>

      <h2>Modificaciones</h2>
      <p>Podemos actualizar estos términos. La fecha de la última actualización aparece arriba.</p>

      <h2>Contacto</h2>
      <p>
        Cualquier duda sobre estos términos, escríbenos a través del <a href="/contacto">formulario de contacto</a>.
      </p>
    </LegalLayout>
  );
}
