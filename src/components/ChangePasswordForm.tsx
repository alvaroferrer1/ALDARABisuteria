"use client";

import { useState } from "react";
import { useTranslations } from "@/lib/i18n/localeStore";

export function ChangePasswordForm() {
  const { t } = useTranslations();
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // Ver ContactForm.tsx: capturar el <form> antes del await evita el bug
    // real de "Cannot read properties of null" al llamar .reset() después.
    const formEl = e.currentTarget;
    setStatus("loading");
    const form = new FormData(formEl);
    const currentPassword = String(form.get("currentPassword") || "");
    const newPassword = String(form.get("newPassword") || "");
    const confirmPassword = String(form.get("confirmPassword") || "");

    if (newPassword !== confirmPassword) {
      setStatus("error");
      setMessage(t.accountSecurity.mismatch);
      return;
    }

    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "No se pudo cambiar la contraseña.");
      setStatus("ok");
      setMessage(t.accountSecurity.updated);
      formEl.reset();
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Error inesperado.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 rounded-2xl border border-line p-6">
      <label className="flex flex-col gap-1.5 text-sm">
        <span className="font-medium text-ink-soft">{t.accountSecurity.currentPassword}</span>
        <input name="currentPassword" type="password" required className="rounded-lg border border-line bg-surface px-3.5 py-2.5" />
      </label>
      <label className="flex flex-col gap-1.5 text-sm">
        <span className="font-medium text-ink-soft">{t.accountSecurity.newPassword}</span>
        <input name="newPassword" type="password" required minLength={8} className="rounded-lg border border-line bg-surface px-3.5 py-2.5" />
      </label>
      <label className="flex flex-col gap-1.5 text-sm">
        <span className="font-medium text-ink-soft">{t.accountSecurity.confirmPassword}</span>
        <input name="confirmPassword" type="password" required minLength={8} className="rounded-lg border border-line bg-surface px-3.5 py-2.5" />
      </label>
      <p role="status" aria-live="polite" className={`min-h-4 text-sm ${status === "error" ? "font-semibold text-red-600" : "text-terracotta"}`}>
        {message}
      </p>
      <button type="submit" disabled={status === "loading"} className="self-start rounded-full bg-ink px-6 py-3 text-sm font-semibold text-ivory disabled:opacity-50">
        {status === "loading" ? t.accountSecurity.changing : t.accountSecurity.changePassword}
      </button>
    </form>
  );
}
