import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { readSessionCookieValue, SESSION_COOKIE_NAME } from "@/lib/auth";
import { getBalance } from "@/lib/clubLedger";

/** Saldo real del Club — siempre de la sesión autenticada, nunca de un email que mande el cliente. */
export async function GET() {
  const cookieStore = await cookies();
  const session = readSessionCookieValue(cookieStore.get(SESSION_COOKIE_NAME)?.value);
  if (!session) return NextResponse.json({ error: "No has iniciado sesión." }, { status: 401 });

  const balance = await getBalance(session.email);
  return NextResponse.json({ balance });
}
