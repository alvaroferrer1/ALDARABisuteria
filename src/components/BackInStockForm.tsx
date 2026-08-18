"use client";

import { useState } from "react";

/**
 * Formulario real "avísame cuando vuelva" — guarda de verdad en
 * back-in-stock-requests.json (vía /api/back-in-stock). No hay envío de
 * email real conectado todavía (sin proveedor de correo transaccional);
 * eso se documenta honestamente, el guardado y la gestión sí son reales.
 */
export function BackInStockForm({ productId, productName }: { productId: string; productName: string }) {
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formEl = e.currentTarget;
    setStatus("loading");
    const email = new FormData(formEl).get("email");
    try {
      const res = await fetch("/api/back-in-stock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "No se pudo guardar el aviso.");
      setStatus("ok");
      setMessage(`Te avisaremos por email en cuanto ${productName} vuelva a estar disponible.`);
      formEl.reset();
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Error inesperado.");
    }
  }

  if (status === "ok") {
    return (
      <div id="avisame" className="rounded-2xl bg-surface-2 p-4 text-sm">
        <p className="font-semibold text-terracotta">¡Listo!</p>
        <p className="mt-1 text-ink-soft">{message}</p>
      </div>
    );
  }

  return (
    <form id="avisame" onSubmit={handleSubmit} className="rounded-2xl border border-line p-4">
      <p className="mb-3 text-sm font-semibold">Avísame cuando vuelva</p>
      <div className="flex gap-2">
        <label htmlFor="back-in-stock-email" className="sr-only">
          Tu email
        </label>
        <input
          id="back-in-stock-email"
          name="email"
          type="email"
          required
          placeholder="Tu email"
          className="min-w-0 flex-1 rounded-full border border-line bg-surface px-3.5 py-2.5 text-sm"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="shrink-0 rounded-full bg-ink px-4 py-2.5 text-sm font-semibold text-ivory disabled:opacity-50"
        >
          {status === "loading" ? "..." : "Avisarme"}
        </button>
      </div>
      {status === "error" && <p className="mt-2 text-xs font-semibold text-red-600">{message}</p>}
    </form>
  );
}
