import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { readSessionCookieValue, SESSION_COOKIE_NAME } from "@/lib/auth";
import { readJson } from "@/lib/localDb";
import { money } from "@/lib/storage";
import { getProductById } from "@/lib/products";
import { OrderActions } from "@/components/OrderActions";
import type { DemoOrder } from "@/lib/types";

export const metadata: Metadata = { title: "Detalle del pedido", robots: { index: false, follow: true } };

export default async function OrderDetailPage({ params }: PageProps<"/account/pedidos/[id]">) {
  const { id } = await params;
  const cookieStore = await cookies();
  const user = readSessionCookieValue(cookieStore.get(SESSION_COOKIE_NAME)?.value);
  if (!user) redirect("/account");

  const orders = await readJson<DemoOrder[]>("orders.json", []);
  const order = orders.find((o) => o.id === id);
  // Solo el dueño real del pedido puede verlo — nunca por id públicamente.
  if (!order || order.email.toLowerCase() !== user.email.toLowerCase()) notFound();

  return (
    <section className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <Link href="/account" className="print:hidden mb-6 inline-block text-sm text-ink-soft hover:text-terracotta">
        ← Mi cuenta
      </Link>
      {/* Cabecera de recibo — visible solo al imprimir/guardar como PDF, para
          que el documento resultante se identifique como ALDARA sin
          depender del header del sitio (oculto en impresión). */}
      <p className="mb-1 hidden font-display text-xl font-semibold print:block">ALDARA</p>
      <p className="mb-2 text-xs font-bold uppercase tracking-widest text-terracotta">Pedido</p>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-2">
        <h1 className="font-display text-3xl font-semibold">#{order.id.slice(0, 8)}</h1>
        <span className="rounded-full bg-surface-2 px-3 py-1 text-xs font-semibold uppercase text-ink-soft">{order.status}</span>
      </div>
      <p className="mb-8 text-sm text-ink-soft">
        {new Date(order.createdAt).toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" })}
      </p>

      <OrderActions order={order} />

      <h2 className="mb-3 font-semibold">Piezas</h2>
      <div className="mb-8 flex flex-col divide-y divide-line rounded-2xl border border-line">
        {order.items.map((item, i) => {
          const product = getProductById(item.productId) ?? undefined;
          const href = product ? `/producto/${product.slug}` : undefined;
          return (
            <div key={i} className="flex items-center justify-between gap-3 p-4">
              <div>
                {href ? (
                  <Link href={href} className="font-medium hover:text-terracotta">
                    {item.name}
                  </Link>
                ) : (
                  <span className="font-medium">{item.name}</span>
                )}
                <p className="text-xs text-ink-soft">×{item.quantity}</p>
              </div>
              <p className="font-medium">{money(item.price * item.quantity)}</p>
            </div>
          );
        })}
        <div className="flex items-center justify-between p-4">
          <p className="font-semibold">Total</p>
          <p className="font-display text-lg font-semibold">{money(order.total)}</p>
        </div>
      </div>

      <h2 className="mb-3 font-semibold">Dirección de envío</h2>
      <div className="rounded-2xl border border-line p-4 text-sm text-ink-soft">
        <p className="font-medium text-ink">{order.address.fullName}</p>
        <p>{order.address.street}</p>
        <p>
          {order.address.postalCode} {order.address.city}, {order.address.province}
        </p>
        <p>{order.address.country}</p>
        <p className="mt-1">{order.address.phone}</p>
      </div>
    </section>
  );
}
