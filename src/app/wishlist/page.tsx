"use client";

import Link from "next/link";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { PRODUCTS } from "@/lib/products";
import { money } from "@/lib/storage";
import { ProductCard } from "@/components/ProductCard";
import { PhotoSlot } from "@/components/PhotoSlot";

export default function WishlistPage() {
  const { ids, snapshots, toggle } = useWishlist();
  const { addItem } = useCart();
  const items = PRODUCTS.filter((p) => ids.includes(p.id));
  const inStockCount = items.filter((p) => p.stock > 0).length;

  // "Mover todo al carrito" (POST_AUDIT_IMPROVEMENTS.md, bloque O): respeta
  // stock real — las piezas agotadas se omiten con aviso en vez de añadirlas
  // igualmente, y solo se quitan de favoritos las que sí se han movido.
  function moveAllToCart() {
    for (const p of items) {
      if (p.stock > 0) {
        addItem(p.id, 1);
        toggle(p.id);
      }
    }
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-3xl font-semibold sm:text-4xl">Tus favoritos</h1>
        {inStockCount > 0 && (
          <button type="button" onClick={moveAllToCart} className="rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-ivory hover:-translate-y-0.5 transition-transform">
            Mover {inStockCount === items.length ? "todo" : `${inStockCount}`} al carrito
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="mt-10 overflow-hidden rounded-2xl bg-surface-2 text-center">
          <div className="relative aspect-21/9">
            <PhotoSlot name="wishlist-empty" alt="" fallback={<div className="absolute inset-0 bg-surface-3" />} />
          </div>
          <div className="p-14">
            <p className="text-ink-soft">Todavía no has guardado ninguna pieza.</p>
            <Link href="/shop" className="mt-5 inline-block rounded-full bg-ink px-6 py-3 font-semibold text-ivory">
              Explorar el catálogo
            </Link>
          </div>
        </div>
      ) : (
        <div className="mt-8 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((product) => {
            const snapshot = snapshots[product.id];
            // Aviso real (POST_AUDIT_IMPROVEMENTS.md, bloque O): compara el
            // precio/stock de cuando se guardó la pieza contra el actual —
            // datos ya reales del catálogo, sin inventar nada. Solo se avisa
            // si de verdad ha cambiado, nunca de forma decorativa.
            const priceDropped = snapshot && product.price < snapshot.price;
            const justWentOutOfStock = snapshot && snapshot.stock > 0 && product.stock === 0;
            return (
              <div key={product.id}>
                {priceDropped && (
                  <p className="mb-1.5 inline-block rounded-full bg-terracotta/10 px-3 py-1 text-xs font-semibold text-terracotta">
                    Bajó de precio: {money(snapshot.price)} → {money(product.price)}
                  </p>
                )}
                {!priceDropped && justWentOutOfStock && (
                  <p className="mb-1.5 inline-block rounded-full bg-surface-2 px-3 py-1 text-xs font-semibold text-ink-soft">Se agotó desde que la guardaste</p>
                )}
                <ProductCard product={product} />
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
