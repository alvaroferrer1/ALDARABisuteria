"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useTransition } from "react";
import { SHOP_MATERIALS, SHOP_MATERIAL_LABELS, type ShopMaterial } from "@/lib/products";
import { PhotoSlot } from "@/components/PhotoSlot";

const MAX_PRICE_CEILING = 25;
const TINTS: Array<{ value: 0 | 1 | 2; label: string; swatch: string }> = [
  { value: 0, label: "Dorado cálido", swatch: "var(--gold)" },
  { value: 1, label: "Terracota", swatch: "var(--terracotta)" },
  { value: 2, label: "Azul noche", swatch: "var(--blue)" },
];

/**
 * Filtros de Material y Precio en barra lateral — calcado del mockup de
 * /shop (p.14 del PDF de propuesta), que muestra "MATERIAL" y "PRECIO"
 * como filtros reales de sidebar, no solo categoría. Antes el catálogo
 * solo filtraba por categoría/búsqueda/orden — gap real encontrado en la
 * auditoría visual contra el mockup.
 */
export function ShopSidebarFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const selectedMaterials = (searchParams.get("material")?.split(",").filter(Boolean) ?? []) as ShopMaterial[];
  const maxPrice = searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : MAX_PRICE_CEILING;
  const selectedTints = (searchParams.get("color")?.split(",").filter(Boolean).map(Number) ?? []) as Array<0 | 1 | 2>;
  const hasActiveFilters = selectedMaterials.length > 0 || selectedTints.length > 0 || maxPrice < MAX_PRICE_CEILING;

  function toggleTint(v: 0 | 1 | 2) {
    const params = new URLSearchParams(searchParams.toString());
    const next = selectedTints.includes(v) ? selectedTints.filter((x) => x !== v) : [...selectedTints, v];
    if (next.length > 0) params.set("color", next.join(","));
    else params.delete("color");
    startTransition(() => router.push(`${pathname}?${params.toString()}`, { scroll: false }));
  }

  function clearAll() {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("material");
    params.delete("color");
    params.delete("maxPrice");
    startTransition(() => router.push(`${pathname}?${params.toString()}`, { scroll: false }));
  }

  function toggleMaterial(m: ShopMaterial) {
    const params = new URLSearchParams(searchParams.toString());
    const next = selectedMaterials.includes(m) ? selectedMaterials.filter((x) => x !== m) : [...selectedMaterials, m];
    if (next.length > 0) params.set("material", next.join(","));
    else params.delete("material");
    startTransition(() => router.push(`${pathname}?${params.toString()}`, { scroll: false }));
  }

  function updateMaxPrice(value: number) {
    const params = new URLSearchParams(searchParams.toString());
    if (value < MAX_PRICE_CEILING) params.set("maxPrice", String(value));
    else params.delete("maxPrice");
    startTransition(() => router.push(`${pathname}?${params.toString()}`, { scroll: false }));
  }

  return (
    <div className="flex flex-col gap-6">
      {hasActiveFilters && (
        <button type="button" onClick={clearAll} className="self-start text-xs font-semibold text-terracotta hover:underline">
          Limpiar todo
        </button>
      )}
      <div>
        <p className="mb-3 text-xs font-bold uppercase tracking-widest text-ink-soft">Color</p>
        <div className="flex gap-2">
          {TINTS.map((t) => (
            <button
              key={t.value}
              type="button"
              onClick={() => toggleTint(t.value)}
              aria-pressed={selectedTints.includes(t.value)}
              aria-label={t.label}
              title={t.label}
              className={`h-8 w-8 rounded-full border-2 ${selectedTints.includes(t.value) ? "border-ink" : "border-transparent"}`}
              style={{ backgroundColor: t.swatch }}
            />
          ))}
        </div>
      </div>
      <div>
        <p className="mb-3 text-xs font-bold uppercase tracking-widest text-ink-soft">Material</p>
        <div className="flex flex-col gap-2">
          {SHOP_MATERIALS.map((m) => (
            <label key={m} className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={selectedMaterials.includes(m)} onChange={() => toggleMaterial(m)} className="h-4 w-4 accent-ink" />
              {SHOP_MATERIAL_LABELS[m]}
            </label>
          ))}
        </div>
      </div>
      <div>
        <p className="mb-3 text-xs font-bold uppercase tracking-widest text-ink-soft">Precio</p>
        <input
          type="range"
          min={5}
          max={MAX_PRICE_CEILING}
          value={maxPrice}
          onChange={(e) => updateMaxPrice(Number(e.target.value))}
          aria-label="Precio máximo"
          className="w-full accent-ink"
        />
        <p className="mt-1 text-sm text-ink-soft">Hasta {maxPrice} €</p>
      </div>

      {/* Tarjeta "Hechas a mano" al pie de la barra de filtros — calcada del
          mockup de /shop (p.14), que cierra la sidebar con esta tarjeta en
          vez de dejarla acabar en el slider de precio. */}
      <div className="overflow-hidden rounded-2xl border border-line bg-surface-2">
        <div className="relative aspect-4/3">
          <PhotoSlot
            name="shop-handmade-card"
            alt=""
            fallback={
              <div className="flex h-full items-center justify-center bg-surface-3">
                <svg viewBox="0 0 24 24" width="28" className="text-terracotta" aria-hidden="true">
                  <path
                    d="M12 21s-7-4.35-9.5-8.5C1 9.5 2.5 6 6 6c2 0 3.5 1.2 4.5 2.6C11.5 7.2 13 6 15 6c3.5 0 5 3.5 3.5 6.5C16 16.65 12 21 12 21Z"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            }
          />
        </div>
        <div className="p-4">
          <p className="text-sm font-semibold">Hechas a mano</p>
          <p className="mt-1 text-xs text-ink-soft">Cada pieza está elaborada con dedicación por artesanas locales.</p>
          <a href="/atelier" className="mt-2 inline-block text-xs font-semibold text-terracotta hover:underline">
            Descubre más →
          </a>
        </div>
      </div>
    </div>
  );
}
