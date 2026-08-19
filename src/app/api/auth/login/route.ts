import { NextResponse } from "next/server";
import { verifyUser, createSessionCookieValue, SESSION_COOKIE_NAME } from "@/lib/auth";
import { checkRateLimit, ipKeyFrom, rateLimitedResponse } from "@/lib/rateLimit";

// Freno a fuerza bruta por IP — antes no había ningún límite en /login,
// gap real: un script podía probar contraseñas sin restricción.
const LOGIN_LIMIT = 10;
const LOGIN_WINDOW_MS = 5 * 60 * 1000;

export async function POST(request: Request) {
  const { allowed, retryAfterMs } = checkRateLimit(`login:${ipKeyFrom(request)}`, LOGIN_LIMIT, LOGIN_WINDOW_MS);
  if (!allowed) return rateLimitedResponse(retryAfterMs);

  let body: { email?: string; password?: string; remember?: boolean };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Cuerpo inválido." }, { status: 400 });
  }
  const { email = "", password = "", remember = true } = body;
  const user = await verifyUser(email, password);
  if (!user) return NextResponse.json({ error: "Email o contraseña incorrectos." }, { status: 401 });

  const res = NextResponse.json({ ok: true, user });
  res.cookies.set(SESSION_COOKIE_NAME, createSessionCookieValue(user), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    // "Recuérdame" real: sin marcar, la sesión es de navegador (sin maxAge,
    // se borra al cerrarlo); marcada, dura 30 días — antes siempre eran 30
    // días sin que el checkbox existiera ni afectara a nada.
    ...(remember ? { maxAge: 60 * 60 * 24 * 30 } : {}),
  });
  return res;
}
