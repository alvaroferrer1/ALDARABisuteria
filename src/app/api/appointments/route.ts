import { NextResponse } from "next/server";
import { readJson, writeJson } from "@/lib/localDb";
import { checkRateLimit, ipKeyFrom, rateLimitedResponse } from "@/lib/rateLimit";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const FILE = "appointment-requests.json";
const MODES = ["presencial", "videollamada"] as const;
const LIMIT = 6;
const WINDOW_MS = 10 * 60 * 1000;

interface AppointmentRequest {
  name: string;
  email: string;
  mode: (typeof MODES)[number];
  preferredDate: string;
  notes?: string;
  receivedAt: string;
}

export async function POST(request: Request) {
  const { allowed, retryAfterMs } = checkRateLimit(`appointments:${ipKeyFrom(request)}`, LIMIT, WINDOW_MS);
  if (!allowed) return rateLimitedResponse(retryAfterMs);

  let body: Partial<AppointmentRequest>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Cuerpo inválido." }, { status: 400 });
  }
  const name = (body.name || "").toString().trim().slice(0, 100);
  const email = (body.email || "").toString().trim();
  const mode = (MODES as readonly string[]).includes(body.mode || "") ? (body.mode as (typeof MODES)[number]) : "presencial";
  const preferredDate = (body.preferredDate || "").toString().trim().slice(0, 40);
  const notes = (body.notes || "").toString().trim().slice(0, 500) || undefined;

  if (name.length < 2) return NextResponse.json({ error: "Escribe tu nombre." }, { status: 400 });
  if (!EMAIL_RE.test(email)) return NextResponse.json({ error: "Email inválido." }, { status: 400 });
  if (!preferredDate) return NextResponse.json({ error: "Indica una fecha u horario preferido." }, { status: 400 });

  const requests = await readJson<AppointmentRequest[]>(FILE, []);
  requests.push({ name, email, mode, preferredDate, notes, receivedAt: new Date().toISOString() });
  await writeJson(FILE, requests);

  // Sin calendario/backend de citas real conectado: la solicitud queda
  // guardada en data/appointment-requests.json y se confirma manualmente
  // por email/WhatsApp — igual que el resto de formularios de contacto.
  return NextResponse.json({ ok: true });
}
