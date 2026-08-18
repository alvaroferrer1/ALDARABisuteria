"use client";

import { useCompare } from "@/lib/compareStore";

export function CompareButton({ productId, productName }: { productId: string; productName: string }) {
  const { has, addItem, removeItem, items } = useCompare();
  const active = has(productId);
  const atLimit = !active && items.length >= 4;

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if (atLimit) return;
        if (active) removeItem(productId);
        else addItem(productId);
      }}
      disabled={atLimit}
      aria-pressed={active}
      aria-label={`${active ? "Quitar" : "Añadir"} ${productName} ${active ? "del" : "al"} comparador`}
      title={atLimit ? "Ya tienes 4 piezas en el comparador" : undefined}
      className={`flex h-9 w-9 items-center justify-center rounded-full bg-white/85 backdrop-blur transition-transform hover:scale-110 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-black/40 ${
        active ? "text-blue" : "text-ink-soft"
      }`}
    >
      <svg viewBox="0 0 24 24" width="16" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M8 3v18M16 3v18M4 8h4M16 8h4M4 16h4M16 16h4" strokeLinecap="round" />
      </svg>
    </button>
  );
}
