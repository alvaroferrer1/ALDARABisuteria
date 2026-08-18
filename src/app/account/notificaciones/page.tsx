import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { readSessionCookieValue, SESSION_COOKIE_NAME } from "@/lib/auth";
import { readJson } from "@/lib/localDb";
import { getProductById } from "@/lib/products";
import { NotificationsClient } from "@/components/NotificationsClient";
import { NotificationsChrome } from "@/components/AccountMoreChrome";
import type { BackInStockRequest } from "@/app/api/back-in-stock/route";

export const metadata: Metadata = { title: "Notificaciones", robots: { index: false, follow: true } };

export default async function NotificationsPage() {
  const cookieStore = await cookies();
  const user = readSessionCookieValue(cookieStore.get(SESSION_COOKIE_NAME)?.value);
  if (!user) redirect("/account");

  const all = await readJson<BackInStockRequest[]>("back-in-stock-requests.json", []);
  const mine = all
    .filter((r) => r.email.toLowerCase() === user.email.toLowerCase())
    .map((r) => {
      const product = getProductById(r.productId);
      if (!product) return null;
      return { id: r.id, productId: r.productId, productName: product.name, productSlug: product.slug, createdAt: r.createdAt };
    })
    .filter((x): x is NonNullable<typeof x> => x !== null);

  return (
    <section className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <NotificationsChrome />
      <NotificationsClient initialItems={mine} email={user.email} />
    </section>
  );
}
