/**
 * Rate limiter en memoria — ventana fija simple, sin dependencias externas.
 * Suficiente para esta demo de un solo proceso; en un despliegue real con
 * varias instancias habría que moverlo a un store compartido (Redis, etc.),
 * pero la interfaz (`checkRateLimit(key)`) no cambiaría.
 */
interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();

export function checkRateLimit(key: string, limit: number, windowMs: number): { allowed: boolean; retryAfterMs: number } {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || now >= bucket.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfterMs: 0 };
  }

  if (bucket.count >= limit) {
    return { allowed: false, retryAfterMs: bucket.resetAt - now };
  }

  bucket.count += 1;
  return { allowed: true, retryAfterMs: 0 };
}

/**
 * IP del request para limitar por origen — nunca por un valor que mande el
 * propio cliente en el cuerpo (se podría falsear para esquivar el límite).
 * `x-forwarded-for` es lo único disponible detrás de un proxy/CDN; en local
 * no existe, de ahí el fallback "local" (agrupa todo el tráfico de dev en
 * un único bucket, sin impacto en producción real).
 */
export function ipKeyFrom(request: Request): string {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  return `ip:${ip}`;
}

/**
 * Respuesta 429 homogénea para todos los endpoints públicos que aplican
 * rate limit — mismo formato de error y cabecera Retry-After en todos.
 */
export function rateLimitedResponse(retryAfterMs: number) {
  return Response.json(
    { error: "Demasiadas peticiones — espera unos segundos y vuelve a intentarlo." },
    { status: 429, headers: { "Retry-After": String(Math.ceil(retryAfterMs / 1000)) } }
  );
}
