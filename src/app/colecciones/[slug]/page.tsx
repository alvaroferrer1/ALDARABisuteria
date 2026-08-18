import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllCollections, getCollectionBySlug } from "@/lib/collections";
import { PRODUCTS } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";
import { ProductLightField } from "@/components/ProductPlate";
import { CollectionHero } from "@/components/CollectionHero";
import { CollectionValueProps } from "@/components/CollectionValueProps";
import { Reveal } from "@/components/Reveal";

export function generateStaticParams() {
  return getAllCollections().map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/colecciones/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const collection = getCollectionBySlug(slug);
  if (!collection) return {};
  return { title: collection.name, description: collection.description };
}

export default async function CollectionPage({ params }: PageProps<"/colecciones/[slug]">) {
  const { slug } = await params;
  const collection = getCollectionBySlug(slug);
  if (!collection) notFound();

  const products = PRODUCTS.filter((p) => collection.productIds.includes(p.id));
  const collectionIndex = getAllCollections().findIndex((c) => c.slug === collection.slug);
  const imageOnRight = collectionIndex % 2 === 1;
  const storyProduct = products[0] ?? PRODUCTS[0];

  return (
    <>
      <CollectionHero collection={collection} />
      <CollectionValueProps />

      {/* Bloque editorial (relato/significado) — antes cada colección era solo
          hero + grid + footer, sin el "relato" que pide la ficha del PDF
          (p.21: nombre, tagline, foto, significado). Composición asimétrica
          foto/texto que alterna de lado según la colección para que las 6
          fichas no se sientan repetidas entre sí. */}
      <section className="border-b border-line bg-surface-2">
        <div className={`mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:py-24`}>
          <div className={imageOnRight ? "lg:order-2" : ""}>
            <Reveal>
              <div className="relative aspect-4/5 overflow-hidden rounded-3xl">
                <ProductLightField product={storyProduct} hue={collectionIndex} />
              </div>
            </Reveal>
          </div>
          <div className={imageOnRight ? "lg:order-1" : ""}>
            <Reveal delayMs={80}>
              <p className="mb-3 text-xs font-bold uppercase tracking-widest" style={{ color: collection.color }}>
                La historia
              </p>
              <h2 className="font-display text-3xl font-semibold sm:text-4xl">{collection.tagline}</h2>
              <p className="mt-5 text-lg leading-relaxed text-ink-soft">{collection.story}</p>
            </Reveal>
          </div>
        </div>
      </section>

      <section id="piezas" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <p className="mx-auto mb-8 max-w-xl text-center text-ink-soft">{collection.description}</p>
        <p className="mb-6 text-center text-xs font-semibold uppercase tracking-widest text-ink-soft">
          {products.length} {products.length === 1 ? "pieza" : "piezas"}
        </p>
        <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* CTA de cierre — enlaza a las otras 5 colecciones para no dejar la
          página como un callejón sin salida tras ver 2 piezas. */}
      <section className="border-t border-line bg-surface-2 px-4 py-16 text-center sm:px-6">
        <p className="mb-3 text-xs font-bold uppercase tracking-widest text-terracotta">Sigue explorando</p>
        <h2 className="font-display text-2xl font-semibold sm:text-3xl">Cada colección tiene su propia identidad</h2>
        <Link
          href="/colecciones"
          className="mt-6 inline-block rounded-full bg-ink px-7 py-3.5 font-semibold text-ivory transition-transform hover:-translate-y-0.5"
        >
          Ver todas las colecciones
        </Link>
      </section>
    </>
  );
}
