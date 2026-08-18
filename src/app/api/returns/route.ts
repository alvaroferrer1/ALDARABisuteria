import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { readJson, writeJson } from "@/lib/localDb";
import { readSessionCookieValue, SESSION_COOKIE_NAME } from "@/lib/auth";
import type { DemoOrder } from "@/lib/types";

const FILE = "return-requests.json";
const REASONS = ["No es lo que esperaba", "Talla o tamaño incorrecto", "Llegó dañada", "Cambié de opinión", "Otro"] as const;

export interface ReturnRequest {
  id: string;
  orderId: string;
  email: string;
  productId?: string;
  productName?: string;
  reason: string;
  description: string;
  requestedAt: string;
}

/**
 * Formulario real de devolución (POST_AUDIT_IMPROVEMENTS.md, bloque Z):
 * antes `/legal/envios-devoluciones` solo decía "contáctanos con fotos", sin
 * un formulario ni un estado propios — mismo gap que tenía Reparaciones
 * antes de construirse. Reutiliza exactamente el mismo patrón:
 * `lib/returnTracking.ts` (DEMO_SIMULATED) + persistencia en JSON local +
 * seguridad por sesión, nunca por un id/email que mande el cliente.
 *
 * La diferencia real con Reparaciones: una devolución SIEMPRE se ata a un
 * pedido real del usuario que la solicita — se verifica server-side que el
 * `orderId` indicado pertenece de verdad a la sesión activa, exactamente la
 * misma regla que ya protege `/account/pedidos/[id]` y `GET /api/orders`
 * (nunca confiar en un identificador que venga del cliente sin comprobar el
 * dueño real).
 */
export async function POST(request: Request) {
  const cookieStore = await cookies();
  const session = readSessionCookieValue(cookieStore.get(SESSION_COOKIE_NAME)?.value);
  if (!session) return NextResponse.json({ error: "Inicia sesión para solicitar una devolución." }, { status: 401 });

  let body: { orderId?: string; productId?: string; reason?: string; description?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Cuerpo inválido." }, { status: 400 });
  }

  const orderId = (body.orderId || "").toString().trim();
  const productId = (body.productId || "").toString().trim() || undefined;
  const reason = (body.reason || "").toString().trim();
  const description = (body.description || "").toString().trim().slice(0, 500);

  if (!REASONS.includes(reason as (typeof REASONS)[number])) return NextResponse.json({ error: "Elige un motivo válido." }, { status: 400 });
  if (description.length < 3) return NextResponse.json({ error: "Cuéntanos brevemente qué ha pasado." }, { status: 400 });

  const orders = await readJson<DemoOrder[]>("orders.json", []);
  const order = orders.find((o) => o.id === orderId && o.email.toLowerCase() === session.email.toLowerCase());
  if (!order) return NextResponse.json({ error: "No encontramos ese pedido en tu cuenta." }, { status: 404 });

  const item = productId ? order.items.find((i) => i.productId === productId) : undefined;

  const requests = await readJson<ReturnRequest[]>(FILE, []);
  const entry: ReturnRequest = {
    id: `DEV-${Date.now().toString(36).toUpperCase()}`,
    orderId: order.id,
    email: session.email,
    productId,
    productName: item?.name,
    reason,
    description,
    requestedAt: new Date().toISOString(),
  };
  requests.push(entry);
  await writeJson(FILE, requests);

  return NextResponse.json({ ok: true, id: entry.id });
}

export async function GET() {
  const cookieStore = await cookies();
  const session = readSessionCookieValue(cookieStore.get(SESSION_COOKIE_NAME)?.value);
  if (!session) return NextResponse.json({ error: "No has iniciado sesión." }, { status: 401 });

  const requests = await readJson<ReturnRequest[]>(FILE, []);
  return NextResponse.json({ returns: requests.filter((r) => r.email.toLowerCase() === session.email.toLowerCase()) });
}
