import type { Metadata } from "next";
import { LegalLayout } from "@/components/LegalLayout";

export const metadata: Metadata = { title: "Privacidad", robots: { index: false, follow: true } };

export default function PrivacidadPage() {
  return (
    <LegalLayout
      title="Política de privacidad"
      updated="agosto de 2026"
      note="Documento de ejemplo. Esta demo guarda cuentas, pedidos y mensajes en archivos JSON locales del servidor de desarrollo, no en un proveedor cloud. Antes de producción, sustituir por una base de datos real y revisar el texto con un/a asesor/a en protección de datos."
    >
      <h2>1. Responsable del tratamiento</h2>
      <p>ALDARA, contacto en hola@aldara.store.</p>
      <h2>2. Qué datos tratamos</h2>
      <ul>
        <li>Cuenta: nombre, email y contraseña (con hash, nunca en texto plano).</li>
        <li>Pedidos de demostración: dirección de envío, teléfono y contenido de la cesta.</li>
        <li>Mensajes de contacto y suscripciones a la newsletter.</li>
      </ul>
      <h2>3. Finalidad</h2>
      <p>Gestionar tu cuenta, tus pedidos de demostración y responder tus consultas.</p>
      <h2>4. Tus derechos</h2>
      <p>Acceso, rectificación, supresión y portabilidad escribiendo a hola@aldara.store.</p>
    </LegalLayout>
  );
}
