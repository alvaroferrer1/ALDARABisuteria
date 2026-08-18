import { NextResponse } from "next/server";
import { readJson } from "@/lib/localDb";

interface DemoEmail {
  to: string;
  subject: string;
  body: string;
  sentAt: string;
}

/**
 * Endpoint SOLO-DESARROLLO: expone el último "email" enviado por el
 * DemoEmailProvider (ver lib/auth.ts) para poder probar el flujo de
 * recuperación de contraseña de principio a fin sin bandeja de entrada
 * real.
 *
 * VULNERABILIDAD REAL corregida en auditoría de seguridad: sin el guard de
 * `NODE_ENV`, cualquiera podía pedir la recuperación de contraseña de la
 * cuenta de otra persona (`POST /api/auth/forgot-password`) y luego leer el
 * enlace/token de restablecimiento de esa cuenta con este endpoint — un
 * secuestro de cuenta completo, la misma familia de fallo que la fuga de
 * pedidos que este proyecto ya corrigió una vez y que no debía reaparecer.
 * Ahora el endpoint no existe en absoluto fuera de desarrollo local.
 */
export async function GET(request: Request) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "No encontrado." }, { status: 404 });
  }
  const email = new URL(request.url).searchParams.get("email") || "";
  if (!email) return NextResponse.json({ error: "Falta email." }, { status: 400 });

  const emails = await readJson<DemoEmail[]>("demo-emails.json", []);
  const last = [...emails].reverse().find((e) => e.to.toLowerCase() === email.toLowerCase());
  if (!last) return NextResponse.json({ link: null });

  const match = last.body.match(/(\/account\/restablecer\?[^\s)]+)/);
  return NextResponse.json({ link: match ? match[1] : null });
}
