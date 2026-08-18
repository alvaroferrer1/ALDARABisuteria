"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function DeleteGiftStoryButton({ token }: { token: string }) {
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();

  async function handleDelete() {
    setDeleting(true);
    await fetch("/api/gift-story", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });
    router.push("/");
  }

  if (!confirming) {
    return (
      <button type="button" onClick={() => setConfirming(true)} className="text-xs text-ink-soft underline">
        Eliminar esta historia
      </button>
    );
  }

  return (
    <div className="flex items-center gap-3 text-xs">
      <span>¿Eliminar para siempre?</span>
      <button type="button" onClick={handleDelete} disabled={deleting} className="font-semibold text-red-600 underline">
        {deleting ? "Eliminando…" : "Sí, eliminar"}
      </button>
      <button type="button" onClick={() => setConfirming(false)} className="underline">
        Cancelar
      </button>
    </div>
  );
}
