"use client";

import { useState } from "react";

export function AppointmentForm() {
  const [mode, setMode] = useState<"presencial" | "videollamada">("presencial");
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setError("");
    const form = e.currentTarget;
    const data = new FormData(form);
    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          mode,
          preferredDate: data.get("preferredDate"),
          notes: data.get("notes"),
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "No se pudo enviar la solicitud.");
      setStatus("ok");
      form.reset();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Ha ocurrido un error.");
    }
  }

  if (status === "ok") {
    return (
      <div className="rounded-2xl border border-line p-8 text-center">
        <p className="font-semibold">Solicitud enviada ✓</p>
        <p className="mt-2 text-sm text-ink-soft">
          Te escribiremos por email para confirmar el día y la hora exactos. Esto no es una reserva automática todavía — la
          confirmamos a mano.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex gap-2">
        {(["presencial", "videollamada"] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            className={`flex-1 rounded-xl border px-4 py-3 text-sm font-semibold capitalize ${mode === m ? "border-ink bg-ink text-ivory" : "border-line"}`}
          >
            {m === "presencial" ? "Presencial en Puerto Almenara" : "Videollamada"}
          </button>
        ))}
      </div>
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
        <span className="font-medium text-ink-soft">Día y horario preferido</span>
        <input name="preferredDate" required placeholder="Ej. martes por la tarde, semana del 18" className="rounded-lg border border-line bg-surface px-3.5 py-2.5" />
      </label>
      <label className="flex flex-col gap-1.5 text-sm">
        <span className="font-medium text-ink-soft">¿En qué te ayudamos? (opcional)</span>
        <textarea name="notes" rows={3} maxLength={500} className="resize-none rounded-lg border border-line bg-surface px-3.5 py-2.5" />
      </label>
      {status === "error" && <p className="text-sm font-semibold text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={status === "loading"}
        className="rounded-full bg-ink px-6 py-3.5 font-semibold text-ivory disabled:opacity-50"
      >
        {status === "loading" ? "Enviando..." : "Solicitar cita"}
      </button>
    </form>
  );
}
