import type { Metadata } from "next";
import { getUpcomingEvents, getPastEvents } from "@/lib/events";
import { EventosContent } from "@/components/EventosContent";

export const metadata: Metadata = {
  title: "Eventos",
  description: "Talleres, pop-ups y encuentros de ALDARA — calendario de ejemplo mientras confirmamos las fechas reales.",
};

/**
 * Eventos (Bloque 8, #86) — construida con DATOS DEMO explícitos
 * (`lib/events.ts`), ya que no hay un calendario real conectado todavía.
 * Nunca se presenta como agenda confirmada: cada tarjeta lleva una
 * etiqueta "Demo" visible.
 */
export default function EventosPage() {
  const upcoming = getUpcomingEvents();
  const past = getPastEvents();
  return <EventosContent upcoming={upcoming} past={past} />;
}
