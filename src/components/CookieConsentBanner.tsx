"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { cookieConsentStore, COOKIE_PREFS_OPEN_EVENT } from "@/lib/cookieConsentStore";

export function CookieConsentBanner() {
  const consent = useSyncExternalStore(cookieConsentStore.subscribe, cookieConsentStore.getSnapshot, cookieConsentStore.getServerSnapshot);
  const [forceOpen, setForceOpen] = useState(false);
  const [analytics, setAnalytics] = useState(true);
  const [marketing, setMarketing] = useState(true);
  const [detail, setDetail] = useState(false);

  useEffect(() => {
    function onOpen() {
      setAnalytics(consent?.analytics ?? true);
      setMarketing(consent?.marketing ?? true);
      setDetail(true);
      setForceOpen(true);
    }
    window.addEventListener(COOKIE_PREFS_OPEN_EVENT, onOpen);
    return () => window.removeEventListener(COOKIE_PREFS_OPEN_EVENT, onOpen);
  }, [consent]);

  const visible = consent === null || forceOpen;
  if (!visible) return null;

  function save(next: { analytics: boolean; marketing: boolean }) {
    cookieConsentStore.setValue({ ...next, decidedAt: new Date().toISOString() });
    setForceOpen(false);
    setDetail(false);
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-[70]">
      {/* Bug real corregido: la barra no dejaba ningún margen de transición —
          si el contenido de la página (p. ej. un título de sección) caía justo
          en el borde superior de la barra, quedaba cortado a media letra en
          vez de ocultarse limpiamente. Este degradado hace que cualquier
          contenido que asome por detrás se desvanezca en vez de guillotinarse. */}
      <div className="h-10 bg-linear-to-t from-surface to-transparent" aria-hidden="true" />
      <div className="border-t border-line bg-surface px-4 py-5 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] sm:px-6" role="dialog" aria-label="Preferencias de cookies">
      <div className="mx-auto max-w-4xl">
        <p className="text-sm text-ink-soft">
          Usamos cookies necesarias para que la web funcione (carrito, sesión, idioma) y, si lo aceptas, cookies de analítica y
          marketing. Más detalle en la{" "}
          <Link href="/legal/cookies" className="font-semibold text-terracotta underline">
            política de cookies
          </Link>
          .
        </p>

        {detail && (
          <div className="mt-4 flex flex-col gap-2 rounded-xl border border-line p-4 text-sm">
            <label className="flex items-center justify-between gap-3">
              <span>Necesarias (siempre activas)</span>
              <input type="checkbox" checked disabled className="h-4 w-4 accent-terracotta" />
            </label>
            <label className="flex items-center justify-between gap-3">
              <span>Analítica</span>
              <input type="checkbox" checked={analytics} onChange={(e) => setAnalytics(e.target.checked)} className="h-4 w-4 accent-terracotta" />
            </label>
            <label className="flex items-center justify-between gap-3">
              <span>Marketing</span>
              <input type="checkbox" checked={marketing} onChange={(e) => setMarketing(e.target.checked)} className="h-4 w-4 accent-terracotta" />
            </label>
          </div>
        )}

        <div className="mt-4 flex flex-wrap gap-3">
          <button type="button" onClick={() => save({ analytics: true, marketing: true })} className="rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-ivory">
            Aceptar todas
          </button>
          <button type="button" onClick={() => save({ analytics: false, marketing: false })} className="rounded-full border border-line px-5 py-2.5 text-sm font-semibold">
            Rechazar no necesarias
          </button>
          {!detail && (
            <button type="button" onClick={() => setDetail(true)} className="rounded-full border border-line px-5 py-2.5 text-sm font-semibold">
              Personalizar
            </button>
          )}
          {detail && (
            <button type="button" onClick={() => save({ analytics, marketing })} className="rounded-full border border-line px-5 py-2.5 text-sm font-semibold">
              Guardar selección
            </button>
          )}
        </div>
      </div>
      </div>
    </div>
  );
}
