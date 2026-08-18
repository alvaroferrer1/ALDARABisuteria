import type { Metadata } from "next";
import Link from "next/link";
import { RepairForm } from "@/components/RepairForm";
import { ReparacionesHero } from "@/components/MiscChrome";

export const metadata: Metadata = {
  title: "Reparaciones y Second Life",
  description: "Solicita la reparación de una pieza ALDARA o dale una segunda vida.",
};

/**
 * Master #55 "Reparaciones / Second Life" y #94 "Repair status". Antes
 * el único punto de contacto era "Pedir una reparación" → /contacto, sin
 * formulario ni estado propios — gap real, cerrado aquí con un flujo real
 * (guarda en data/repair-requests.json) y un estado simulado honesto
 * (lib/repairTracking.ts, mismo patrón que el tracking de pedidos).
 */
export default function ReparacionesPage() {
  return (
    <section className="mx-auto max-w-xl px-4 py-20 sm:px-6">
      <ReparacionesHero />
      <div className="mt-10">
        <RepairForm />
      </div>
      {/* Mejora real: el estado ya no solo se ve justo tras enviar el
          formulario en esta misma sesión de navegador — queda accesible
          después desde la cuenta (ver /account/reparaciones). */}
      <p className="mt-6 text-center text-sm text-ink-soft">
        ¿Ya enviaste una solicitud?{" "}
        <Link href="/account/reparaciones" className="font-semibold text-terracotta underline">
          Consulta el estado en tu cuenta
        </Link>
      </p>
    </section>
  );
}
