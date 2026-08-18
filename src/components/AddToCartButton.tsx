"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useTranslations } from "@/lib/i18n/localeStore";

export function AddToCartButton({
  productId,
  productName,
  quantity = 1,
  variant = "icon",
}: {
  productId: string;
  productName: string;
  quantity?: number;
  variant?: "icon" | "full";
}) {
  const { addItem } = useCart();
  const [justAdded, setJustAdded] = useState(false);
  const { t } = useTranslations();

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(productId, quantity);
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1400);
  };

  if (variant === "full") {
    return (
      <button
        type="button"
        onClick={handleAdd}
        className="w-full rounded-full bg-ink px-6 py-3.5 font-semibold text-ivory transition-transform hover:-translate-y-0.5 hover:shadow-lg"
      >
        {justAdded ? t.common.added : t.common.addToCart}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleAdd}
      aria-label={`${t.common.addToCart} — ${productName}`}
      className="flex h-9 w-9 items-center justify-center rounded-full bg-ink text-ivory transition-transform hover:scale-110"
    >
      {justAdded ? "✓" : "+"}
    </button>
  );
}
