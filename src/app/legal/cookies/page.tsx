import type { Metadata } from "next";
import { LegalLayout } from "@/components/LegalLayout";

export const metadata: Metadata = { title: "Cookies", robots: { index: false, follow: true } };

export default function CookiesPage() {
  return (
    <LegalLayout title="Política de cookies" updated="agosto de 2026">
      <h2>Esta web no usa cookies de terceros ni de publicidad</h2>
      <p>
        ALDARA usa una única cookie técnica y necesaria: <strong>aldara_session</strong>, que identifica tu sesión al iniciar
        sesión en tu cuenta. No se usa para seguimiento ni publicidad, y no requiere consentimiento previo según la LSSI-CE al ser
        estrictamente necesaria para el servicio que solicitas (mantener la sesión iniciada).
      </p>
      <p>Además, tu cesta y tus favoritos se guardan en el almacenamiento local de tu navegador, no en una cookie.</p>
      <h2>¿Y si en el futuro añadimos analítica?</h2>
      <p>Actualizaríamos esta página y pediríamos tu consentimiento antes de activar cualquier cookie no esencial.</p>
    </LegalLayout>
  );
}
