"use client";

import { useState } from "react";
import { RETURN_STAGES, getSimulatedReturnStageIndex } from "@/lib/returnTracking";
import type { DemoOrder } from "@/lib/types";

const REASONS = ["No es lo que esperaba", "Talla o tamaño incorrecto", "Llegó dañada", "Cambié de opinión", "Otro"] as const;

export function ReturnForm({ orders }: { orders: DemoOrder[] }) {
  const [orderId, setOrderId] = useState(orders[0]?.id ?? "");
  const selectedOrder = orders.find((o) => o.id === orderId);
  const [productId, setProductId] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [error, setError] = useState("");
  const [result, setResult] = useState<{ id: string; requestedAt: string } | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setError("");
    const form = e.currentTarget;
    const data = new FormData(form);
    try {
      const res = await fetch("/api/returns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          productId: productId || undefined,
          reason: data.get("reason"),
          description: data.get("description"),
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "No se pudo enviar la solicitud.");
      setResult({ id: json.id, requestedAt: new Date().toISOString() });
      setStatus("ok");
      form.reset();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Ha ocurrido un error.");
    }
  }

  if (orders.length === 0) {
    return (
      <div className="rounded-2xl border border-line p-8 text-center">
        <p className="text-ink-soft">No encontramos pedidos en tu cuenta para solicitar una devolución.</p>
      </div>
    );
  }

  if (status === "ok" && result) {
    const stageIndex = getSimulatedReturnStageIndex(result.requestedAt);
    return (
      <div className="rounded-2xl border border-line p-8">
        <p className="font-semibold">Solicitud enviada ✓ Referencia {result.id}</p>
        <p className="mt-2 text-sm text-ink-soft">
          Te escribiremos por email para confirmar los siguientes pasos. Estado simulado de demostración (calculado a partir de la fecha de
          solicitud, sin conexión real con logística todavía):
        </p>
        <ol className="mt-4 flex flex-wrap gap-3 text-sm">
          {RETURN_STAGES.map((stage, i) => (
            <li key={stage.key} className={`rounded-full px-3 py-1.5 ${i <= stageIndex ? "bg-ink text-ivory" : "bg-surface-2 text-ink-soft"}`}>
              {stage.label}
            </li>
          ))}
        </ol>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <label className="flex flex-col gap-1.5 text-sm">
        <span className="font-medium text-ink-soft">Pedido</span>
        <select
          value={orderId}
          onChange={(e) => {
            setOrderId(e.target.value);
            setProductId("");
          }}
          className="rounded-lg border border-line bg-surface px-3.5 py-2.5"
        >
          {orders.map((o) => (
            <option key={o.id} value={o.id}>
              #{o.id.slice(0, 8)} — {new Date(o.createdAt).toLocaleDateString("es-ES")}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1.5 text-sm">
        <span className="font-medium text-ink-soft">Pieza (opcional, deja en blanco si es todo el pedido)</span>
        <select value={productId} onChange={(e) => setProductId(e.target.value)} className="rounded-lg border border-line bg-surface px-3.5 py-2.5">
          <option value="">Todo el pedido</option>
          {selectedOrder?.items.map((item) => (
            <option key={item.productId} value={item.productId}>
              {item.name}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1.5 text-sm">
        <span className="font-medium text-ink-soft">Motivo</span>
        <select name="reason" required defaultValue="" className="rounded-lg border border-line bg-surface px-3.5 py-2.5">
          <option value="" disabled>
            Elige un motivo
          </option>
          {REASONS.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1.5 text-sm">
        <span className="font-medium text-ink-soft">Cuéntanos más</span>
        <textarea name="description" required rows={3} maxLength={500} className="resize-none rounded-lg border border-line bg-surface px-3.5 py-2.5" />
      </label>

      {status === "error" && <p className="text-sm font-semibold text-red-600">{error}</p>}
      <button type="submit" disabled={status === "loading"} className="rounded-full bg-ink px-6 py-3.5 font-semibold text-ivory disabled:opacity-50">
        {status === "loading" ? "Enviando..." : "Solicitar devolución"}
      </button>
    </form>
  );
}
