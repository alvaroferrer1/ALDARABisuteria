import type { Metadata } from "next";
import Link from "next/link";
import { LegalLayout } from "@/components/LegalLayout";

export const metadata: Metadata = { title: "Envíos y devoluciones", robots: { index: false, follow: true } };

export default function EnviosDevolucionesPage() {
  return (
    <LegalLayout title="Envíos y devoluciones" updated="agosto de 2026" note="Condiciones de ejemplo: ajusta plazos y tarifas reales antes de publicar.">
      <h2>Envíos</h2>
      <ul>
        <li>Península: 2-4 días laborables.</li>
        <li>Baleares, Canarias, Ceuta y Melilla: consultar plazo y coste.</li>
        <li>Puerto Almenara capital: recogida en Paseo de Cuéllar 45 sin coste de envío.</li>
      </ul>
      <h2>Devoluciones y cambios</h2>
      <p>
        14 días naturales desde la recepción, salvo piezas personalizadas (iniciales, nombres o combinaciones a medida), que no
        admiten devolución salvo defecto de fabricación.
      </p>
      {/* Antes solo decía "contáctanos con fotos" sin ningún formulario ni
          estado propio — mismo gap que tenía Reparaciones antes de
          construirse. Ahora hay un flujo real y con seguimiento. */}
      <p>
        <Link href="/devoluciones" className="font-semibold text-terracotta underline">
          Solicita tu devolución aquí →
        </Link>{" "}
        para hacer el seguimiento real de tu solicitud, atada a tu pedido.
      </p>
      <h2>Piezas con defecto</h2>
      <p>Contáctanos con fotos en las primeras 48 horas y la sustituimos o reembolsamos sin coste para ti.</p>
    </LegalLayout>
  );
}
