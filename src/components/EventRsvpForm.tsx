"use client";

import { useState } from "react";

export function EventRsvpForm({ eventSlug }: { eventSlug: string }) {
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setError("");
    const form = e.currentTarget;
    const data = new FormData(form);
    try {
      const res = await fetch("/api/event-rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventSlug, name: data.get("name"), email: data.get("email") }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "No se pudo reservar la plaza.");
      setStatus("ok");
      form.reset();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Ha ocurrido un error.");
    }
  }

  if (status === "ok") {
    return (
      <div className="rounded-2xl border border-line p-6 text-center">
        <p className="font-semibold">Reserva registrada ✓</p>
        <p className="mt-1 text-sm text-ink-soft">Te escribiremos por email para confirmar tu plaza en este evento demo.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 rounded-2xl border border-line p-6">
      <p className="font-semibold">Reservar plaza</p>
      <input name="name" required placeholder="Tu nombre" maxLength={100} className="rounded-lg border border-line bg-surface px-3.5 py-2.5 text-sm" />
      <input name="email" type="email" required placeholder="Tu email" maxLength={120} className="rounded-lg border border-line bg-surface px-3.5 py-2.5 text-sm" />
      {status === "error" && <p className="text-sm font-semibold text-red-600">{error}</p>}
      <button type="submit" disabled={status === "loading"} className="rounded-full bg-ink px-6 py-3 text-sm font-semibold text-ivory disabled:opacity-50">
        {status === "loading" ? "Enviando..." : "Reservar plaza"}
      </button>
    </form>
  );
}
