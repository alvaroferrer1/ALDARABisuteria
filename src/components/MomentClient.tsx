"use client";

import { useState } from "react";
import Link from "next/link";
import type { Moment } from "@/lib/moments";
import type { Product } from "@/lib/types";
import { ProductVisual } from "./ProductVisual";
import { money } from "@/lib/storage";
import { useCart } from "@/context/CartContext";

/**
 * Panel de "outfit" — deliberadamente distinto del selector de Mood Shop
 * (pills + grid) y de los hotspots del Lookbook: lista de momentos a la
 * izquierda, combinación fija de piezas pensadas para llevarse juntas a la
 * derecha, con un único CTA para comprar el look completo (mismo patrón
 * de "comprar todo" que LookScene, pero el origen es una ocasión, no una
 * escena editorial).
 */
export function MomentClient({ moments, productsByMoment }: { moments: Moment[]; productsByMoment: Record<string, Product[]> }) {
  const [active, setActive] = useState(moments[0]?.slug ?? "");
  const moment = moments.find((m) => m.slug === active) ?? moments[0];
  const products = productsByMoment[active] ?? [];
  const availableProducts = products.filter((p) => p.stock > 0);
  const total = availableProducts.reduce((sum, p) => sum + p.price, 0);
  const hasUnavailable = availableProducts.length < products.length;
  const { addItem } = useCart();
  const [bought, setBought] = useState(false);

  function buyWholeMoment() {
    availableProducts.forEach((p) => addItem(p.id, 1));
    setBought(true);
    window.setTimeout(() => setBought(false), 1800);
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
      <ul className="flex flex-col gap-3">
        {moments.map((m) => (
          <li key={m.slug}>
            <button
              type="button"
              onClick={() => setActive(m.slug)}
              aria-pressed={active === m.slug}
              className={`w-full rounded-2xl border p-5 text-left transition-colors ${
                active === m.slug ? "border-terracotta bg-surface-2" : "border-line hover:border-ink"
              }`}
            >
              <p className="font-display text-xl font-semibold">{m.title}</p>
              <p className="mt-1.5 text-sm text-ink-soft">{m.context}</p>
            </button>
          </li>
        ))}
      </ul>

      {moment && (
        <div className="rounded-3xl bg-surface-2 p-6 sm:p-8">
          <p className="mb-1 text-xs font-bold uppercase tracking-widest text-terracotta">Para: {moment.title}</p>
          <p className="mb-6 text-ink-soft">{moment.stylingNote}</p>

          <div className="flex flex-col gap-3">
            {products.map((p, i) => (
              <div key={p.id} className="flex items-center gap-4 rounded-xl bg-surface p-3">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-surface-2">
                  <ProductVisual product={p} size={34} />
                </div>
                <div className="min-w-0 flex-1">
                  <Link href={`/producto/${p.slug}`} className="truncate font-medium hover:text-terracotta">
                    {p.name}
                  </Link>
                  <p className="text-sm text-ink-soft">
                    {money(p.price)}
                    {p.stock === 0 && <span className="ml-2 font-semibold text-terracotta">Agotado</span>}
                  </p>
                </div>
                {i < products.length - 1 && <span className="hidden shrink-0 text-ink-soft sm:block">+</span>}
              </div>
            ))}
          </div>

          <div className="mt-6 flex items-center justify-between border-t border-line pt-5">
            <div>
              <p className="text-xs uppercase tracking-widest text-ink-soft">Look completo</p>
              <p className="font-display text-2xl font-semibold">{money(total)}</p>
              {hasUnavailable && <p className="mt-1 text-xs text-ink-soft">Solo se compran las piezas disponibles.</p>}
            </div>
            <button
              type="button"
              onClick={buyWholeMoment}
              className="rounded-full bg-ink px-6 py-3 text-sm font-semibold text-ivory hover:-translate-y-0.5 transition-transform"
            >
              {bought ? "¡Añadido! ✓" : "Comprar el look completo"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
