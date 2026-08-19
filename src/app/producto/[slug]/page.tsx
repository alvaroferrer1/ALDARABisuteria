import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllProducts, getProductBySlug, getRelatedProducts, CATEGORY_LABELS } from "@/lib/products";
import { getAllCollections } from "@/lib/collections";
import { getAllLooks } from "@/lib/looks";
import { ProductGallery } from "@/components/ProductGallery";
import { PdpActions } from "@/components/PdpActions";
import { ProductCard } from "@/components/ProductCard";
import { Price } from "@/components/Price";
import { Badge } from "@/components/Badge";
import { RecentlyViewedTracker } from "@/components/RecentlyViewedTracker";
import { RecentlyViewedRail } from "@/components/RecentlyViewedRail";
import { StarRating } from "@/components/StarRating";
import { getRatingFor } from "@/lib/reviews";
import {
  PdpBreadcrumb,
  PdpAccordion,
  PdpLookSection,
  PdpCollectionSection,
  PdpYouMayAlsoLike,
  PdpHandmadeBadge,
  PdpTrustRow,
  PdpWornGallery,
} from "@/components/PdpTranslated";

export function generateStaticParams() {
  return getAllProducts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/producto/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return {};
  return {
    title: product.name,
    description: product.description,
    openGraph: { title: product.name, description: product.description },
  };
}

export default async function ProductPage({ params }: PageProps<"/producto/[slug]">) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const related = getRelatedProducts(product);
  const ownCollection = getAllCollections().find((c) => c.productIds.includes(product.id));
  const ownLook = getAllLooks().find((l) => l.hotspots.some((h) => h.productId === product.id));
  const rating = getRatingFor(product.id);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    category: CATEGORY_LABELS[product.category],
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "EUR",
      availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    },
    // Solo se declara si el producto tiene valoraciones DEMO reales en
    // lib/reviews.ts (nunca una cifra inventada al vuelo) — mismos números
    // ya visibles en la propia página, no un dato oculto distinto.
    ...(rating ? { aggregateRating: { "@type": "AggregateRating", ratingValue: rating.rating, reviewCount: rating.count } } : {}),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <RecentlyViewedTracker productId={product.id} />

      <PdpBreadcrumb categoryLabel={CATEGORY_LABELS[product.category]} />

      <section className="mx-auto grid max-w-6xl gap-12 px-4 py-10 sm:px-6 md:grid-cols-2">
        <ProductGallery product={product} />

        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap gap-2">
            <PdpHandmadeBadge />
            {product.badges?.map((b) => <Badge key={b} type={b} />)}
          </div>
          <span className="text-xs font-bold uppercase tracking-widest text-terracotta">{CATEGORY_LABELS[product.category]}</span>
          <h1 className="font-display text-3xl font-semibold sm:text-4xl">{product.name}</h1>
          {rating && (
            <div className="flex items-center gap-1.5 text-sm text-ink-soft">
              <StarRating rating={rating.rating} />
              <span className="font-semibold text-ink">{rating.rating}</span>
              <span>
                ({rating.count} reseñas <span className="text-xs">· demo</span>)
              </span>
            </div>
          )}
          <Price price={product.price} compareAtPrice={product.compareAtPrice} />
          <p className="text-ink-soft">{product.description}</p>

          <PdpActions productId={product.id} productName={product.name} stock={product.stock} price={product.price} productSlug={product.slug} />
          <PdpTrustRow />

          {/* Acordeones — estructura calcada de ALDARA_Propuesta_Cliente_FINAL_v2.pdf p.19 (PDP) */}
          <PdpAccordion
            story={product.story}
            materials={product.materials}
            care={product.care}
            categoryLabel={CATEGORY_LABELS[product.category]}
            stock={product.stock}
          />
        </div>
      </section>

      <PdpWornGallery productSlug={product.slug} tint={product.tint} />

      {ownLook && <PdpLookSection lookSlug={ownLook.slug} description={ownLook.description} />}

      {ownCollection && (
        <PdpCollectionSection
          collectionSlug={ownCollection.slug}
          collectionName={ownCollection.name}
          tagline={ownCollection.tagline}
          description={ownCollection.description}
          color={ownCollection.color}
        />
      )}

      {related.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 pb-24 pt-14 sm:px-6">
          <PdpYouMayAlsoLike />
          <div className="grid gap-7 pb-16 sm:grid-cols-2 lg:grid-cols-4 lg:pb-0">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      <RecentlyViewedRail excludeId={product.id} />
    </>
  );
}
