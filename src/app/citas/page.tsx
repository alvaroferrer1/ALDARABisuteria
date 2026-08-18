import type { Metadata } from "next";
import { AppointmentForm } from "@/components/AppointmentForm";
import { CitasHero } from "@/components/MiscChrome";

export const metadata: Metadata = {
  title: "Citas / Atelier",
  description: "Reserva una cita presencial en nuestro taller de Puerto Almenara o por videollamada para asesoramiento personalizado.",
};

/**
 * Citas / Atelier (Bloque 8, #87) — asesoramiento presencial (en nuestro
 * taller real de Puerto Almenara) o por videollamada. Sin calendario/reservas
 * automáticas conectado: la solicitud se confirma a mano por email, como el
 * resto de formularios del sitio — honestamente etiquetado, no se finge una
 * reserva instantánea que no existe.
 */
export default function CitasPage() {
  return (
    <>
      <section className="px-4 pb-8 pt-24 text-center sm:px-6">
        <CitasHero />
      </section>

      <section className="mx-auto max-w-lg px-4 pb-24 sm:px-6">
        <AppointmentForm />
      </section>
    </>
  );
}
