import { NextResponse } from "next/server";
import { recordEvent, type AnalyticsEvent, type AnalyticsEventType } from "@/lib/analytics";
import { checkRateLimit, ipKeyFrom, rateLimitedResponse } from "@/lib/rateLimit";

const VALID_TYPES: AnalyticsEventType[] = ["pageview", "add_to_cart", "begin_checkout", "purchase"];
// Generoso a propósito: una sesión normal navegando genera bastantes
// pageviews propios; el límite frena scripts, no personas navegando.
const LIMIT = 120;
const WINDOW_MS = 60 * 1000;

export async function POST(request: Request) {
  const { allowed, retryAfterMs } = checkRateLimit(`analytics:${ipKeyFrom(request)}`, LIMIT, WINDOW_MS);
  if (!allowed) return rateLimitedResponse(retryAfterMs);

  let body: Partial<AnalyticsEvent>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Cuerpo inválido." }, { status: 400 });
  }

  const type = VALID_TYPES.includes(body.type as AnalyticsEventType) ? (body.type as AnalyticsEventType) : undefined;
  const path = typeof body.path === "string" ? body.path.slice(0, 200) : "";
  const sessionId = typeof body.sessionId === "string" && /^[a-zA-Z0-9-]{8,64}$/.test(body.sessionId) ? body.sessionId : "";
  if (!type || !path || !sessionId) return NextResponse.json({ error: "Evento inválido." }, { status: 400 });

  const meta: Record<string, string | number> = {};
  if (body.meta && typeof body.meta === "object") {
    for (const [k, v] of Object.entries(body.meta).slice(0, 5)) {
      if ((typeof v === "string" || typeof v === "number") && k.length <= 40) {
        meta[k] = typeof v === "string" ? v.slice(0, 120) : v;
      }
    }
  }

  await recordEvent({ type, path, sessionId, ts: new Date().toISOString(), ...(Object.keys(meta).length ? { meta } : {}) });
  return NextResponse.json({ ok: true });
}
