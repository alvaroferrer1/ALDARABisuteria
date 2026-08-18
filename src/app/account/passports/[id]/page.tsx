import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import { readSessionCookieValue, SESSION_COOKIE_NAME } from "@/lib/auth";
import { readJson } from "@/lib/localDb";
import { getProductById } from "@/lib/products";
import { getAllCollections } from "@/lib/collections";
import { LIMITED_EDITIONS } from "@/lib/limitedEditions";
import { ProductPlate } from "@/components/ProductPlate";
import { PassportQR } from "@/components/PassportQR";
import { PassportChrome } from "@/components/AccountMoreChrome";
import { money } from "@/lib/storage";
import type { DemoOrder } from "@/lib/types";

export const metadata: Metadata = { title: "Pasaporte de pieza", robots: { index: false, follow: true } };

export default async function ProductPassportPage({ params }: PageProps<"/account/passports/[id]">) {
  const { id } = await params;
  const cookieStore = await cookies();
  const user = readSessionCookieValue(cookieStore.get(SESSION_COOKIE_NAME)?.value);
  if (!user) redirect("/account");

  const product = getProductById(id);
  if (!product) notFound();

  const orders = await readJson<DemoOrder[]>("orders.json", []);
  const ownOrders = orders
    .filter((o) => o.email.toLowerCase() === user.email.toLowerCase())
    .filter((o) => o.items.some((i) => i.productId === id));

  // Solo se muestra el pasaporte de una pieza que este usuario realmente compró — no es una página pública por id.
  if (ownOrders.length === 0) notFound();

  const firstPurchase = ownOrders.reduce((earliest, o) => (o.createdAt < earliest ? o.createdAt : earliest), ownOrders[0].createdAt);
  const collection = getAllCollections().find((c) => c.productIds.includes(product.id));

  // "Referencia interna" honesta y determinista — NO un número de serie
  // verificado por nadie (eso sería inventar un dato de confianza falso).
  // Se construye a partir de datos reales ya existentes (slug + pedido),
  // nunca de un contador aleatorio nuevo.
  const firstOrder = ownOrders.find((o) => o.createdAt === firstPurchase) ?? ownOrders[0];
  const reference = `ALD-${product.slug.slice(0, 3).toUpperCase()}-${firstOrder.id.slice(-6).toUpperCase()}`;

  const limitedEdition = LIMITED_EDITIONS.find((le) => le.productId === product.id);

  return (
    <section className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <div className="mb-8 overflow-hidden rounded-3xl border border-line">
        <ProductPlate product={product} className="aspect-4/3 rounded-none" iconSize={150} />
      </div>
      <PassportChrome
        productName={product.name}
        productSlug={product.slug}
        purchasedAt={firstPurchase}
        pricePaid={money(product.price)}
        materials={product.materials}
        variant={product.materials.split("·")[0]?.trim() ?? product.materials}
        reference={reference}
        limitedEdition={limitedEdition ? { claimed: limitedEdition.claimed, size: limitedEdition.editionSize } : undefined}
        collection={collection ? { name: collection.name, href: `/colecciones/${collection.slug}` } : undefined}
        story={product.story}
        care={product.care}
        qrSlot={<PassportQR path={`/account/passports/${product.id}`} />}
      />
    </section>
  );
}
