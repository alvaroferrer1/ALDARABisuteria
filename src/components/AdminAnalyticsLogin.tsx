"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function AdminAnalyticsLogin() {
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/admin/analytics/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        setStatus("error");
        return;
      }
      router.refresh();
    } catch {
      setStatus("error");
    }
  }

  return (
    <section className="mx-auto max-w-sm px-4 py-24 sm:px-6">
      <p className="mb-2 text-xs font-bold uppercase tracking-widest text-terracotta">Panel interno</p>
      <h1 className="mb-3 font-display text-2xl font-semibold">Analítica de ALDARA</h1>
      <p className="mb-6 text-sm text-ink-soft">
        Panel de uso interno, no enlazado desde ninguna página pública. Protegido por contraseña compartida
        (variable de entorno <code>ADMIN_ANALYTICS_PASSWORD</code>).
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Contraseña"
          required
          autoFocus
          className="rounded-lg border border-line bg-surface px-3.5 py-2.5"
        />
        {status === "error" && <p className="text-sm font-semibold text-red-600">Contraseña incorrecta.</p>}
        <button type="submit" disabled={status === "loading"} className="rounded-full bg-ink px-6 py-3 text-sm font-semibold text-ivory disabled:opacity-50">
          {status === "loading" ? "Comprobando..." : "Entrar"}
        </button>
      </form>
    </section>
  );
}
