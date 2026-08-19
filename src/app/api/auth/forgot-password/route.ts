import { NextResponse } from "next/server";
import { createPasswordResetToken } from "@/lib/auth";
import { checkRateLimit, ipKeyFrom, rateLimitedResponse } from "@/lib/rateLimit";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const LIMIT = 5;
const WINDOW_MS = 15 * 60 * 1000;

export async function POST(request: Request) {
  const { allowed, retryAfterMs } = checkRateLimit(`forgot-password:${ipKeyFrom(request)}`, LIMIT, WINDOW_MS);
  if (!allowed) return rateLimitedResponse(retryAfterMs);

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Cuerpo inválido." }, { status: 400 });
  }
  const email = typeof body === "object" && body !== null && "email" in body ? String((body as { email: unknown }).email) : "";
  if (!EMAIL_RE.test(email)) return NextResponse.json({ error: "Escribe un email válido." }, { status: 400 });

  // Se llama siempre, exista o no la cuenta, y se responde igual en ambos
  // casos: evita que un atacante use este endpoint para averiguar qué
  // emails están registrados (enumeración de usuarios).
  await createPasswordResetToken(email);
  return NextResponse.json({ ok: true });
}
