import Link from "next/link";
import type { Metadata } from "next";
import { OrderTracker } from "@/components/OrderTracker";
import { Reveal } from "@/components/Reveal";
import { DemoPhoto } from "@/components/DemoPhoto";

export const metadata: Metadata = {
  title: "Aftercare",
  description: "Todo lo de después de comprar: seguimiento de pedido, cuidados, devoluciones, reparación y el pasaporte de tu pieza, en un solo sitio.",
};

// 5 hábitos, calcado del mockup (p.38 "CUIDA TUS PIEZAS ALDARA": Evita el
// agua/Aleja perfumes/Limpieza suave/Guárdalas bien/Evita el sol directo) —
// antes solo había 3, gap real detectado en comparación directa PDF↔LIVE.
const CARE_PREVIEW = [
  { title: "Antes de mojarla", text: "Quítatela antes de ducharte, bañarte en el mar o la piscina." },
  { title: "Perfume y cremas", text: "Aplícalos antes de ponerte la pieza, nunca después." },
  { title: "Limpieza suave", text: "Usa un paño suave y seco para limpiar tus piezas después de llevarlas." },
  { title: "Guárdala bien", text: "En su bolsita, separada de otras piezas, para que no se rayen." },
  { title: "Evita el sol directo", text: "La exposición prolongada al sol puede opacar el color de tus piezas." },
];

/**
 * AFTERCARE — convierte el post-compra en una experiencia unificada, no
 * piezas sueltas repartidas en legal/cuentas (p. ej. de "PROJECT_STATE.md":
 * "tracking+care+returns+repair+passport+second life como una experiencia").
 * El tracking de pedido es DEMO_SIMULATED (ver lib/orderTracking.ts) y se
 * declara así explícitamente en la UI — no se finge una integración real
 * con transportista.
 */
export default function AftercarePage() {
  return (
    <>
      {/* Hero con foto — el mockup (p.38) abre con una fotografía a sangre
          completa, antes esta página empezaba directamente en texto sobre
          fondo plano, gap real detectado en comparación directa PDF↔LIVE. */}
      <section className="relative flex min-h-72 items-end overflow-hidden px-4 pb-8 pt-24 text-center sm:min-h-96 sm:px-6">
        <DemoPhoto seed="aftercare-hero" tone="var(--terracotta)" />
        <div className="absolute inset-0 bg-linear-to-t from-ivory via-ivory/60 to-transparent" aria-hidden="true" />
        <div className="relative z-10 mx-auto">
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-terracotta">Aftercare</p>
          <h1 className="mx-auto max-w-2xl font-display text-4xl font-semibold sm:text-5xl">Todo lo de después de comprar</h1>
          <p className="mx-auto mt-4 max-w-lg text-ink-soft">
            Seguimiento de pedido, cuidados, devoluciones, reparación y el pasaporte de tu pieza — en un solo sitio.
          </p>
        </div>
      </section>

      <section className="border-y border-line bg-surface-2 px-4 py-14 sm:px-6">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-1 font-display text-xl font-semibold">Sigue tu pedido</h2>
          <p className="mb-6 text-sm text-ink-soft">Con el número de pedido y el email con el que compraste.</p>
          <OrderTracker />
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
        <Reveal className="mb-16 grid gap-8 lg:grid-cols-[1fr_1.2fr] lg:items-center">
          <div>
            <h2 className="mb-2 font-display text-2xl font-semibold">Cuidados</h2>
            <p className="mb-4 text-ink-soft">Cinco costumbres sencillas que alargan la vida de cualquier pieza bañada en oro.</p>
            <Link href="/cuidados" className="text-sm font-semibold text-terracotta hover:underline">
              Ver la guía completa →
            </Link>
          </div>
          <div className="flex flex-col gap-3">
            {CARE_PREVIEW.map((t) => (
              <div key={t.title} className="rounded-2xl border border-line p-4">
                <p className="font-semibold">{t.title}</p>
                <p className="mt-1 text-sm text-ink-soft">{t.text}</p>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delayMs={80} className="mb-16 grid gap-8 lg:grid-cols-2">
          <div className="rounded-2xl border border-line p-6">
            <h2 className="mb-2 font-display text-xl font-semibold">Devoluciones y cambios</h2>
            <p className="text-sm text-ink-soft">
              14 días naturales desde la recepción, salvo piezas personalizadas (iniciales, nombres o combinaciones a medida), que
              solo se aceptan por defecto de fabricación.
            </p>
            <Link href="/legal/envios-devoluciones" className="mt-3 inline-block text-sm font-semibold text-terracotta hover:underline">
              Ver condiciones completas →
            </Link>
            <Link href="/devoluciones" className="mt-1 block text-sm font-semibold text-terracotta hover:underline">
              Solicitar devolución →
            </Link>
          </div>
          <div className="rounded-2xl border border-line p-6">
            <h2 className="mb-2 font-display text-xl font-semibold">¿Se ha roto algo?</h2>
            <p className="text-sm text-ink-soft">
              Cierre, cadena, piedra suelta — antes de descartar una pieza, escríbenos. Muchas veces tiene arreglo y sale más a cuenta
              que comprar otra.
            </p>
            <Link href="/reparaciones" className="mt-3 inline-block text-sm font-semibold text-terracotta hover:underline">
              Pedir una reparación →
            </Link>
          </div>
        </Reveal>

        <Reveal delayMs={160} className="grid gap-8 lg:grid-cols-2">
          <div className="rounded-2xl bg-surface-2 p-6">
            <h2 className="mb-2 font-display text-xl font-semibold">El pasaporte de tu pieza</h2>
            <p className="text-sm text-ink-soft">
              Historia, materiales y cuidados de cada pieza que has comprado, con un código QR para compartirlo o volver a abrirlo desde
              el móvil.
            </p>
            <Link href="/account/jewelry-box" className="mt-3 inline-block text-sm font-semibold text-terracotta hover:underline">
              Ver mi joyero →
            </Link>
          </div>
          <div className="rounded-2xl bg-surface-2 p-6">
            <h2 className="mb-2 font-display text-xl font-semibold">Piezas hechas para durar</h2>
            <p className="text-sm text-ink-soft">
              Preferimos reparar antes que sustituir. Si cuidas una pieza bien, no hay motivo para que no la lleves puesta dentro de
              cinco años — y si algo falla, aquí seguimos.
            </p>
          </div>
        </Reveal>
      </div>
    </>
  );
}
