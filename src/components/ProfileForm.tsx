"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function ProfileForm({ initialName, email }: { initialName: string; email: string }) {
  const [name, setName] = useState(initialName);
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [message, setMessage] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");
    try {
      const res = await fetch("/api/auth/update-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "No se pudo actualizar el perfil.");
      setStatus("ok");
      setMessage("Nombre actualizado.");
      router.refresh();
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Error inesperado.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 rounded-2xl border border-line p-6">
      <label className="flex flex-col gap-1.5 text-sm">
        <span className="font-medium text-ink-soft">Email</span>
        <input value={email} disabled className="rounded-lg border border-line bg-surface-2 px-3.5 py-2.5 text-ink-soft" />
        <span className="text-xs text-ink-soft">El email no se puede cambiar — es tu identificador de cuenta.</span>
      </label>
      <label className="flex flex-col gap-1.5 text-sm">
        <span className="font-medium text-ink-soft">Nombre</span>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          minLength={2}
          maxLength={80}
          className="rounded-lg border border-line bg-surface px-3.5 py-2.5"
        />
      </label>
      <p role="status" aria-live="polite" className={`min-h-4 text-sm ${status === "error" ? "font-semibold text-red-600" : "text-terracotta"}`}>
        {message}
      </p>
      <button
        type="submit"
        disabled={status === "loading" || name.trim() === initialName}
        className="self-start rounded-full bg-ink px-6 py-3 text-sm font-semibold text-ivory disabled:opacity-50"
      >
        {status === "loading" ? "Guardando..." : "Guardar cambios"}
      </button>
    </form>
  );
}
