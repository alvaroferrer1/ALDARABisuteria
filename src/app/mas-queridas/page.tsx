import Link from "next/link";
import type { Metadata } from "next";
import { PRODUCTS } from "@/lib/products";
import { PRODUCT_RATINGS, REVIEW_QUOTES, OVERALL_RATING } from "@/lib/reviews";
import { PACKS, getPackWithPricing } from "@/lib/packs";
import { ProductPlate } from "@/components/ProductPlate";
import { WishlistButton } from "@/components/WishlistButton";
import { PackAddButton } from "@/components/PackAddButton";
import { StarRating } from "@/components/StarRating";
import { money } from "@/lib/storage";

export const metadata: Metadata = {
  title: "Best Sellers / Más queridas",
  description: "Descubre las joyas que más eligen nuestras clientas — piezas con significado, hechas a mano y llenas de historias.",
};

const BADGES = [
  ["Hechas a mano", "Con amor y dedicación"],
  ["Culturas", "Que nos unen"],
  ["Calidad", "Para acompañarte siempre"],
];

/**
 * Best Sellers / Más queridas (Bloque 1, ref. 1.2) — calcada del mockup
 * p.13. Antes no construida porque el mockup muestra reseñas con nombre y
 * estrellas — ahora se reproduce con reseñas DEMO explícitas
 * (`lib/reviews.ts`, `isDemo: true`) en vez de fabricar clientas reales.
 * Productos y precios son reales del catálogo.
 */
export default function MasQueridasPage() {
  const bestsellers = PRODUCT_RATINGS.map((r) => ({ rating: r, product: PRODUCTS.find((p) => p.id === r.productId) })).filter(
    (x): x is { rating: (typeof PRODUCT_RATINGS)[number]; product: NonNullable<typeof x.product> } => !!x.product
  );

  return (
    <>
      <section className="px-4 pb-8 pt-24 text-center sm:px-6">
        <h1 className="font-display text-4xl font-semibold sm:text-5xl">
          Best Sellers / <em className="not-italic text-terracotta">Más queridas</em>
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-ink-soft">
          Descubre las joyas que más eligen nuestras clientas. Piezas con significado, hechas a mano y llenas de historias.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-x-8 gap-y-3">
          {BADGES.map(([title, sub]) => (
            <div key={title} className="text-left">
              <p className="text-sm font-semibold">{title}</p>
              <p className="text-xs text-ink-soft">{sub}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {bestsellers.map(({ product, rating }) => (
            <div key={product.id} className="group relative rounded-2xl border border-line p-3">
              <div className="absolute right-5 top-5 z-10">
                <WishlistButton productId={product.id} productName={product.name} />
              </div>
              <Link href={`/producto/${product.slug}`}>
                <ProductPlate product={product} className="aspect-square rounded-xl" />
                <p className="mt-3 font-semibold group-hover:text-terracotta">{product.name}</p>
                <p className="text-xs text-ink-soft">{product.description}</p>
                <div className="mt-2 flex items-center gap-1.5 text-xs text-ink-soft">
                  <StarRating rating={rating.rating} />
                  <span>({rating.count})</span>
                </div>
                <p className="mt-1.5 text-sm font-semibold">{money(product.price)}</p>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Nuestras clientas opinan (DEMO) */}
      <section className="bg-surface-2 px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-5xl">
          <div className="mb-8 text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-ink-soft">Nuestras clientas opinan</p>
            <p className="mt-2 flex items-center justify-center gap-2 font-display text-4xl font-semibold">
              {OVERALL_RATING.average} <StarRating rating={OVERALL_RATING.average} size={20} />
            </p>
            <p className="mt-1 text-xs text-ink-soft">Basado en {OVERALL_RATING.count} reseñas — demo</p>
          </div>
          <div className="grid gap-5 sm:grid-cols-3">
            {REVIEW_QUOTES.map((r) => (
              <div key={r.author} className="rounded-2xl bg-surface p-5">
                <StarRating rating={r.stars} />
                <p className="mt-2 text-sm italic text-ink-soft">&ldquo;{r.quote}&rdquo;</p>
                <p className="mt-2 text-xs font-semibold">
                  {r.author} <span className="font-normal text-ink-soft">· demo</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Packs que enamoran */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <p className="mb-1 text-sm font-semibold">Packs que enamoran</p>
        <p className="mb-6 text-sm text-ink-soft">El regalo perfecto, listo para emocionar.</p>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PACKS.map((pack) => {
            const p = getPackWithPricing(pack);
            return (
              <div key={pack.slug} className="rounded-2xl border border-line p-4">
                <div className="flex -space-x-3">
                  {p.products.slice(0, 2).map((prod) => (
                    <div key={prod.id} className="h-16 w-16 overflow-hidden rounded-xl border-2 border-surface bg-surface-2">
                      <ProductPlate product={prod} className="h-full w-full" />
                    </div>
                  ))}
                </div>
                <p className="mt-3 font-semibold">{p.name}</p>
                <p className="text-xs text-ink-soft">{p.sub}</p>
                <p className="mt-2 text-sm font-semibold">
                  {money(p.packPrice)} <span className="text-xs font-normal text-ink-soft line-through">{money(p.fullPrice)}</span>
                </p>
                <div className="mt-3">
                  <PackAddButton productIds={p.productIds} />
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}
