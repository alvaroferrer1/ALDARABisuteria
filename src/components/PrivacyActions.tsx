"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function PrivacyActions({ email }: { email: string }) {
  const router = useRouter();
  const [deleteStatus, setDeleteStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [confirming, setConfirming] = useState(false);

  async function handleExport() {
    const res = await fetch("/api/account/export");
    if (!res.ok) return;
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `aldara-datos-${email}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  async function handleDeleteRequest() {
    setDeleteStatus("loading");
    try {
      const res = await fetch("/api/account/delete-request", { method: "POST" });
      if (!res.ok) throw new Error();
      setDeleteStatus("ok");
      setTimeout(() => {
        fetch("/api/auth/logout", { method: "POST" }).finally(() => router.push("/"));
      }, 2500);
    } catch {
      setDeleteStatus("error");
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-2xl border border-line p-6">
        <h2 className="font-semibold">Exportar mis datos</h2>
        <p className="mt-1.5 text-sm text-ink-soft">Descarga un archivo JSON con tu perfil y tus pedidos.</p>
        <button type="button" onClick={handleExport} className="mt-4 rounded-full border border-line px-5 py-2.5 text-sm font-semibold hover:border-ink">
          Descargar mis datos
        </button>
      </div>

      <div className="rounded-2xl border border-red-200 p-6">
        <h2 className="font-semibold text-red-700">Eliminar mi cuenta</h2>
        <p className="mt-1.5 text-sm text-ink-soft">
          Enviaremos tu solicitud a nuestro equipo, que la procesa manualmente en un plazo máximo de 30 días. Se cierra tu
          sesión de inmediato.
        </p>

        {deleteStatus === "ok" ? (
          <p className="mt-4 font-semibold text-terracotta">Solicitud registrada ✓ Cerrando tu sesión…</p>
        ) : !confirming ? (
          <button type="button" onClick={() => setConfirming(true)} className="mt-4 rounded-full border border-red-300 px-5 py-2.5 text-sm font-semibold text-red-700 hover:bg-red-50">
            Solicitar eliminación de cuenta
          </button>
        ) : (
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <p className="text-sm font-semibold">¿Seguro?</p>
            <button
              type="button"
              onClick={handleDeleteRequest}
              disabled={deleteStatus === "loading"}
              className="rounded-full bg-red-600 px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
            >
              {deleteStatus === "loading" ? "Enviando..." : "Sí, solicitar eliminación"}
            </button>
            <button type="button" onClick={() => setConfirming(false)} className="rounded-full border border-line px-5 py-2.5 text-sm font-semibold">
              Cancelar
            </button>
          </div>
        )}
        {deleteStatus === "error" && <p className="mt-3 text-sm font-semibold text-red-600">No se pudo enviar la solicitud. Inténtalo de nuevo.</p>}
      </div>
    </div>
  );
}
