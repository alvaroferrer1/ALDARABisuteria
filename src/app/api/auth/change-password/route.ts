import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { changePassword, readSessionCookieValue, SESSION_COOKIE_NAME } from "@/lib/auth";

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const user = readSessionCookieValue(cookieStore.get(SESSION_COOKIE_NAME)?.value);
  if (!user) return NextResponse.json({ error: "Inicia sesión para cambiar tu contraseña." }, { status: 401 });

  let body: { currentPassword?: string; newPassword?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Cuerpo inválido." }, { status: 400 });
  }
  const { currentPassword = "", newPassword = "" } = body;
  if (newPassword.length < 8) return NextResponse.json({ error: "La nueva contraseña debe tener al menos 8 caracteres." }, { status: 400 });

  try {
    await changePassword(user.email, currentPassword, newPassword);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "No se pudo cambiar la contraseña." }, { status: 400 });
  }
}
