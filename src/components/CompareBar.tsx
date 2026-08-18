"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCompare } from "@/lib/compareStore";
import { getProductById } from "@/lib/products";

/**
 * Barra flotante — solo visible con al menos 2 piezas en el comparador, y
 * nunca en /compare (ahí se ve la tabla completa: mostrar la barra flotante
 * encima tapaba filas de la tabla — bug real detectado con captura visual).
 */
export function CompareBar() {
  const pathname = usePathname();
  const { items, clearAll } = useCompare();
  const products = items.map((id) => getProductById(id)).filter((p): p is NonNullable<typeof p> => Boolean(p));

  if (products.length < 2 || pathname === "/compare") return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface px-4 py-3 shadow-[0_-4px_16px_rgba(0,0,0,0.08)] sm:px-6">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
        <p className="text-sm font-semibold">
          {products.length} piezas para comparar <span className="hidden text-ink-soft sm:inline">— {products.map((p) => p.name).join(", ")}</span>
        </p>
        <div className="flex shrink-0 items-center gap-3">
          <button type="button" onClick={clearAll} className="text-sm text-ink-soft hover:text-terracotta">
            Vaciar
          </button>
          <Link href="/compare" className="rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-ivory">
            Comparar →
          </Link>
        </div>
      </div>
    </div>
  );
}
