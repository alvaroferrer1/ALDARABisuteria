"use client";

import { useState } from "react";
import { useTranslations } from "@/lib/i18n/localeStore";

export function NewsletterForm() {
  const { t } = useTranslations();
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
    <form onSubmit={handleSubmit} className="max-w-[280px]">
      <label htmlFor="newsletter-email" className="sr-only">
        Tu email
      </label>
      <div className="flex gap-2">
        <input
          id="newsletter-email"
          name="email"
          type="email"
          required
          maxLength={120}
          placeholder={t.footer.emailPlaceholder}
          className="min-w-0 flex-1 rounded-full border border-white/20 bg-white/5 px-3.5 py-2.5 text-sm text-white placeholder:text-white/40 focus:border-[#d4af37] focus:outline-none"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="rounded-full bg-[#d4af37] px-4 py-2.5 text-sm font-semibold text-[#0d1220] hover:bg-[#e3c665] disabled:opacity-50"
        >
          {t.footer.join}
        </button>
      </div>
      <p role="status" aria-live="polite" className={`mt-2 min-h-4 text-xs ${status === "error" ? "font-semibold text-red-400" : "text-[#e3c665]"}`}>
        {message}
      </p>
    </form>
  );
}
