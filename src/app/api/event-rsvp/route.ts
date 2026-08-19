import { NextResponse } from "next/server";
import { readJson, writeJson } from "@/lib/localDb";
import { getEventBySlug } from "@/lib/events";
import { checkRateLimit, ipKeyFrom, rateLimitedResponse } from "@/lib/rateLimit";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const FILE = "event-rsvps.json";
const LIMIT = 8;
const WINDOW_MS = 10 * 60 * 1000;

interface EventRsvp {
  eventSlug: string;
  name: string;
  email: string;
  receivedAt: string;
}

export async function POST(request: Request) {
  const { allowed, retryAfterMs } = checkRateLimit(`event-rsvp:${ipKeyFrom(request)}`, LIMIT, WINDOW_MS);
  if (!allowed) return rateLimitedResponse(retryAfterMs);

  let body: Partial<EventRsvp>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Cuerpo inválido." }, { status: 400 });
  }
  const eventSlug = (body.eventSlug || "").toString();
  const name = (body.name || "").toString().trim().slice(0, 100);
  const email = (body.email || "").toString().trim();

  if (!getEventBySlug(eventSlug)) return NextResponse.json({ error: "Evento no encontrado." }, { status: 404 });
  if (name.length < 2) return NextResponse.json({ error: "Escribe tu nombre." }, { status: 400 });
  if (!EMAIL_RE.test(email)) return NextResponse.json({ error: "Email inválido." }, { status: 400 });

  const rsvps = await readJson<EventRsvp[]>(FILE, []);
  rsvps.push({ eventSlug, name, email, receivedAt: new Date().toISOString() });
  await writeJson(FILE, rsvps);

  return NextResponse.json({ ok: true });
}
