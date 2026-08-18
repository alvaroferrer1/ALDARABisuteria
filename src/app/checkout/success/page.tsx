import Link from "next/link";
import { readJson } from "@/lib/localDb";
import { money } from "@/lib/storage";
import type { DemoOrder } from "@/lib/types";

const TRACKING_STAGES = ["Pedido confirmado", "En preparación", "En camino", "Entregado"];
const AFTERCARE_TIPS = [
  { title: "Evita el agua", sub: "Quítatela antes de ducharte o nadar" },
  { title: "Guárdala con cuidado", sub: "En su bolsita, lejos de otras piezas" },
  { title: "Hecha a mano", sub: "Pequeñas variaciones hacen tu pieza única" },
];

function formatDate(date: Date): string {
  return date.toLocaleDateString("es-ES", { day: "numeric", month: "short" });
}

export default async function CheckoutSuccessPage({ searchParams }: PageProps<"/checkout/success">) {
  const params = await searchParams;
  const id = typeof params.id === "string" ? params.id : "";
  const orders = await readJson<DemoOrder[]>("orders.json", []);
  const order = orders.find((o) => o.id === id);

  if (!order) {
    return (
      <section className="mx-auto max-w-lg px-4 py-24 text-center sm:px-6">
        <h1 className="font-display text-2xl font-semibold">No encontramos ese pedido</h1>
        <Link href="/shop" className="mt-5 inline-block rounded-full bg-ink px-6 py-3 font-semibold text-ivory">
          Volver al catálogo
        </Link>
      </section>
    );
  }

  const createdAt = new Date(order.createdAt);
  const estimatedShip = new Date(createdAt.getTime() + 2 * 24 * 60 * 60 * 1000);
  const estimatedDelivery = new Date(createdAt.getTime() + 5 * 24 * 60 * 60 * 1000);

  return (
    <section className="mx-auto max-w-2xl px-4 py-24 text-center sm:px-6">
      <span className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gold-light text-2xl">✓</span>
      <h1 className="font-display text-3xl font-semibold">Tu historia está en camino</h1>
      <p className="mt-3 text-ink-soft">
        Gracias, {order.address.fullName.split(" ")[0]}. Tu pedido <strong>#{order.id.slice(0, 8)}</strong> ha quedado registrado. Te
        escribiremos a {order.email} para confirmar el pago y el envío — pedido de demostración, sin pasarela de pago real conectada
        todavía.
      </p>

      {/* Seguimiento del pedido — calcado del panel 4 del mockup "Flujo de
          compra" (p.31): 4 etapas con fechas estimadas. Como el pedido
          acaba de confirmarse, solo la primera etapa está activa (no se
          simula que ya está "en camino" sin que sea cierto). */}
      <div className="mt-8 rounded-2xl border border-line p-6 text-left">
        <p className="mb-5 text-sm font-semibold">Seguimiento de tu pedido</p>
        <div className="flex items-start justify-between">
          {TRACKING_STAGES.map((stage, i) => (
            <div key={stage} className="flex flex-1 flex-col items-center text-center">
              <span className={`flex h-3 w-3 rounded-full ${i === 0 ? "bg-terracotta" : "bg-surface-2"}`} />
              {i < TRACKING_STAGES.length - 1 && <span className="mt-1.5 h-px w-full bg-line" />}
              <p className={`mt-2 text-xs font-semibold ${i === 0 ? "text-ink" : "text-ink-soft"}`}>{stage}</p>
              {i === 0 && <p className="text-[0.65rem] text-ink-soft">{formatDate(createdAt)}</p>}
              {i === 2 && <p className="text-[0.65rem] text-ink-soft">Est. {formatDate(estimatedShip)}</p>}
              {i === 3 && <p className="text-[0.65rem] text-ink-soft">Est. {formatDate(estimatedDelivery)}</p>}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 rounded-2xl bg-surface-2 p-6 text-left">
        <ul className="flex flex-col gap-2 text-sm">
          {order.items.map((item) => (
            <li key={item.productId} className="flex justify-between">
              <span>
                {item.quantity}x {item.name}
              </span>
              <span>{money(item.price * item.quantity)}</span>
            </li>
          ))}
        </ul>
        {order.giftWrap ? (
          <div className="mt-4 flex justify-between border-t border-line pt-4 text-sm">
            <span>Envoltorio de regalo</span>
            <span>Incluido</span>
          </div>
        ) : null}
        {order.giftCardApplied ? (
          <div className="mt-4 flex justify-between border-t border-line pt-4 text-sm text-terracotta">
            <span>Tarjeta regalo aplicada ({order.giftCardCode})</span>
            <span>−{money(order.giftCardApplied)}</span>
          </div>
        ) : null}
        <div className={`flex justify-between pt-4 text-lg ${order.giftCardApplied || order.giftWrap ? "mt-2" : "mt-4 border-t border-line"}`}>
          <span>Total</span>
          <strong>{money(order.total)}</strong>
        </div>
      </div>

      {order.giftMessage ? (
        <div className="mt-6 rounded-2xl border border-line px-6 py-5 text-left">
          <p className="mb-1 text-xs font-bold uppercase tracking-widest text-terracotta">Tu dedicatoria</p>
          <p className="italic text-ink-soft">&ldquo;{order.giftMessage}&rdquo;</p>
        </div>
      ) : null}
      {order.personalizationNote ? (
        <div className="mt-6 rounded-2xl border border-line px-6 py-5 text-left">
          <p className="mb-1 text-xs font-bold uppercase tracking-widest text-terracotta">Tu personalización</p>
          <p className="text-ink-soft">{order.personalizationNote}</p>
        </div>
      ) : null}

      <div className="mt-8 border-t border-line pt-8 text-left">
        <p className="mb-4 text-center text-sm font-semibold">Cuidamos tu joya, siempre</p>
        <div className="grid gap-4 sm:grid-cols-3">
          {AFTERCARE_TIPS.map((tip) => (
            <div key={tip.title} className="text-center">
              <p className="text-sm font-semibold">{tip.title}</p>
              <p className="mt-1 text-xs text-ink-soft">{tip.sub}</p>
            </div>
          ))}
        </div>
        <p className="mt-3 text-center text-xs text-ink-soft">
          Guía completa en <Link href="/cuidados" className="font-semibold text-terracotta underline">Cuidados</Link>.
        </p>
      </div>

      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <Link href="/shop" className="inline-block rounded-full bg-ink px-6 py-3.5 font-semibold text-ivory">
          Seguir explorando
        </Link>
        <Link href="/help" className="inline-block rounded-full border border-line px-6 py-3.5 font-semibold">
          ¿Necesitas ayuda? →
        </Link>
      </div>
    </section>
  );
}
