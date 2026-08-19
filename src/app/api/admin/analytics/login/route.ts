import { NextResponse } from "next/server";
import { verifyAdminPassword, createAdminCookieValue, ADMIN_COOKIE_NAME } from "@/lib/adminAuth";
import { checkRateLimit, ipKeyFrom, rateLimitedResponse } from "@/lib/rateLimit";

// Freno a fuerza bruta sobre la contraseña compartida del panel.
const LIMIT = 8;
const WINDOW_MS = 10 * 60 * 1000;

export async function POST(request: Request) {
  const { allowed, retryAfterMs } = checkRateLimit(`admin-analytics-login:${ipKeyFrom(request)}`, LIMIT, WINDOW_MS);
  if (!allowed) return rateLimitedResponse(retryAfterMs);

  let body: { password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Cuerpo inválido." }, { status: 400 });
  }

  if (!verifyAdminPassword(body.password || "")) {
    return NextResponse.json({ error: "Contraseña incorrecta." }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE_NAME, createAdminCookieValue(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 2, // 2h — panel interno, sesión corta a propósito
  });
  return res;
}
