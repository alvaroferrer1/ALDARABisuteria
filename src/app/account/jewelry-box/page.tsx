import { cookies } from "next/headers";
import Link from "next/link";
import type { Metadata } from "next";
import { readSessionCookieValue, SESSION_COOKIE_NAME, getUsers } from "@/lib/auth";
import { readJson } from "@/lib/localDb";
import { getProductById, getAllProducts, getRelatedProducts } from "@/lib/products";
import { getAllCollections } from "@/lib/collections";
import { getBalance } from "@/lib/clubLedger";
import { AuthForms } from "@/components/AuthForms";
import { ProductPlate } from "@/components/ProductPlate";
import { SavedLooksSection } from "@/components/SavedLooksSection";
import { JewelryBoxHeaderDashboard, JewelryBoxRecommendations } from "@/components/JewelryBoxDashboard";
import { JewelryBoxHeader, JewelryBoxEmpty, JewelryLoginPrompt, JewelryCareLabel, JewelryPassportLink, JewelryPassportNote } from "@/components/AccountMoreChrome";
import type { DemoOrder } from "@/lib/types";

export const metadata: Metadata = { title: "Mi joyero", robots: { index: false, follow: true } };

export default async function JewelryBoxPage() {
  const cookieStore = await cookies();
  const user = readSessionCookieValue(cookieStore.get(SESSION_COOKIE_NAME)?.value);

  if (!user) {
    return (
      <section className="mx-auto max-w-md px-4 py-20 sm:px-6">
        <JewelryLoginPrompt />
        <AuthForms />
      </section>
    );
  }

  const orders = await readJson<DemoOrder[]>("orders.json", []);
  const myOrders = orders.filter((o) => o.email.toLowerCase() === user.email.toLowerCase());

  // Piezas realmente compradas por este usuario, dedupe por producto, sumando unidades reales.
  const owned = new Map<string, { productId: string; quantity: number; lastOrderAt: string }>();
  for (const order of myOrders) {
    for (const item of order.items) {
      const existing = owned.get(item.productId);
      if (existing) {
        existing.quantity += item.quantity;
        if (order.createdAt > existing.lastOrderAt) existing.lastOrderAt = order.createdAt;
      } else {
        owned.set(item.productId, { productId: item.productId, quantity: item.quantity, lastOrderAt: order.createdAt });
      }
    }
  }

  const pieces = Array.from(owned.values())
    .map((entry) => {
      const product = getProductById(entry.productId);
      if (!product) return null;
      const collection = getAllCollections().find((c) => c.productIds.includes(product.id));
      return { ...entry, product, collection };
    })
    .filter((p): p is NonNullable<typeof p> => p !== null)
    .sort((a, b) => (a.lastOrderAt < b.lastOrderAt ? 1 : -1));

  // "Con nosotras desde" — fecha real de creación de cuenta si existe en
  // users.json (email/password), o el primer pedido si el usuario entró de
  // otra forma. Nunca una fecha inventada.
  const storedUser = (await getUsers()).find((u) => u.email.toLowerCase() === user.email.toLowerCase());
  const earliestOrder = myOrders.length > 0 ? myOrders.reduce((min, o) => (o.createdAt < min ? o.createdAt : min), myOrders[0].createdAt) : null;
  const memberSinceRaw = storedUser?.createdAt ?? earliestOrder ?? new Date().toISOString();
  const memberSince = new Date(memberSinceRaw).toLocaleDateString("es-ES", { month: "long", year: "numeric" });

  const points = await getBalance(user.email);

  // Recomendaciones reales — piezas de las mismas categorías ya compradas, que el usuario todavía no tiene.
  const ownedIds = new Set(pieces.map((p) => p.product.id));
  const ownedCategories = new Set(pieces.map((p) => p.product.category));
  const recommended =
    ownedCategories.size > 0
      ? getAllProducts()
          .filter((p) => ownedCategories.has(p.category) && !ownedIds.has(p.id))
          .slice(0, 3)
      : pieces[0]
        ? getRelatedProducts(pieces[0].product, 3)
        : [];

  return (
    <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <JewelryBoxHeader />

      {pieces.length > 0 && (
        <JewelryBoxHeaderDashboard userName={user.name} memberSince={memberSince} points={points} piecesCount={pieces.length} />
      )}

      {pieces.length === 0 ? (
        <JewelryBoxEmpty />
      ) : (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {pieces.map(({ product, quantity, collection }) => (
            <article key={product.id} className="overflow-hidden rounded-2xl border border-line bg-surface">
              <Link href={`/producto/${product.slug}`}>
                <ProductPlate product={product} className="aspect-square rounded-none" />
              </Link>
              <div className="flex flex-col gap-2 p-5">
                <div className="flex items-start justify-between gap-2">
                  <Link href={`/producto/${product.slug}`}>
                    <h2 className="font-display text-lg font-semibold text-ink">{product.name}</h2>
                  </Link>
                  {quantity > 1 && (
                    <span className="shrink-0 rounded-full bg-surface-2 px-2.5 py-1 text-xs font-semibold text-ink-soft">×{quantity}</span>
                  )}
                </div>
                {collection && (
                  <Link
                    href={`/colecciones/${collection.slug}`}
                    className="text-xs font-bold uppercase tracking-widest"
                    style={{ color: collection.color }}
                  >
                    Colección {collection.name}
                  </Link>
                )}
                <JewelryCareLabel care={product.care} />
                <JewelryPassportLink href={`/account/passports/${product.id}`} />
              </div>
            </article>
          ))}
        </div>
      )}

      <div className="mt-14 border-t border-line pt-8">
        <SavedLooksSection />
      </div>

      <JewelryBoxRecommendations recommended={recommended} allProducts={getAllProducts()} />

      <div className="mt-10 border-t border-line pt-8">
        <JewelryPassportNote />
      </div>
    </section>
  );
}
