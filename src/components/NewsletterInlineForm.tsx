"use client";

import { useState } from "react";

/**
 * Variante clara de NewsletterForm, para usarla fuera del footer oscuro
 * (p.ej. el 404, calcado de la p.44 del PDF: "Únete a la familia ALDARA").
 * Mismo endpoint real /api/newsletter, solo cambia el estilo.
 */
export function NewsletterInlineForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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
      if (!res.ok) throw new Error(data.error || "Error al suscribirte");
      setStatus("ok");
      setMessage("¡Listo! Te avisaremos de las novedades ✨");
      form.reset();
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Escribe un email válido.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="newsletter-inline-email" className="sr-only">
        Tu email
      </label>
      <div className="flex gap-2">
        <input
          id="newsletter-inline-email"
          name="email"
          type="email"
          required
          maxLength={120}
          placeholder="Tu email"
          className="min-w-0 flex-1 rounded-full border border-line bg-surface px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-soft focus:border-terracotta focus:outline-none"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="rounded-full bg-terracotta px-4 py-2.5 text-sm font-semibold text-ivory hover:opacity-90 disabled:opacity-50"
        >
          Unirme
        </button>
      </div>
      <p role="status" aria-live="polite" className={`mt-2 min-h-4 text-xs ${status === "error" ? "font-semibold text-red-600" : "text-terracotta"}`}>
        {message}
      </p>
    </form>
  );
}
