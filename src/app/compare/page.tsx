"use client";

import Link from "next/link";
import { useCompare } from "@/lib/compareStore";
import { getProductById, CATEGORY_LABELS } from "@/lib/products";
import { ProductPlate } from "@/components/ProductPlate";
import { AddToCartButton } from "@/components/AddToCartButton";
import { money } from "@/lib/storage";
import { useTranslations } from "@/lib/i18n/localeStore";
import type { Dictionary } from "@/lib/i18n/dictionaries";

function buildRows(t: Dictionary): Array<{ label: string; render: (p: NonNullable<ReturnType<typeof getProductById>>) => React.ReactNode }> {
  return [
    { label: t.misc.compareRowPrice, render: (p) => money(p.price) },
    { label: t.misc.compareRowCategory, render: (p) => CATEGORY_LABELS[p.category] },
    { label: t.misc.compareRowMaterials, render: (p) => p.materials },
    { label: t.misc.compareRowStock, render: (p) => (p.stock > 0 ? `${p.stock} ${t.misc.compareRowStockAvailable}` : t.misc.compareRowStockOut) },
    { label: t.misc.compareRowCare, render: (p) => p.care },
  ];
}

export default function ComparePage() {
  const { items, removeItem, clearAll } = useCompare();
  const { t } = useTranslations();
  const products = items.map((id) => getProductById(id)).filter((p): p is NonNullable<typeof p> => Boolean(p));
  const rows = buildRows(t);

  return (
    <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <p className="mb-2 text-xs font-bold uppercase tracking-widest text-terracotta">{t.misc.compareEyebrow}</p>
      <h1 className="mb-8 font-display text-3xl font-semibold sm:text-4xl">{t.misc.compareTitle}</h1>

      {products.length === 0 ? (
        <div className="rounded-2xl bg-surface-2 p-10 text-center">
          <p className="text-ink-soft">{t.misc.compareEmptyTitle}</p>
          <p className="mt-1 text-sm text-ink-soft">{t.misc.compareEmptySubtitle}</p>
          <Link href="/shop" className="mt-5 inline-block rounded-full bg-ink px-6 py-3 font-semibold text-ivory">
            {t.misc.compareGoToCatalog}
          </Link>
        </div>
      ) : (
        <>
          <div className="mb-4 flex justify-end">
            <button type="button" onClick={clearAll} className="text-sm text-ink-soft hover:text-terracotta">
              {t.misc.compareClearAll}
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] border-collapse text-left text-sm">
              <thead>
                <tr>
                  <th className="w-32"></th>
                  {products.map((p) => (
                    <th key={p.id} className="px-3 pb-4 align-bottom">
                      <button
                        type="button"
                        onClick={() => removeItem(p.id)}
                        aria-label={`Quitar ${p.name} del comparador`}
                        className="mb-2 ml-auto block text-xs text-ink-soft hover:text-terracotta"
                      >
                        {t.misc.compareRemove}
                      </button>
                      <Link href={`/producto/${p.slug}`}>
                        <ProductPlate product={p} className="aspect-square rounded-xl" />
                      </Link>
                      <Link href={`/producto/${p.slug}`} className="mt-2 block font-display text-base font-semibold hover:text-terracotta">
                        {p.name}
                      </Link>
                      <div className="mt-2">
                        <AddToCartButton productId={p.id} productName={p.name} />
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.label} className="border-t border-line">
                    <td className="py-4 pr-3 align-top text-xs font-bold uppercase tracking-widest text-ink-soft">{row.label}</td>
                    {products.map((p) => (
                      <td key={p.id} className="px-3 py-4 align-top text-ink-soft">
                        {row.render(p)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </section>
  );
}
