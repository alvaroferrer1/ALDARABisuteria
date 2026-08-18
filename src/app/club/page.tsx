import { cookies } from "next/headers";
import type { Metadata } from "next";
import { readSessionCookieValue, SESSION_COOKIE_NAME } from "@/lib/auth";
import { readJson } from "@/lib/localDb";
import { getBalance, getUserMovements } from "@/lib/clubLedger";
import { ClubContent } from "@/components/ClubContent";
import type { DemoOrder } from "@/lib/types";

export const metadata: Metadata = {
  title: "Club ALDARA",
  description: "1 punto por cada euro gastado. Sin economía inventada: los puntos se calculan sobre tus pedidos reales.",
};

export default async function ClubPage() {
  const cookieStore = await cookies();
  const user = readSessionCookieValue(cookieStore.get(SESSION_COOKIE_NAME)?.value);

  let spent = 0;
  let orderCount = 0;
  let points = 0;
  let movements: Array<{ id: string; type: string; points: number; reason: string; timestamp: string }> = [];
  if (user) {
    const orders = await readJson<DemoOrder[]>("orders.json", []);
    const mine = orders.filter((o) => o.email.toLowerCase() === user.email.toLowerCase());
    spent = mine.reduce((sum, o) => sum + o.total, 0);
    orderCount = mine.length;
    // Saldo real: suma de movimientos del ledger (earn/redeem/adjustment),
    // no una resta frágil derivada de orders.json en cada render.
    points = await getBalance(user.email);
    movements = (await getUserMovements(user.email)).slice(-10).reverse();
  }

  return <ClubContent isAuthenticated={!!user} spent={spent} orderCount={orderCount} points={points} movements={movements} />;
}
