"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useTransition } from "react";
import { SHOP_MATERIAL_LABELS, type ShopMaterial } from "@/lib/products";

const TINT_LABELS: Record<number, string> = { 0: "Dorado cálido", 1: "Terracota", 2: "Azul noche" };

/**
 * Chips de filtros activos, removibles individualmente — antes solo existía
 * "Limpiar todo" en la sidebar, sin poder ver qué está activo sin abrirla
 * (POST_AUDIT_IMPROVEMENTS.md, bloque B). Mismo estado (searchParams) que
 * `ShopSidebarFilters`, así que quitar un chip aquí se refleja allí también.
 */
export function ShopActiveFilterChips() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const materials = (searchParams.get("material")?.split(",").filter(Boolean) ?? []) as ShopMaterial[];
  const tints = (searchParams.get("color")?.split(",").filter(Boolean).map(Number) ?? []) as number[];
  const maxPrice = searchParams.get("maxPrice");

  const chips: Array<{ key: string; label: string; onRemove: () => void }> = [
    ...materials.map((m) => ({
      key: `material-${m}`,
      label: SHOP_MATERIAL_LABELS[m],
      onRemove: () => updateParam("material", materials.filter((x) => x !== m).join(",")),
    })),
    ...tints.map((t) => ({
      key: `color-${t}`,
      label: TINT_LABELS[t] ?? "Color",
      onRemove: () => updateParam("color", tints.filter((x) => x !== t).join(",")),
    })),
    ...(maxPrice ? [{ key: "maxPrice", label: `Hasta ${maxPrice} €`, onRemove: () => updateParam("maxPrice", "") }] : []),
  ];

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    startTransition(() => router.push(`${pathname}?${params.toString()}`, { scroll: false }));
  }

  if (chips.length === 0) return null;

  return (
    <div className="mb-5 flex flex-wrap items-center gap-2">
      {chips.map((chip) => (
        <button
          key={chip.key}
          type="button"
          onClick={chip.onRemove}
          className="flex items-center gap-1.5 rounded-full border border-line bg-surface-2 px-3 py-1.5 text-xs font-semibold hover:border-terracotta"
        >
          {chip.label}
          <span aria-hidden="true">×</span>
        </button>
      ))}
    </div>
  );
}
