"use client";

import { useState } from "react";
import { REPAIR_STAGES, getSimulatedRepairStageIndex } from "@/lib/repairTracking";

export function RepairForm() {
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
      const res = await fetch("/api/repairs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          pieceDescription: data.get("pieceDescription"),
          issue: data.get("issue"),
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

  if (status === "ok" && result) {
    const stageIndex = getSimulatedRepairStageIndex(result.requestedAt);
    return (
      <div className="rounded-2xl border border-line p-8">
        <p className="font-semibold">Solicitud enviada ✓ Referencia {result.id}</p>
        <p className="mt-2 text-sm text-ink-soft">
          Te escribiremos por email para confirmar el envío o la recogida de la pieza. Estado simulado de demostración
          (calculado a partir de la fecha de solicitud, sin conexión real con el taller):
        </p>
        <ol className="mt-4 flex flex-wrap gap-3 text-sm">
          {REPAIR_STAGES.map((stage, i) => (
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
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-ink-soft">Nombre</span>
          <input name="name" required maxLength={100} className="rounded-lg border border-line bg-surface px-3.5 py-2.5" />
        </label>
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-ink-soft">Email</span>
          <input name="email" type="email" required maxLength={120} className="rounded-lg border border-line bg-surface px-3.5 py-2.5" />
        </label>
      </div>
      <label className="flex flex-col gap-1.5 text-sm">
        <span className="font-medium text-ink-soft">¿Qué pieza es?</span>
        <input name="pieceDescription" required placeholder="Ej. pulsera Raíz, comprada en junio" maxLength={200} className="rounded-lg border border-line bg-surface px-3.5 py-2.5" />
      </label>
      <label className="flex flex-col gap-1.5 text-sm">
        <span className="font-medium text-ink-soft">¿Qué le pasa?</span>
        <textarea name="issue" required rows={3} maxLength={500} className="resize-none rounded-lg border border-line bg-surface px-3.5 py-2.5" />
      </label>
      {status === "error" && <p className="text-sm font-semibold text-red-600">{error}</p>}
      <button type="submit" disabled={status === "loading"} className="rounded-full bg-ink px-6 py-3.5 font-semibold text-ivory disabled:opacity-50">
        {status === "loading" ? "Enviando..." : "Solicitar reparación / Second Life"}
      </button>
    </form>
  );
}
