import { NextResponse } from "next/server";
import { readJson, writeJson } from "@/lib/localDb";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const FILE = "newsletter-subscribers.json";

interface Subscriber {
  email: string;
  subscribedAt: string;
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Cuerpo de la petición inválido." }, { status: 400 });
  }

  const email = typeof body === "object" && body !== null && "email" in body ? String((body as { email: unknown }).email) : "";

  if (!EMAIL_RE.test(email) || email.length > 200) {
    return NextResponse.json({ error: "Escribe un email válido." }, { status: 400 });
  }

  const subscribers = await readJson<Subscriber[]>(FILE, []);
  if (!subscribers.some((s) => s.email.toLowerCase() === email.toLowerCase())) {
    subscribers.push({ email, subscribedAt: new Date().toISOString() });
    await writeJson(FILE, subscribers);
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request) {
  const email = new URL(request.url).searchParams.get("email") || "";
  if (!EMAIL_RE.test(email)) return NextResponse.json({ error: "Email inválido." }, { status: 400 });

  const subscribers = await readJson<Subscriber[]>(FILE, []);
  const filtered = subscribers.filter((s) => s.email.toLowerCase() !== email.toLowerCase());
  await writeJson(FILE, filtered);
  return NextResponse.json({ ok: true });
}
