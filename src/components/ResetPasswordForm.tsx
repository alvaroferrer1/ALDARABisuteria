"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function ResetPasswordForm({ token, email }: { token: string; email: string }) {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const newPassword = String(form.get("newPassword") || "");
    const confirmPassword = String(form.get("confirmPassword") || "");
    if (newPassword !== confirmPassword) {
      setStatus("error");
      setError("Las contraseñas no coinciden.");
      return;
    }
    setStatus("loading");
    setError("");
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, email, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "No se pudo restablecer la contraseña.");
      setStatus("ok");
      setTimeout(() => router.push("/account"), 1800);
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Ha ocurrido un error.");
    }
  }

  if (!token || !email) {
    return <p className="text-sm font-semibold text-red-600">Este enlace no es válido. Solicita uno nuevo desde &ldquo;¿Olvidaste tu contraseña?&rdquo;.</p>;
  }

  if (status === "ok") {
    return <p className="font-semibold text-terracotta">Contraseña actualizada ✓ Redirigiendo a tu cuenta…</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <label className="flex flex-col gap-1.5 text-sm">
        <span className="font-medium text-ink-soft">Nueva contraseña</span>
        <input name="newPassword" type="password" required minLength={8} className="rounded-lg border border-line bg-surface px-3.5 py-2.5" />
      </label>
      <label className="flex flex-col gap-1.5 text-sm">
        <span className="font-medium text-ink-soft">Confirmar contraseña</span>
        <input name="confirmPassword" type="password" required minLength={8} className="rounded-lg border border-line bg-surface px-3.5 py-2.5" />
      </label>
      {status === "error" && <p className="text-sm font-semibold text-red-600">{error}</p>}
      <button type="submit" disabled={status === "loading"} className="self-start rounded-full bg-ink px-6 py-3 font-semibold text-ivory disabled:opacity-50">
        {status === "loading" ? "Guardando..." : "Restablecer contraseña"}
      </button>
    </form>
  );
}
