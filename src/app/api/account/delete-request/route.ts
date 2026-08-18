import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { readSessionCookieValue, SESSION_COOKIE_NAME } from "@/lib/auth";
import { readJson, writeJson } from "@/lib/localDb";

interface DeletionRequest {
  email: string;
  requestedAt: string;
}

/**
 * Solicitud de borrado de cuenta (Master #91). Igual que el resto de
 * formularios de esta demo (citas, reparaciones, contacto), se registra
 * la solicitud para procesarla manualmente en vez de borrar en caliente
 * — un borrado real e irreversible de datos de usuario no es algo que
 * deba ejecutar un botón sin verificación humana, ni en producción ni
 * en esta demo.
 */
export async function POST() {
  const cookieStore = await cookies();
  const session = readSessionCookieValue(cookieStore.get(SESSION_COOKIE_NAME)?.value);
  if (!session) return NextResponse.json({ error: "No has iniciado sesión." }, { status: 401 });

  const requests = await readJson<DeletionRequest[]>("account-deletion-requests.json", []);
  if (!requests.some((r) => r.email.toLowerCase() === session.email.toLowerCase())) {
    requests.push({ email: session.email, requestedAt: new Date().toISOString() });
    await writeJson("account-deletion-requests.json", requests);
  }

  return NextResponse.json({ ok: true });
}
