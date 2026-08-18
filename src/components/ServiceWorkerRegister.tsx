"use client";

import { useEffect } from "react";

/**
 * Registra el service worker (cachea /offline para navegación sin red).
 * No intercepta la API ni assets de Next — ver public/sw.js.
 */
export function ServiceWorkerRegister() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }
  }, []);
  return null;
}
