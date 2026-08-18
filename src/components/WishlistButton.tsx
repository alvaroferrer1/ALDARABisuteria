"use client";

import { useWishlist } from "@/context/WishlistContext";
import { Icon } from "./Icon";

export function WishlistButton({ productId, productName }: { productId: string; productName: string }) {
  const { has, toggle } = useWishlist();
  const active = has(productId);
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(productId);
      }}
      aria-pressed={active}
      aria-label={`${active ? "Quitar" : "Añadir"} ${productName} ${active ? "de" : "a"} favoritos`}
      className={`flex h-9 w-9 items-center justify-center rounded-full bg-white/85 backdrop-blur transition-transform hover:scale-110 dark:bg-black/40 ${
        active ? "text-terracotta" : "text-ink-soft"
      }`}
    >
      <Icon name="heart" size={18} filled={active} />
    </button>
  );
}
