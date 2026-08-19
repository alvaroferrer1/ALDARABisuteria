import { NextResponse } from "next/server";
import { createUser, createSessionCookieValue, SESSION_COOKIE_NAME } from "@/lib/auth";
import { checkRateLimit, ipKeyFrom, rateLimitedResponse } from "@/lib/rateLimit";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const REGISTER_LIMIT = 8;
const REGISTER_WINDOW_MS = 15 * 60 * 1000;

export async function POST(request: Request) {
  const { allowed, retryAfterMs } = checkRateLimit(`register:${ipKeyFrom(request)}`, REGISTER_LIMIT, REGISTER_WINDOW_MS);
  if (!allowed) return rateLimitedResponse(retryAfterMs);

  let body: { email?: string; name?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Cuerpo inválido." }, { status: 400 });
  }
  const { email = "", name = "", password = "" } = body;

  if (!EMAIL_RE.test(email)) return NextResponse.json({ error: "Email inválido." }, { status: 400 });
  if (name.trim().length < 2) return NextResponse.json({ error: "Escribe tu nombre." }, { status: 400 });
  if (password.length < 8) return NextResponse.json({ error: "La contraseña debe tener al menos 8 caracteres." }, { status: 400 });

  try {
    const user = await createUser(email, name.trim(), password);
    const res = NextResponse.json({ ok: true, user });
    res.cookies.set(SESSION_COOKIE_NAME, createSessionCookieValue(user), {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });
    return res;
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "No se pudo crear la cuenta." }, { status: 409 });
  }
}
