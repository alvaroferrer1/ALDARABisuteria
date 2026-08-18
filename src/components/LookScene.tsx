"use client";

import { useState } from "react";
import Link from "next/link";
import type { Look } from "@/lib/looks";
import { PRODUCTS, CATEGORY_LABELS } from "@/lib/products";
import { getAllCollections } from "@/lib/collections";
import { ProductVisual } from "./ProductVisual";
import { money } from "@/lib/storage";
import { AddToCartButton } from "./AddToCartButton";
import { useCart } from "@/context/CartContext";
import { useSavedLooks } from "@/lib/savedLooks";
import { PhotoSlot } from "./PhotoSlot";

/**
 * Escena de look "shoppable" — GENERATED_DEMO (silueta editorial vectorial,
 * no fotografía real, ver ASSET_REGISTRY.md). El color de la escena y del
 * halo ambiental viene de la colección real con el mismo nombre que el
 * `mood` del look (debe coincidir con el nombre real de una colección de
 * lib/collections.ts), no es decoración suelta.
 */
export function LookScene({ look }: { look: Look }) {
  const [active, setActive] = useState<string | null>(null);
  const [boughtAll, setBoughtAll] = useState(false);
  const activeProduct = active ? PRODUCTS.find((p) => p.id === active) : null;
  const { addItem } = useCart();
  const { isSaved, toggle } = useSavedLooks();
  const saved = isSaved(look.slug);

  const collection = getAllCollections().find((c) => c.name === look.mood);
  const accent = collection?.color ?? "var(--terracotta)";

  const products = look.hotspots.map((h) => PRODUCTS.find((p) => p.id === h.productId)).filter((p): p is (typeof PRODUCTS)[number] => Boolean(p));
  const availableProducts = products.filter((p) => p.stock > 0);
  const total = availableProducts.reduce((sum, p) => sum + p.price, 0);
  const hasUnavailable = availableProducts.length < products.length;

  function buyWholeLook() {
    availableProducts.forEach((p) => addItem(p.id, 1));
    setBoughtAll(true);
    window.setTimeout(() => setBoughtAll(false), 1600);
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr]">
      <div
        className="relative aspect-3/4 overflow-hidden rounded-3xl"
        style={{ background: `radial-gradient(120% 90% at 50% 0%, color-mix(in srgb, ${accent} 20%, var(--surface)) 0%, var(--surface-2) 75%)` }}
      >
        <span
          className="motion-safe:animate-[aldara-drift_12s_ease-in-out_infinite] absolute -left-16 top-0 h-56 w-56 rounded-full opacity-30 blur-3xl"
          style={{ background: accent }}
          aria-hidden="true"
        />
        <PhotoSlot
          name={`lookbook-${look.slug}`}
          alt={look.title}
          fallback={
            <svg viewBox="0 0 300 400" className="relative h-full w-full opacity-70" aria-hidden="true">
              <path
                d="M150 40c-30 0-45 25-45 55 0 20 8 35 8 35s-38 20-45 60c-8 45 0 150 0 150h164s8-105 0-150c-7-40-45-60-45-60s8-15 8-35c0-30-15-55-45-55Z"
                fill="none"
                stroke={accent}
                strokeWidth="1.5"
                opacity="0.45"
              />
            </svg>
          }
        />
        {look.hotspots.map((h) => {
          const product = PRODUCTS.find((p) => p.id === h.productId);
          if (!product) return null;
          const isActive = active === h.productId;
          return (
            <button
              key={h.productId}
              type="button"
              onClick={() => setActive(h.productId)}
              style={{ left: `${h.x}%`, top: `${h.y}%` }}
              aria-label={`Ver ${product.name}`}
              className="absolute -translate-x-1/2 -translate-y-1/2"
            >
              {!isActive && (
                <span
                  className="motion-safe:animate-ping absolute inset-0 rounded-full opacity-60"
                  style={{ backgroundColor: accent }}
                  aria-hidden="true"
                />
              )}
              <span
                className={`relative flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-bold shadow-lg transition-transform hover:scale-110 ${
                  isActive ? "border-terracotta bg-terracotta text-white" : "bg-white/90 text-ink"
                }`}
                style={!isActive ? { borderColor: accent } : undefined}
              >
                +
              </span>
            </button>
          );
        })}
      </div>

      <div>
        <div className="flex items-start justify-between gap-3">
          <h2 className="font-display text-2xl font-semibold">{look.title}</h2>
          <button
            type="button"
            onClick={() => toggle(look.slug)}
            aria-pressed={saved}
            className={`flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-semibold ${
              saved ? "border-terracotta bg-terracotta/10 text-terracotta" : "border-line text-ink-soft"
            }`}
          >
            {saved ? "♥ Guardado" : "♡ Guardar look"}
          </button>
        </div>
        <p className="mt-2 text-ink-soft">{look.description}</p>

        {activeProduct ? (
          <div className="mt-6 flex gap-4 rounded-2xl border border-line p-4">
            <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-xl bg-surface-2">
              <ProductVisual product={activeProduct} size={44} />
            </div>
            <div className="flex-1">
              <span className="text-xs font-bold uppercase text-terracotta">{CATEGORY_LABELS[activeProduct.category]}</span>
              <Link href={`/producto/${activeProduct.slug}`} className="block font-semibold">
                {activeProduct.name}
              </Link>
              <p className="text-sm text-ink-soft">{money(activeProduct.price)}</p>
              <div className="mt-2">
                <AddToCartButton productId={activeProduct.id} productName={activeProduct.name} variant="full" />
              </div>
            </div>
          </div>
        ) : (
          <p className="mt-6 text-sm text-ink-soft">Toca los puntos &ldquo;+&rdquo; sobre la escena para ver cada pieza.</p>
        )}

        <h3 className="mt-8 mb-3 text-sm font-semibold uppercase tracking-wide text-ink-soft">Piezas del look</h3>
        <ul className="flex flex-col gap-2">
          {look.hotspots.map((h) => {
            const product = PRODUCTS.find((p) => p.id === h.productId);
            if (!product) return null;
            return (
              <li key={h.productId}>
                <button
                  type="button"
                  onClick={() => setActive(h.productId)}
                  className="flex w-full items-center justify-between rounded-lg border border-line px-4 py-2.5 text-sm hover:border-ink"
                >
                  <span>
                    {product.name}
                    {product.stock === 0 && <span className="ml-2 text-xs font-semibold text-terracotta">Agotado</span>}
                  </span>
                  <span className="text-ink-soft">{money(product.price)}</span>
                </button>
              </li>
            );
          })}
        </ul>

        <div className="mt-6 flex items-center justify-between border-t border-line pt-4">
          <span className="font-semibold">Total del look</span>
          <span className="font-display text-xl font-semibold">{money(total)}</span>
        </div>
        {hasUnavailable && (
          <p className="mt-1 text-xs text-ink-soft">Una pieza está agotada — el total y la compra solo incluyen las piezas disponibles.</p>
        )}
        <button
          type="button"
          onClick={buyWholeLook}
          className="mt-4 w-full rounded-full px-6 py-3.5 font-semibold text-white transition-transform hover:-translate-y-0.5"
          style={{ backgroundColor: accent }}
        >
          {boughtAll ? "Look añadido a la cesta ✓" : "Comprar el look completo"}
        </button>
      </div>
    </div>
  );
}
