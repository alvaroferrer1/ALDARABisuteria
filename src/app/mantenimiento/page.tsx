import type { Metadata } from "next";
import { MaintenanceNotifyForm } from "@/components/MaintenanceNotifyForm";
import { MantenimientoContent, MantenimientoNote } from "@/components/MiscChrome";

export const metadata: Metadata = { title: "Mantenimiento", robots: { index: false, follow: false } };

/**
 * Estado "Mantenimiento" — calcado del panel "02 · Mantenimiento" del
 * mockup (p.44): fondo oscuro, "Volveremos pronto", aviso por email.
 * ALDARA no está realmente en mantenimiento — esta es una plantilla de
 * sistema honestamente etiquetada como demo (nunca activada en producción),
 * construida para cerrar el gap real detectado en la auditoría visual
 * (ref. 7.4): de los 4 sub-estados del mockup, antes solo existía el 404.
 */
export default function MantenimientoPage() {
  return (
    <section className="flex min-h-screen flex-col items-center justify-center bg-[#140c08] px-4 py-24 text-center">
      <MantenimientoContent />
      <MaintenanceNotifyForm />
      <MantenimientoNote />
    </section>
  );
}
