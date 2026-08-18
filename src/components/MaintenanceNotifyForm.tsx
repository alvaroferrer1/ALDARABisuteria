"use client";

import { useState } from "react";

/**
 * Formulario de aviso para el estado "Mantenimiento" — reutiliza el mismo
 * endpoint real `/api/newsletter` que el resto del sitio (no un mock
 * separado), ya que conceptualmente es la misma acción: avisar por email
 * cuando haya novedades.
 */
export function MaintenanceNotifyForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const email = (new FormData(form).get("email") as string) || "";
    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al registrar tu email");
      setStatus("ok");
      setMessage("Te avisaremos en cuanto volvamos ✨");
      form.reset();
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Escribe un email válido.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto mt-6 flex max-w-sm gap-2">
      <label htmlFor="maintenance-email" className="sr-only">
        Tu email
      </label>
      <input
        id="maintenance-email"
        name="email"
        type="email"
        required
        maxLength={120}
        placeholder="Tu email"
        className="min-w-0 flex-1 rounded-full border border-white/20 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/40 focus:border-[#d4af37] focus:outline-none"
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="shrink-0 rounded-full bg-[#d4af37] px-5 py-2.5 text-sm font-semibold text-[#0d1220] hover:bg-[#e3c665] disabled:opacity-50"
      >
        Avísame
      </button>
      {message && (
        <p role="status" aria-live="polite" className={`absolute mt-12 text-xs ${status === "error" ? "font-semibold text-red-400" : "text-[#e3c665]"}`}>
          {message}
        </p>
      )}
    </form>
  );
}
