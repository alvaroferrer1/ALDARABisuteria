"use client";

import { useState } from "react";
import { money } from "@/lib/storage";

/**
 * Consultar saldo de una tarjeta regalo ya comprada — antes esta consulta
 * (GET /api/gift-cards?code=X) solo se usaba dentro del checkout al aplicar
 * un código; no existía ningún sitio donde alguien pudiera comprobar cuánto
 * saldo le queda sin tener que pasar por una compra. Gap real.
 */
export function GiftCardBalanceCheck() {
  const [code, setCode] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [result, setResult] = useState<{ balance: number; amount: number } | null>(null);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!code.trim()) return;
    setStatus("loading");
    setError("");
    setResult(null);
    try {
      const res = await fetch(`/api/gift-cards?code=${encodeURIComponent(code.trim())}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "No encontramos esa tarjeta.");
      setResult({ balance: data.card.balance, amount: data.card.amount });
      setStatus("ok");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Error inesperado.");
    }
  }

  return (
    <div className="rounded-2xl border border-line p-6">
      <p className="mb-1 font-semibold">¿Ya tienes una tarjeta?</p>
      <p className="mb-4 text-sm text-ink-soft">Consulta su saldo actual con el código.</p>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="ALDR-XXXX-XXXX"
          maxLength={20}
          className="min-w-0 flex-1 rounded-lg border border-line bg-surface px-3.5 py-2.5 text-sm uppercase"
        />
        <button type="submit" disabled={status === "loading"} className="shrink-0 rounded-lg border border-line px-4 py-2.5 text-sm font-semibold hover:border-ink disabled:opacity-50">
          {status === "loading" ? "..." : "Consultar"}
        </button>
      </form>
      {status === "error" && <p className="mt-3 text-sm font-semibold text-red-600">{error}</p>}
      {result && (
        <p className="mt-3 text-sm">
          Saldo disponible: <span className="font-semibold text-terracotta">{money(result.balance)}</span>{" "}
          <span className="text-ink-soft">de {money(result.amount)} originales.</span>
        </p>
      )}
    </div>
  );
}
