import Link from "next/link";
import { CATEGORY_LABELS } from "@/lib/products";
import type { ProductCategory } from "@/lib/types";

const ALL: Array<ProductCategory | "todos"> = ["todos", "pendientes", "pulseras", "colgantes", "charms"];

export function CategoryFilters({ current, query }: { current: string; query: string }) {
  return (
    <div className="mb-6 flex flex-wrap justify-center gap-2.5" role="tablist" aria-label="Filtrar catálogo">
      {ALL.map((cat) => {
        const params = new URLSearchParams();
        if (cat !== "todos") params.set("categoria", cat);
        if (query) params.set("q", query);
        const href = params.toString() ? `/shop?${params.toString()}` : "/shop";
        const active = current === cat;
        return (
          <Link
            key={cat}
            href={href}
            role="tab"
            aria-selected={active}
            className={`rounded-full border px-5 py-2.5 text-sm font-medium transition-colors ${
              active ? "border-ink bg-ink text-ivory" : "border-line hover:border-ink"
            }`}
          >
            {cat === "todos" ? "Todos" : CATEGORY_LABELS[cat]}
          </Link>
        );
      })}
    </div>
  );
}
