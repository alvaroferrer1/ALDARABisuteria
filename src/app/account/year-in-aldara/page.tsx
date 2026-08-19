import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { readSessionCookieValue, SESSION_COOKIE_NAME } from "@/lib/auth";
import { readJson } from "@/lib/localDb";
import { PRODUCTS, CATEGORY_LABELS } from "@/lib/products";
import { money } from "@/lib/storage";
import type { DemoOrder } from "@/lib/types";
import { PhotoSlot } from "@/components/PhotoSlot";

export const metadata: Metadata = { title: "Year in ALDARA", robots: { index: false, follow: true } };

const YEAR = new Date().getFullYear();

/**
 * "Year in ALDARA" (Bloque 8, #95) — recap anual privado y opcional (solo
 * visible para la propia usuaria en su cuenta), construido con datos 100%
 * reales de sus propios pedidos — nada de estadísticas globales inventadas
 * ni comparativas con otras personas. Si no hay pedidos este año, se dice
 * honestamente en vez de fabricar un recap vacío.
 */
export default async function YearInAldaraPage() {
  const cookieStore = await cookies();
  const user = readSessionCookieValue(cookieStore.get(SESSION_COOKIE_NAME)?.value);
  if (!user) redirect("/account");

  const orders = await readJson<DemoOrder[]>("orders.json", []);
  const myOrders = orders.filter((o) => o.email.toLowerCase() === user.email.toLowerCase() && new Date(o.createdAt).getFullYear() === YEAR);

  const itemCounts = new Map<string, number>();
  let totalPieces = 0;
  let totalSpent = 0;
  for (const order of myOrders) {
    totalSpent += order.total;
    for (const item of order.items) {
      totalPieces += item.quantity;
      itemCounts.set(item.productId, (itemCounts.get(item.productId) ?? 0) + item.quantity);
    }
  }

  const categoryCounts = new Map<string, number>();
  for (const [productId, qty] of itemCounts) {
    const product = PRODUCTS.find((p) => p.id === productId);
    if (!product) continue;
    categoryCounts.set(product.category, (categoryCounts.get(product.category) ?? 0) + qty);
  }
  const topCategory = [...categoryCounts.entries()].sort((a, b) => b[1] - a[1])[0];

  const favoriteProduct = [...itemCounts.entries()].sort((a, b) => b[1] - a[1])[0];
  const favoriteProductData = favoriteProduct ? PRODUCTS.find((p) => p.id === favoriteProduct[0]) : undefined;

  return (
    <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <Link href="/account" className="mb-6 inline-block text-sm text-ink-soft hover:text-terracotta">
        ← Mi cuenta
      </Link>
      <div className="relative mb-8 aspect-21/9 overflow-hidden rounded-3xl">
        <PhotoSlot name="year-in-aldara" alt="" fallback={<div className="absolute inset-0 bg-surface-2" />} />
      </div>
      <p className="mb-2 text-xs font-bold uppercase tracking-widest text-terracotta">Recap privado</p>
      <h1 className="font-display text-4xl font-semibold sm:text-5xl">Tu {YEAR} en ALDARA</h1>
      <p className="mt-3 max-w-lg text-ink-soft">
        Solo tú puedes ver esto — un resumen honesto de tus propios pedidos este año, sin comparativas ni rankings con nadie más.
      </p>

      {myOrders.length === 0 ? (
        <div className="mt-10 rounded-2xl bg-surface-2 p-10 text-center">
          <p className="text-ink-soft">Todavía no has hecho ningún pedido en {YEAR}. Cuando lo hagas, aquí aparecerá tu recap.</p>
          <Link href="/shop" className="mt-5 inline-block rounded-full bg-ink px-6 py-3 font-semibold text-ivory">
            Explorar el catálogo
          </Link>
        </div>
      ) : (
        <>
          <div className="mt-10 grid gap-5 sm:grid-cols-3">
            <div className="rounded-2xl border border-line p-6 text-center">
              <p className="font-display text-4xl font-semibold text-terracotta">{myOrders.length}</p>
              <p className="mt-1 text-sm text-ink-soft">{myOrders.length === 1 ? "pedido" : "pedidos"}</p>
            </div>
            <div className="rounded-2xl border border-line p-6 text-center">
              <p className="font-display text-4xl font-semibold text-terracotta">{totalPieces}</p>
              <p className="mt-1 text-sm text-ink-soft">{totalPieces === 1 ? "pieza" : "piezas"}</p>
            </div>
            <div className="rounded-2xl border border-line p-6 text-center">
              <p className="font-display text-4xl font-semibold text-terracotta">{money(totalSpent)}</p>
              <p className="mt-1 text-sm text-ink-soft">invertido en ti</p>
            </div>
          </div>

          {topCategory && (
            <div className="mt-6 rounded-2xl bg-surface-2 p-6 text-center">
              <p className="text-sm text-ink-soft">Tu categoría del año</p>
              <p className="mt-1 font-display text-2xl font-semibold">{CATEGORY_LABELS[topCategory[0] as keyof typeof CATEGORY_LABELS]}</p>
            </div>
          )}

          {favoriteProductData && (
            <div className="mt-6 rounded-2xl border border-line p-6 text-center">
              <p className="text-sm text-ink-soft">La pieza que más pediste</p>
              <p className="mt-1 font-display text-2xl font-semibold">{favoriteProductData.name}</p>
              <Link href={`/producto/${favoriteProductData.slug}`} className="mt-2 inline-block text-sm font-semibold text-terracotta">
                Ver pieza →
              </Link>
            </div>
          )}

          <p className="mt-8 text-center text-xs text-ink-soft">
            Recap generado a partir de tus pedidos reales registrados en {YEAR}. No se comparte con nadie ni se usa para nada más.
          </p>
        </>
      )}
    </section>
  );
}
