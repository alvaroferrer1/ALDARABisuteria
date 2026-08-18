import { cookies } from "next/headers";
import Link from "next/link";
import type { Metadata } from "next";
import { readSessionCookieValue, SESSION_COOKIE_NAME } from "@/lib/auth";
import { readJson } from "@/lib/localDb";
import { ReturnForm } from "@/components/ReturnForm";
import { RETURN_STAGES, getSimulatedReturnStageIndex } from "@/lib/returnTracking";
import type { DemoOrder } from "@/lib/types";
import type { ReturnRequest } from "@/app/api/returns/route";
import { PhotoSlot } from "@/components/PhotoSlot";

export const metadata: Metadata = {
  title: "Devoluciones",
  description: "Solicita la devolución de una pieza ALDARA y consulta el estado de tu solicitud.",
  robots: { index: false, follow: true },
};

/**
 * Formulario real de devolución (POST_AUDIT_IMPROVEMENTS.md, bloque Z):
 * `/legal/envios-devoluciones` solo decía "contáctanos con fotos" — ahora
 * enlaza aquí. Requiere sesión porque una devolución siempre se ata a un
 * pedido real y verificable del usuario (mismo criterio de seguridad que
 * `/account/pedidos/[id]`), a diferencia de Reparaciones que no necesita
 * conocer un pedido concreto.
 */
export default async function DevolucionesPage() {
  const cookieStore = await cookies();
  const user = readSessionCookieValue(cookieStore.get(SESSION_COOKIE_NAME)?.value);

  if (!user) {
    return (
      <section className="mx-auto max-w-xl px-4 py-20 text-center sm:px-6">
        <p className="mb-2 text-xs font-bold uppercase tracking-widest text-terracotta">Devoluciones</p>
        <h1 className="mb-4 font-display text-3xl font-semibold">Inicia sesión para solicitar una devolución</h1>
        <p className="mb-8 text-ink-soft">Necesitamos identificar tu pedido real para gestionar la devolución — nunca aceptamos solicitudes sobre pedidos de otra persona.</p>
        <Link href="/account" className="rounded-full bg-ink px-6 py-3 text-sm font-semibold text-ivory">
          Iniciar sesión
        </Link>
      </section>
    );
  }

  const [allOrders, allReturns] = await Promise.all([readJson<DemoOrder[]>("orders.json", []), readJson<ReturnRequest[]>("return-requests.json", [])]);
  const myOrders = allOrders.filter((o) => o.email.toLowerCase() === user.email.toLowerCase()).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  const myReturns = allReturns
    .filter((r) => r.email.toLowerCase() === user.email.toLowerCase())
    .sort((a, b) => new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime());

  return (
    <section className="mx-auto max-w-xl px-4 py-20 sm:px-6">
      <div className="relative mb-8 aspect-4/3 overflow-hidden rounded-3xl">
        <PhotoSlot name="devoluciones-hero" alt="" fallback={<div className="absolute inset-0 bg-surface-2" />} />
      </div>
      <p className="mb-2 text-xs font-bold uppercase tracking-widest text-terracotta">Devoluciones</p>
      <h1 className="mb-2 font-display text-3xl font-semibold">Solicita una devolución</h1>
      <p className="mb-8 text-ink-soft">Tienes 14 días naturales desde la recepción, salvo piezas personalizadas (solo por defecto de fabricación).</p>

      <ReturnForm orders={myOrders} />

      {myReturns.length > 0 && (
        <div className="mt-14">
          <h2 className="mb-4 font-semibold">Tus solicitudes anteriores</h2>
          <ul className="flex flex-col gap-5">
            {myReturns.map((r) => {
              const stageIndex = getSimulatedReturnStageIndex(r.requestedAt);
              return (
                <li key={r.id} className="rounded-2xl border border-line p-6">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <p className="font-semibold">{r.productName ?? `Pedido #${r.orderId.slice(0, 8)}`}</p>
                    <p className="text-xs text-ink-soft">Ref. {r.id}</p>
                  </div>
                  <p className="mt-1 text-sm text-ink-soft">{r.reason}</p>
                  <ol className="mt-4 flex flex-wrap gap-2 text-xs">
                    {RETURN_STAGES.map((stage, i) => (
                      <li key={stage.key} className={`rounded-full px-3 py-1.5 ${i <= stageIndex ? "bg-ink text-ivory" : "bg-surface-2 text-ink-soft"}`}>
                        {stage.label}
                      </li>
                    ))}
                  </ol>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </section>
  );
}
