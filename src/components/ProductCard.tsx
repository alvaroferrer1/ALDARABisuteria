import Link from "next/link";
import type { Product } from "@/lib/types";
import { ProductPlate } from "./ProductPlate";
import { Price } from "./Price";
import { Badge } from "./Badge";
import { WishlistButton } from "./WishlistButton";
import { CompareButton } from "./CompareButton";
import { AddToCartButton } from "./AddToCartButton";
import { CATEGORY_LABELS } from "@/lib/products";

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl bg-surface shadow-[0_1px_0_var(--line)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl">
      <Link href={`/producto/${product.slug}`} className="block">
        <div className="relative aspect-4/3 overflow-hidden">
          <ProductPlate product={product} className="absolute inset-0 rounded-none transition-transform duration-300 group-hover:scale-[1.04]" />
          {(product.stock === 0 || (product.badges && product.badges.length > 0)) && (
            <div className="absolute left-3 top-3 flex flex-col gap-1.5">
              {product.stock === 0 && (
                <span className="w-fit rounded-full bg-ink/85 px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-wide text-ivory backdrop-blur">
                  Agotado
                </span>
              )}
              {product.badges?.map((b) => (
                <Badge key={b} type={b} />
              ))}
            </div>
          )}
          <div className="absolute right-3 top-3 flex flex-col gap-2">
            <WishlistButton productId={product.id} productName={product.name} />
            <CompareButton productId={product.id} productName={product.name} />
          </div>
        </div>
      </Link>
      <div className="flex flex-1 flex-col gap-1.5 p-5">
        <span className="text-[0.7rem] font-bold uppercase tracking-wide text-terracotta">
          {CATEGORY_LABELS[product.category]}
        </span>
        <Link href={`/producto/${product.slug}`}>
          <h3 className="font-display text-lg font-semibold text-ink">{product.name}</h3>
        </Link>
        <p className="flex-1 text-sm text-ink-soft">{product.description}</p>
        <div className="mt-2 flex items-center justify-between">
          <Price price={product.price} compareAtPrice={product.compareAtPrice} />
          {product.stock > 0 ? (
            <AddToCartButton productId={product.id} productName={product.name} />
          ) : (
            <Link
              href={`/producto/${product.slug}#avisame`}
              className="rounded-full border border-line px-3 py-1.5 text-xs font-semibold text-ink-soft hover:border-terracotta hover:text-terracotta"
            >
              Avísame
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
