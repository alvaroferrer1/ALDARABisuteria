"use client";

import { useState } from "react";

/**
 * Compartir con `navigator.share` nativo cuando el navegador lo soporta
 * (móvil, sobre todo), con fallback a copiar el enlace — mejora real de
 * acceso sin depender de redes concretas (POST_AUDIT_IMPROVEMENTS.md,
 * bloque F).
 */
export function ShareButton({ title, className = "" }: { title: string; className?: string }) {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        // Usuario cancela el share nativo — no es un error a mostrar.
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Portapapeles no disponible — silencioso, no bloquea la lectura.
    }
  }

  return (
    <button type="button" onClick={handleShare} className={`inline-flex items-center gap-1.5 text-sm font-semibold hover:text-terracotta ${className}`}>
      <svg viewBox="0 0 24 24" width="16" aria-hidden="true">
        <path
          d="M18 8a3 3 0 1 0-2.83-4H15a3 3 0 0 0 .09 2.7l-6.18 3.6a3 3 0 1 0 0 3.4l6.18 3.6A3 3 0 1 0 18 16a2.98 2.98 0 0 0-2.09.86l-6.09-3.55a3 3 0 0 0 0-1.62l6.09-3.55A2.98 2.98 0 0 0 18 8Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {copied ? "Enlace copiado" : "Compartir"}
    </button>
  );
}
