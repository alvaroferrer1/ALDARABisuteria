"use client";

import { useState } from "react";
import Link from "next/link";
import { TRACKING_STAGES } from "@/lib/orderTracking";
import { money } from "@/lib/storage";

interface TrackedOrder {
  id: string;
  createdAt: string;
  total: number;
  items: Array<{ name: string; quantity: number }>;
}

export function OrderTracker() {
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState("");
  const [order, setOrder] = useState<TrackedOrder | null>(null);
  const [stageIndex, setStageIndex] = useState(0);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setError("");
    setOrder(null);
    const form = new FormData(e.currentTarget);
    const id = String(form.get("orderId") || "").trim();
    const email = String(form.get("email") || "").trim();

    try {
      const res = await fetch(`/api/orders?id=${encodeURIComponent(id)}&email=${encodeURIComponent(email)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "No encontramos ese pedido.");
      setOrder(data.order);
      const { getSimulatedStageIndex } = await import("@/lib/orderTracking");
      setStageIndex(getSimulatedStageIndex(data.order.createdAt));
      setStatus("idle");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Error inesperado.");
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-ink-soft">Número de pedido</span>
          <input name="orderId" required placeholder="ID del pedido" className="rounded-lg border border-line bg-surface px-3.5 py-2.5" />
        </label>
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-ink-soft">Email del pedido</span>
          <input name="email" type="email" required className="rounded-lg border border-line bg-surface px-3.5 py-2.5" />
        </label>
        <button type="submit" disabled={status === "loading"} className="rounded-full bg-ink px-6 py-3 text-sm font-semibold text-ivory disabled:opacity-50">
          {status === "loading" ? "Buscando..." : "Buscar pedido"}
        </button>
      </form>
      {status === "error" && <p className="mt-3 text-sm font-semibold text-red-600">{error}</p>}

      {order && (
        <div className="mt-8 rounded-2xl border border-line p-6">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-2">
            <p className="font-semibold">Pedido #{order.id.slice(0, 8)}</p>
            <p className="text-sm text-ink-soft">{new Date(order.createdAt).toLocaleDateString("es-ES")}</p>
          </div>

          <div className="mb-6 flex items-center gap-1">
            {TRACKING_STAGES.map((stage, i) => (
              <div key={stage.key} className="flex flex-1 items-center gap-1 last:flex-none">
                <div className="flex flex-col items-center gap-1.5">
                  <span
                    className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                      i <= stageIndex ? "bg-terracotta text-ivory" : "bg-surface-2 text-ink-soft"
                    }`}
                  >
                    {i + 1}
                  </span>
                  <span className={`text-center text-[0.65rem] font-semibold uppercase tracking-wide ${i <= stageIndex ? "text-terracotta" : "text-ink-soft"}`}>
                    {stage.label}
                  </span>
                </div>
                {i < TRACKING_STAGES.length - 1 && (
                  <span className={`h-0.5 flex-1 ${i < stageIndex ? "bg-terracotta" : "bg-line"}`} />
                )}
              </div>
            ))}
          </div>
          <p className="mb-4 text-xs text-ink-soft">
            Estado simulado a partir de la fecha de tu pedido — todavía no tenemos integración con transportista en tiempo real.
          </p>

          <p className="text-sm text-ink-soft">{order.items.map((i) => `${i.quantity}x ${i.name}`).join(", ")}</p>
          <p className="mt-1 font-semibold">{money(order.total)}</p>
          <Link href="/account" className="mt-4 inline-block text-sm font-semibold text-terracotta hover:underline">
            Ver en mi cuenta →
          </Link>
        </div>
      )}
    </div>
  );
}
