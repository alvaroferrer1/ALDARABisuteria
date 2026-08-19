"use client";

import { cookieConsentStore } from "./cookieConsentStore";
import type { AnalyticsEventType } from "./analytics";

const SESSION_KEY = "aldara_analytics_session";

function getSessionId(): string {
  if (typeof window === "undefined") return "";
  let id = window.sessionStorage.getItem(SESSION_KEY);
  if (!id) {
    id = crypto.randomUUID();
    window.sessionStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

/**
 * Para el evento "purchase": se registra en el servidor (dentro de
 * `POST /api/orders`, junto al pedido real) en vez de en el cliente tras la
 * redirección a /checkout/success, para no duplicarlo si esa página se
 * recarga. El checkout manda este id junto al pedido solo si hay
 * consentimiento — si no, se omite y el servidor simplemente no registra el
 * evento (el pedido en sí nunca depende de esto).
 */
export function getAnalyticsSessionIdIfConsented(): string | undefined {
  if (typeof window === "undefined") return undefined;
  const consent = cookieConsentStore.getSnapshot();
  if (!consent?.analytics) return undefined;
  return getSessionId();
}

/**
 * Envía un evento de analítica local solo si el usuario aceptó la cookie de
 * "analytics" en el banner de consentimiento (`cookieConsentStore`) — si
 * todavía no ha decidido, o la rechazó explícitamente, no se manda nada.
 * `sendBeacon` para que el evento salga incluso si la pestaña se cierra
 * justo después (típico en pageview de salida), con `fetch keepalive` como
 * fallback en navegadores/entornos sin beacon.
 */
export function trackEvent(type: AnalyticsEventType, path: string, meta?: Record<string, string | number>) {
  if (typeof window === "undefined") return;
  const consent = cookieConsentStore.getSnapshot();
  if (!consent?.analytics) return;

  const payload = JSON.stringify({ type, path, sessionId: getSessionId(), ...(meta ? { meta } : {}) });
  try {
    if (navigator.sendBeacon) {
      navigator.sendBeacon("/api/analytics", new Blob([payload], { type: "application/json" }));
      return;
    }
  } catch {
    // sigue al fallback de abajo
  }
  fetch("/api/analytics", { method: "POST", headers: { "Content-Type": "application/json" }, body: payload, keepalive: true }).catch(() => {});
}
