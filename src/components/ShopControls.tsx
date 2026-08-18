"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, useTransition } from "react";

export function ShopControls() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("q") ?? "");
  const [, startTransition] = useTransition();

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    });
  };

  return (
    <div className="mb-8 flex flex-wrap items-center justify-center gap-3">
      <div className="flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-2.5">
        <svg viewBox="0 0 24 24" width="16" aria-hidden="true">
          <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="2" />
          <path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <input
          type="search"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            updateParam("q", e.target.value);
          }}
          placeholder="Buscar una pieza..."
          aria-label="Buscar en el catálogo"
          maxLength={60}
          className="w-40 border-none bg-transparent text-sm outline-none sm:w-56"
        />
      </div>
      <select
        aria-label="Ordenar catálogo"
        defaultValue={searchParams.get("orden") ?? "default"}
        onChange={(e) => updateParam("orden", e.target.value === "default" ? "" : e.target.value)}
        className="rounded-full border border-line bg-surface px-4 py-2.5 text-sm"
      >
        <option value="default">Orden sugerido</option>
        <option value="price-asc">Precio: menor a mayor</option>
        <option value="price-desc">Precio: mayor a menor</option>
        <option value="name">Nombre A-Z</option>
      </select>
    </div>
  );
}
