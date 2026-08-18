"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useTranslations } from "@/lib/i18n/localeStore";

export function PackAddButton({ productIds, label = "Añadir" }: { productIds: string[]; label?: string }) {
  const { addItem } = useCart();
  const [justAdded, setJustAdded] = useState(false);
  const { t } = useTranslations();

  return (
    <button
      type="button"
      onClick={() => {
        productIds.forEach((id) => addItem(id));
        setJustAdded(true);
        window.setTimeout(() => setJustAdded(false), 1400);
      }}
      className="rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-ivory transition-transform hover:-translate-y-0.5"
    >
      {justAdded ? t.common.added : label}
    </button>
  );
}
