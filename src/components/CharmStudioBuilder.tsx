"use client";

import { useState } from "react";
import Link from "next/link";
import { PRODUCTS } from "@/lib/products";
import { ProductVisual } from "./ProductVisual";
import { money } from "@/lib/storage";
import { useCart } from "@/context/CartContext";
import { useTranslations } from "@/lib/i18n/localeStore";

const CHARMS = PRODUCTS.filter((p) => p.category === "charms");
// La cadena base es real (categoría pulseras) — el charm studio compone cadena + charms reales, no un producto inventado.
const CHAINS = PRODUCTS.filter((p) => p.category === "pulseras").slice(0, 3);
const POSITIONS = [0, 1, 2, 3] as const;

export function CharmStudioBuilder() {
  const { t } = useTranslations();
  const [chainId, setChainId] = useState<string | null>(CHAINS[0]?.id ?? null);
  const [slots, setSlots] = useState<(string | null)[]>([null, null, null, null]);
  const [dragOverSlot, setDragOverSlot] = useState<number | null>(null);
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const chain = CHAINS.find((c) => c.id === chainId);
  const chosenCharms = slots.map((id) => CHARMS.find((p) => p.id === id)).filter((p): p is (typeof CHARMS)[number] => Boolean(p));
  const total = (chain?.price ?? 0) + chosenCharms.reduce((sum, p) => sum + p.price, 0);

  function assign(slotIndex: number, productId: string | null) {
    setSlots((prev) => prev.map((v, idx) => (idx === slotIndex ? productId : v)));
  }

  function addComposition() {
    if (chain) addItem(chain.id, 1);
    chosenCharms.forEach((p) => addItem(p.id, 1));
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1600);
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr]">
      <div className="rounded-3xl bg-surface-2 p-8">
        <p className="mb-4 text-xs font-bold uppercase tracking-wide text-ink-soft">{t.charmStudio.step1}</p>
        <div className="mb-6 grid grid-cols-3 gap-3">
          {CHAINS.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setChainId(c.id)}
              className={`flex h-16 flex-col items-center justify-center gap-1 rounded-xl border bg-ivory ${
                chainId === c.id ? "border-ink" : "border-line"
              }`}
            >
              <ProductVisual product={c} size={24} />
              <span className="text-[10px] text-ink-soft">{money(c.price)}</span>
            </button>
          ))}
        </div>

        <p className="mb-4 text-xs font-bold uppercase tracking-wide text-ink-soft">{t.charmStudio.step2}</p>
        <div className="flex flex-col gap-3">
          {POSITIONS.map((pos, i) => {
            const product = slots[i] ? CHARMS.find((p) => p.id === slots[i]) : undefined;
            return (
              <div
                key={pos}
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
                className={`flex items-center gap-4 rounded-2xl bg-ivory p-3.5 outline-dashed transition-colors ${
                  dragOverSlot === i ? "outline-2 outline-terracotta" : "outline-0"
                }`}
              >
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-surface-2">
                  {product ? <ProductVisual product={product} size={30} /> : <span className="text-xs text-ink-soft">{i + 1}</span>}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{product ? product.name : t.charmStudio.empty}</p>
                </div>
                {product && (
                  <>
                    <span className="text-sm text-ink-soft">{money(product.price)}</span>
                    <button type="button" onClick={() => assign(i, null)} aria-label={t.charmStudio.removeCharm} className="text-ink-soft hover:text-terracotta">
                      ✕
                    </button>
                  </>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-6 flex items-center justify-between border-t border-line pt-4">
          <span className="font-semibold">{t.charmStudio.total}</span>
          <span className="font-display text-xl font-semibold">{money(total)}</span>
        </div>
        <button
          type="button"
          onClick={addComposition}
          disabled={!chain}
          className="mt-4 w-full rounded-full bg-ink px-6 py-3.5 font-semibold text-ivory transition-transform hover:-translate-y-0.5 disabled:opacity-40"
        >
          {added ? t.charmStudio.added : t.charmStudio.addComposition}
        </button>
      </div>

      <div>
        <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-ink-soft">{t.charmStudio.availableCharms}</p>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
          {CHARMS.map((p) => (
            <button
              key={p.id}
              type="button"
              draggable
              onDragStart={(e) => e.dataTransfer.setData("text/plain", p.id)}
              onClick={() => {
                const firstEmpty = slots.findIndex((s) => s === null);
                assign(firstEmpty === -1 ? 0 : firstEmpty, p.id);
              }}
              aria-label={`Añadir ${p.name} a la composición`}
              className="flex h-24 cursor-grab flex-col items-center justify-center gap-1.5 rounded-xl border border-line bg-surface-2 active:cursor-grabbing"
            >
              <ProductVisual product={p} size={32} />
              <span className="text-center text-[10px] leading-tight text-ink-soft">{p.name}</span>
              <span className="text-[10px] font-semibold text-terracotta">{money(p.price)}</span>
            </button>
          ))}
        </div>
        <p className="mt-6 text-sm text-ink-soft">
          {t.charmStudio.footerNotePre}{" "}
          <Link href="/shop?categoria=charms" className="underline">
            {t.charmStudio.footerNoteLink}
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
