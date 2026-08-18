"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { PRODUCTS } from "@/lib/products";
import { money } from "@/lib/storage";
import { ProductVisual } from "@/components/ProductVisual";
import { ProductCard } from "@/components/ProductCard";
import { FreeShippingProgress } from "@/components/FreeShippingProgress";
import { whatsappHref } from "@/lib/whatsapp";

export default function CartPage() {
  const { lines, removeItem, setQuantity, totalPrice } = useCart();
  const inCartIds = new Set(lines.map((l) => l.productId));
  const crossSell = PRODUCTS.filter((p) => !inCartIds.has(p.id) && p.stock > 0).slice(0, 4);

  const buildWhatsappMessage = () => {
    const messageLines = ["Hola ALDARA, quiero hacer este pedido:"];
    lines.forEach((line) => {
      const product = PRODUCTS.find((p) => p.id === line.productId);
      if (!product) return;
      messageLines.push(`• ${line.quantity}x ${product.name} — ${money(product.price * line.quantity)}`);
    });
    messageLines.push(`Total: ${money(totalPrice)}`);
    return messageLines.join("\n");
  };

  return (
    <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <h1 className="font-display text-3xl font-semibold sm:text-4xl">Tu cesta</h1>

      {lines.length === 0 ? (
        <div className="mt-10 rounded-2xl bg-surface-2 p-14 text-center">
          <p className="text-ink-soft">Tu cesta está vacía todavía.</p>
          <Link href="/shop" className="mt-5 inline-block rounded-full bg-ink px-6 py-3 font-semibold text-ivory">
            Explorar el catálogo
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-10 md:grid-cols-[1fr_320px]">
          <ul className="flex flex-col divide-y divide-line">
            {lines.map((line) => {
              const product = PRODUCTS.find((p) => p.id === line.productId);
              if (!product) return null;
              return (
                <li key={line.productId} className="flex gap-4 py-5">
                  <Link href={`/producto/${product.slug}`} className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-xl bg-surface-2">
                    <ProductVisual product={product} size={44} />
                  </Link>
                  <div className="flex-1">
                    <Link href={`/producto/${product.slug}`} className="font-semibold">
                      {product.name}
                    </Link>
                    <p className="text-sm text-ink-soft">{money(product.price)} por unidad</p>
                    <div className="mt-2 flex items-center gap-2">
                      <button onClick={() => setQuantity(line.productId, line.quantity - 1)} aria-label="Restar unidad" className="h-7 w-7 rounded-full border border-line">
                        –
                      </button>
                      <span aria-live="polite" className="w-6 text-center">
                        {line.quantity}
                      </span>
                      <button onClick={() => setQuantity(line.productId, line.quantity + 1)} aria-label="Sumar unidad" className="h-7 w-7 rounded-full border border-line">
                        +
                      </button>
                      <button onClick={() => removeItem(line.productId)} className="ml-4 text-xs text-terracotta underline">
                        Quitar
                      </button>
                    </div>
                  </div>
                  <span className="font-semibold">{money(product.price * line.quantity)}</span>
                </li>
              );
            })}
          </ul>

          <aside className="h-fit rounded-2xl bg-surface-2 p-6">
            <FreeShippingProgress subtotal={totalPrice} />
            <div className="flex justify-between text-lg">
              <span>Total</span>
              <strong>{money(totalPrice)}</strong>
            </div>
            <p className="mt-2 text-xs text-ink-soft">Envío calculado al confirmar por WhatsApp.</p>
            <Link href="/checkout" className="mt-5 block rounded-full bg-ink px-6 py-3.5 text-center font-semibold text-ivory">
              Finalizar pedido
            </Link>
            <a
              href={whatsappHref(buildWhatsappMessage())}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 block rounded-full border border-line px-6 py-3 text-center text-sm font-semibold"
            >
              Consultar por WhatsApp
            </a>
          </aside>
        </div>
      )}

      {lines.length > 0 && crossSell.length > 0 && (
        <div className="mt-14">
          <p className="mb-5 text-sm font-semibold">Ideas que combinan contigo</p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {crossSell.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
