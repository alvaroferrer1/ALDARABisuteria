import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { updateUserName, readSessionCookieValue, createSessionCookieValue, SESSION_COOKIE_NAME } from "@/lib/auth";

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const sessionValue = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  const user = readSessionCookieValue(sessionValue);
  if (!user) return NextResponse.json({ error: "Inicia sesión para editar tu perfil." }, { status: 401 });

  let body: { name?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Cuerpo inválido." }, { status: 400 });
  }
  const name = (body.name || "").trim().slice(0, 80);
  if (name.length < 2) return NextResponse.json({ error: "Escribe un nombre válido." }, { status: 400 });

  const updated = await updateUserName(user.email, name);

  // La cookie de sesión lleva el nombre embebido (createSessionCookieValue) —
  // sin volver a firmarla aquí, el nombre nuevo no se vería hasta el próximo
  // login, pese a que la base de datos ya lo tuviera actualizado.
  const res = NextResponse.json({ ok: true, user: updated });
  res.cookies.set(SESSION_COOKIE_NAME, createSessionCookieValue(updated), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return res;
}
