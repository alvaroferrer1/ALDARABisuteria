"use client";

import { useState } from "react";
import Link from "next/link";

interface Item {
  id: string;
  productId: string;
  productName: string;
  productSlug: string;
  createdAt: string;
}

export function NotificationsClient({ initialItems, email }: { initialItems: Item[]; email: string }) {
  const [items, setItems] = useState(initialItems);

  async function handleRemove(id: string) {
    setItems((prev) => prev.filter((i) => i.id !== id));
    await fetch(`/api/back-in-stock?id=${id}&email=${encodeURIComponent(email)}`, { method: "DELETE" });
  }

  if (items.length === 0) {
    return (
      <div className="rounded-2xl bg-surface-2 p-8 text-center">
        <p className="text-ink-soft">No tienes avisos de disponibilidad activos.</p>
        <Link href="/shop" className="mt-3 inline-block text-sm font-semibold text-terracotta hover:underline">
          Ver catálogo →
        </Link>
      </div>
    );
  }

  return (
    <ul className="flex flex-col gap-3">
      {items.map((item) => (
        <li key={item.id} className="flex items-center justify-between gap-4 rounded-2xl border border-line p-4">
          <div>
            <Link href={`/producto/${item.productSlug}`} className="font-medium hover:text-terracotta">
              {item.productName}
            </Link>
            <p className="text-xs text-ink-soft">Te avisaremos cuando vuelva a haber stock.</p>
          </div>
          <button type="button" onClick={() => handleRemove(item.id)} className="shrink-0 text-sm text-ink-soft hover:text-terracotta">
            Cancelar aviso
          </button>
        </li>
      ))}
    </ul>
  );
}
