"use client";

import { useState } from "react";

export function ForgotPasswordForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [error, setError] = useState("");
  const [devLink, setDevLink] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setError("");
    const form = e.currentTarget;
    const email = String(new FormData(form).get("email") || "");
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "No se pudo procesar la solicitud.");
      setStatus("ok");
      // Solo en demo local: leemos el último "email" enviado para que se
      // pueda seguir el flujo sin necesidad de abrir data/demo-emails.json
      // a mano. En producción esto desaparecería junto con el resto del
      // DemoEmailProvider.
      const emails = await fetch("/api/auth/demo-emails?email=" + encodeURIComponent(email)).then((r) => (r.ok ? r.json() : null)).catch(() => null);
      if (emails?.link) setDevLink(emails.link);
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Ha ocurrido un error.");
    }
  }

  if (status === "ok") {
    return (
      <div className="rounded-2xl border border-line p-6">
        <p className="font-semibold">Si existe una cuenta con ese email, hemos enviado un enlace ✓</p>
        {devLink && (
          <p className="mt-3 rounded-lg bg-surface-2 p-3 text-xs text-ink-soft">
            Modo demo — enlace generado:{" "}
            <a href={devLink} className="font-semibold text-terracotta underline">
              {devLink}
            </a>
          </p>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <label className="flex flex-col gap-1.5 text-sm">
        <span className="font-medium text-ink-soft">Correo electrónico</span>
        <input name="email" type="email" required maxLength={120} className="rounded-lg border border-line bg-surface px-3.5 py-2.5" />
      </label>
      {status === "error" && <p className="text-sm font-semibold text-red-600">{error}</p>}
      <button type="submit" disabled={status === "loading"} className="self-start rounded-full bg-ink px-6 py-3 font-semibold text-ivory disabled:opacity-50">
        {status === "loading" ? "Enviando..." : "Enviar enlace de recuperación"}
      </button>
    </form>
  );
}
