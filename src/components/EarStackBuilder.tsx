"use client";

import { useState } from "react";
import Link from "next/link";
import { PRODUCTS } from "@/lib/products";
import { ProductVisual } from "./ProductVisual";
import { money } from "@/lib/storage";
import { useCart } from "@/context/CartContext";
import { useTranslations } from "@/lib/i18n/localeStore";

const EARRINGS = PRODUCTS.filter((p) => p.category === "pendientes");

export function EarStackBuilder() {
  const { t } = useTranslations();
  const SLOTS = [t.styleLab.lobe, t.styleLab.secondHole, t.styleLab.helix];
  const [picks, setPicks] = useState<(string | null)[]>([EARRINGS[0]?.id ?? null, null, null]);
  const [dragOverSlot, setDragOverSlot] = useState<number | null>(null);
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const chosen = picks.map((id) => EARRINGS.find((p) => p.id === id)).filter((p): p is (typeof EARRINGS)[number] => Boolean(p));
  const total = chosen.reduce((sum, p) => sum + p.price, 0);

  function addAllToCart() {
    chosen.forEach((p) => addItem(p.id, 1));
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1600);
  }

  function assign(slotIndex: number, productId: string | null) {
    setPicks((prev) => prev.map((v, idx) => (idx === slotIndex ? productId : v)));
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr]">
      <div className="rounded-3xl bg-surface-2 p-8">
        <p className="mb-6 text-xs font-bold uppercase tracking-wide text-ink-soft">{t.styleLab.yourCombo}</p>
        <div className="flex flex-col gap-4">
          {SLOTS.map((slot, i) => {
            const product = picks[i] ? EARRINGS.find((p) => p.id === picks[i]) : undefined;
            return (
              <div
                key={slot}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOverSlot(i);
                }}
                onDragLeave={() => setDragOverSlot((s) => (s === i ? null : s))}
                onDrop={(e) => {
                  e.preventDefault();
                  const productId = e.dataTransfer.getData("text/plain");
                  if (productId) assign(i, productId);
                  setDragOverSlot(null);
                }}
                className={`flex items-center gap-4 rounded-2xl bg-ivory p-4 outline-dashed transition-colors ${
                  dragOverSlot === i ? "outline-2 outline-terracotta" : "outline-0"
                }`}
              >
                <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl bg-surface-2">
                  {product ? <ProductVisual product={product} size={36} /> : <span className="text-xs text-ink-soft">—</span>}
                </div>
                <div className="flex-1">
                  <p className="text-xs font-semibold uppercase text-ink-soft">{slot}</p>
                  <p className="text-sm font-medium">{product ? product.name : t.styleLab.dropHere}</p>
                </div>
                {product && <span className="text-sm text-ink-soft">{money(product.price)}</span>}
              </div>
            );
          })}
        </div>
        <div className="mt-6 flex items-center justify-between border-t border-line pt-4">
          <span className="font-semibold">{t.styleLab.total}</span>
          <span className="font-display text-xl font-semibold">{money(total)}</span>
        </div>
        <button
          type="button"
          onClick={addAllToCart}
          disabled={chosen.length === 0}
          className="mt-4 w-full rounded-full bg-ink px-6 py-3.5 font-semibold text-ivory transition-transform hover:-translate-y-0.5 disabled:opacity-40"
        >
          {added ? t.styleLab.added : t.styleLab.addCombo}
        </button>
      </div>

      <div>
        {SLOTS.map((slot, i) => (
          <div key={slot} className="mb-8">
            <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-ink-soft">{slot}</p>
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
              <button
                type="button"
                onClick={() => setPicks((prev) => prev.map((v, idx) => (idx === i ? null : v)))}
                className={`flex h-20 items-center justify-center rounded-xl border text-xs text-ink-soft ${
                  picks[i] === null ? "border-ink" : "border-line"
                }`}
              >
                {t.styleLab.none}
              </button>
              {EARRINGS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  draggable
                  onDragStart={(e) => e.dataTransfer.setData("text/plain", p.id)}
                  onClick={() => assign(i, p.id)}
                  aria-label={`Poner ${p.name} en ${slot.toLowerCase()}`}
                  className={`flex h-20 cursor-grab flex-col items-center justify-center gap-1 rounded-xl border bg-surface-2 active:cursor-grabbing ${
                    picks[i] === p.id ? "border-ink" : "border-line"
                  }`}
                >
                  <ProductVisual product={p} size={28} />
                  <span className="text-[10px] text-ink-soft">{money(p.price)}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
        <p className="text-sm text-ink-soft">
          {t.styleLab.footerNotePre}{" "}
          <Link href="/shop?categoria=pendientes" className="underline">
            {t.styleLab.footerNoteLink}
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
