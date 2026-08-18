import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { readSessionCookieValue, SESSION_COOKIE_NAME } from "@/lib/auth";
import { readJson } from "@/lib/localDb";
import { getAssistantReply } from "@/lib/assistant/assistantProvider";
import { checkRateLimit } from "@/lib/rateLimit";
import type { AssistantContext } from "@/lib/assistant/types";
import type { DemoOrder } from "@/lib/types";

const MAX_MESSAGE_LEN = 500;
const RATE_LIMIT = 20; // mensajes
const RATE_WINDOW_MS = 60_000; // por minuto

export async function POST(request: Request) {
  // Higiene de seguridad básica: sin límite, un endpoint público como este
  // se puede saturar con peticiones automatizadas sin coste. Se limita por
  // sesión si existe (más preciso) y si no, por IP — nunca por un valor que
  // mande el propio cliente en el cuerpo, para que no se pueda burlar.
  const cookieStoreForLimit = await cookies();
  const sessionCookieRaw = cookieStoreForLimit.get(SESSION_COOKIE_NAME)?.value;
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  const rateLimitKey = sessionCookieRaw ? `session:${sessionCookieRaw}` : `ip:${ip}`;
  const { allowed, retryAfterMs } = checkRateLimit(rateLimitKey, RATE_LIMIT, RATE_WINDOW_MS);
  if (!allowed) {
    return NextResponse.json(
      { intent: "unknown", text: "Estás escribiendo muy rápido — espera unos segundos y vuelve a intentarlo.", lowConfidence: true },
      { status: 429, headers: { "Retry-After": String(Math.ceil(retryAfterMs / 1000)) } }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Cuerpo inválido." }, { status: 400 });
  }
  const b = (body || {}) as Record<string, unknown>;
  const text = String(b.text || "").slice(0, MAX_MESSAGE_LEN);
  const context: AssistantContext = { lastProductId: typeof b.lastProductId === "string" ? b.lastProductId : undefined };

  // Identidad SIEMPRE resuelta desde la cookie de sesión firmada, nunca desde
  // un campo que mande el cliente — evita por diseño el bug real anterior de
  // exposición de pedidos ajenos (ver /api/orders, KNOWN_ISSUES.md).
  const session = readSessionCookieValue(sessionCookieRaw);

  let myOrders: DemoOrder[] = [];
  if (session) {
    const allOrders = await readJson<DemoOrder[]>("orders.json", []);
    myOrders = allOrders.filter((o) => o.email.toLowerCase() === session.email.toLowerCase());
  }

  const reply = getAssistantReply(text, context, session, myOrders);
  return NextResponse.json(reply);
}
