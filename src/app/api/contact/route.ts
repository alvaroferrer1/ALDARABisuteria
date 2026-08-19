import { NextResponse } from "next/server";
import { readJson, writeJson } from "@/lib/localDb";
import { checkRateLimit, ipKeyFrom, rateLimitedResponse } from "@/lib/rateLimit";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const FILE = "contact-messages.json";
const LIMIT = 5;
const WINDOW_MS = 10 * 60 * 1000;

interface ContactMessage {
  name: string;
  email: string;
  reason: string;
  message: string;
  orderId?: string;
  receivedAt: string;
}

export async function POST(request: Request) {
  const { allowed, retryAfterMs } = checkRateLimit(`contact:${ipKeyFrom(request)}`, LIMIT, WINDOW_MS);
  if (!allowed) return rateLimitedResponse(retryAfterMs);

  let body: Partial<ContactMessage>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Cuerpo inválido." }, { status: 400 });
  }
  const name = (body.name || "").toString().trim().slice(0, 100);
  const email = (body.email || "").toString().trim();
  const reason = (body.reason || "Otro").toString().trim().slice(0, 60);
  const message = (body.message || "").toString().trim().slice(0, 2000);
  const orderId = (body.orderId || "").toString().trim().slice(0, 60) || undefined;

  if (name.length < 2) return NextResponse.json({ error: "Escribe tu nombre." }, { status: 400 });
  if (!EMAIL_RE.test(email)) return NextResponse.json({ error: "Email inválido." }, { status: 400 });
  if (message.length < 5) return NextResponse.json({ error: "Escribe tu mensaje." }, { status: 400 });

  const messages = await readJson<ContactMessage[]>(FILE, []);
  messages.push({ name, email, reason, message, orderId, receivedAt: new Date().toISOString() });
  await writeJson(FILE, messages);

  // No hay servicio de email conectado todavía: el mensaje queda
  // guardado en data/contact-messages.json. Ver README para conectar
  // un proveedor real (Resend, Postmark...) usando esta misma ruta.
  return NextResponse.json({ ok: true });
}
