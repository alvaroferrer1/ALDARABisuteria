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
