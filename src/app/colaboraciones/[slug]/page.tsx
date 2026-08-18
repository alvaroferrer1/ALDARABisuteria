import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { COLLABORATIONS, getCollaborationBySlug } from "@/lib/collaborations";
import { PRODUCTS } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";
import { DemoPhoto } from "@/components/DemoPhoto";

export function generateStaticParams() {
  return COLLABORATIONS.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/colaboraciones/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const collab = getCollaborationBySlug(slug);
  if (!collab) return {};
  return { title: collab.title, description: collab.description };
}

export default async function ColaboracionPage({ params }: PageProps<"/colaboraciones/[slug]">) {
  const { slug } = await params;
  const collab = getCollaborationBySlug(slug);
  if (!collab) notFound();

  const products = PRODUCTS.filter((p) => collab.productIds.includes(p.id));

  return (
    <>
      <section className="relative overflow-hidden">
        <div className="relative aspect-auto min-h-100 w-full sm:aspect-21/9 sm:min-h-0 lg:aspect-21/8">
          <DemoPhoto seed={collab.slug} tone={collab.tone} />
          <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" aria-hidden="true" />
          <span className="absolute left-4 top-4 rounded-full bg-black/50 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-white sm:left-8 sm:top-8">
            Colaboración demo
          </span>
          <div className="relative z-10 flex h-full flex-col justify-end px-4 pb-10 sm:px-8 lg:px-16">
            <p className="text-xs font-bold uppercase tracking-widest text-[#e3c665]">{collab.year}</p>
            <h1 className="mt-2 max-w-lg font-display text-4xl font-semibold text-white sm:text-5xl">{collab.title}</h1>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-14 text-center sm:px-6">
        <p className="text-ink-soft">{collab.description}</p>
      </section>

      {products.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
          <p className="mb-6 text-center text-xs font-bold uppercase tracking-widest text-ink-soft">Piezas de esta colaboración</p>
          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
