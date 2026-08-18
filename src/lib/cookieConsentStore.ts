import { createLocalStorageStore } from "./store";

export interface CookieConsent {
  analytics: boolean;
  marketing: boolean;
  decidedAt: string;
}

function parse(raw: string | null): CookieConsent | null {
  if (!raw) return null;
  try {
    const value = JSON.parse(raw) as CookieConsent;
    if (typeof value.analytics === "boolean" && typeof value.marketing === "boolean") return value;
    return null;
  } catch {
    return null;
  }
}

/**
 * Centro de preferencias de cookies (Master #60, distinto de #62 "Cookies"
 * que es solo la política estática en /legal/cookies). Antes "Preferencias
 * de cookies" en el footer enlazaba directamente a esa política sin dar
 * opción real de aceptar/rechazar categorías — gap real, cerrado aquí.
 * No hay analítica/marketing real conectados todavía: guardar
 * analytics/marketing en true no activa ningún script de terceros, pero
 * el propio consentimiento (aceptar/rechazar/guardar) sí es funcional de
 * verdad y queda persistido en localStorage.
 */
export const cookieConsentStore = createLocalStorageStore<CookieConsent | null>("aldara_cookie_consent", parse, null);

export const COOKIE_PREFS_OPEN_EVENT = "aldara:open-cookie-prefs";

export function openCookiePreferences() {
  if (typeof window !== "undefined") window.dispatchEvent(new Event(COOKIE_PREFS_OPEN_EVENT));
}
