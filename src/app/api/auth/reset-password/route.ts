import { NextResponse } from "next/server";
import { resetPasswordWithToken } from "@/lib/auth";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Cuerpo inválido." }, { status: 400 });
  }
  const b = (body || {}) as Record<string, unknown>;
  const email = String(b.email || "");
  const token = String(b.token || "");
  const newPassword = String(b.newPassword || "");

  if (!EMAIL_RE.test(email)) return NextResponse.json({ error: "Email inválido." }, { status: 400 });
  if (!token) return NextResponse.json({ error: "Enlace inválido." }, { status: 400 });
  if (newPassword.length < 8) return NextResponse.json({ error: "La contraseña debe tener al menos 8 caracteres." }, { status: 400 });

  try {
    await resetPasswordWithToken(email, token, newPassword);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "No se pudo restablecer la contraseña." }, { status: 400 });
  }
}
