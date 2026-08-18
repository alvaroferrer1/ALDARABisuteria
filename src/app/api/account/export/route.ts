import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { readSessionCookieValue, SESSION_COOKIE_NAME, getUsers } from "@/lib/auth";
import { readJson } from "@/lib/localDb";

interface DemoOrder {
  id: string;
  email: string;
  [key: string]: unknown;
}

/**
 * Exportación de datos personales (Master #91 "Cuenta - privacidad").
 * Descarga real de los datos que ALDARA tiene de este usuario: perfil +
 * sus pedidos. No incluye passwordHash/salt — solo lo que el propio
 * usuario podría reconocer como "sus datos".
 */
export async function GET() {
  const cookieStore = await cookies();
  const session = readSessionCookieValue(cookieStore.get(SESSION_COOKIE_NAME)?.value);
  if (!session) return NextResponse.json({ error: "No has iniciado sesión." }, { status: 401 });

  const users = await getUsers();
  const account = users.find((u) => u.email.toLowerCase() === session.email.toLowerCase());
  const orders = await readJson<DemoOrder[]>("orders.json", []);
  const myOrders = orders.filter((o) => o.email?.toLowerCase() === session.email.toLowerCase());

  const payload = {
    exportedAt: new Date().toISOString(),
    profile: account ? { email: account.email, name: account.name, createdAt: account.createdAt } : null,
    orders: myOrders,
  };

  return new NextResponse(JSON.stringify(payload, null, 2), {
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="aldara-datos-${session.email}.json"`,
    },
  });
}
