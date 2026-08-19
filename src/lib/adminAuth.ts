import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Acceso al panel interno de analítica (`/admin/analytics`) — NO es un
 * sistema de roles/usuarios admin real (eso requeriría un modelo de
 * permisos completo), solo una contraseña compartida por variable de
 * entorno (mismo patrón ya usado en `X-Restock-Secret`, ver
 * `api/admin/restock/route.ts`), con un valor demo por defecto para poder
 * probarlo en local. La cookie que confirma el acceso va firmada con HMAC
 * (mismo mecanismo que la sesión de usuario en lib/auth.ts) para que no se
 * pueda falsear manipulando la cookie a mano.
 */
const ADMIN_PASSWORD = process.env.ADMIN_ANALYTICS_PASSWORD || "aldara-demo-analytics";
const ADMIN_SECRET = process.env.AUTH_SECRET || "aldara-dev-secret-cambia-esto";
export const ADMIN_COOKIE_NAME = "aldara_admin_analytics";

function sign(value: string): string {
  return createHmac("sha256", ADMIN_SECRET).update(value).digest("hex");
}

export function verifyAdminPassword(candidate: string): boolean {
  const a = Buffer.from(candidate.padEnd(64, " "));
  const b = Buffer.from(ADMIN_PASSWORD.padEnd(64, " "));
  return a.length === b.length && timingSafeEqual(a, b) && candidate === ADMIN_PASSWORD;
}

export function createAdminCookieValue(): string {
  const payload = "admin-analytics";
  return `${payload}.${sign(payload)}`;
}

export function isValidAdminCookie(value: string | undefined): boolean {
  if (!value) return false;
  const [payload, signature] = value.split(".");
  if (!payload || !signature) return false;
  return sign(payload) === signature;
}
