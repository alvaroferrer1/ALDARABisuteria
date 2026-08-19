import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllPosts, getPostBySlug, JOURNAL_CATEGORY_COLORS, readingTimeMinutes } from "@/lib/journal";
import { ShareButton } from "@/components/ShareButton";
import { PRODUCTS } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";
import { JournalPlate } from "@/components/JournalPlate";

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/journal/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return { title: post.title, description: post.excerpt };
}

export default async function JournalPostPage({ params }: PageProps<"/journal/[slug]">) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const related = PRODUCTS.filter((p) => post.relatedProductIds.includes(p.id));
  const accent = JOURNAL_CATEGORY_COLORS[post.category] ?? "var(--terracotta)";
  const allPosts = getAllPosts();
  const more = allPosts.filter((p) => p.slug !== post.slug && p.category === post.category).slice(0, 2);
  // JSON-LD Article — metadata invisible para el usuario, no cambia nada
  // visual. Ampliado con author/mainEntityOfPage/image (antes solo tenía
  // headline/description/datePublished) para que el marcado sea más
  // completo; no garantiza rich results, eso lo decide Google, no el sitio.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    author: { "@type": "Organization", name: "ALDARA" },
    publisher: { "@type": "Organization", name: "ALDARA" },
    mainEntityOfPage: { "@type": "WebPage", "@id": `https://www.aldara.store/journal/${post.slug}` },
    image: "https://www.aldara.store/og-image.png",
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Apertura de revista: plate a toda página con categoría+título superpuestos, no un <h1> plano */}
      <section className="relative">
        <JournalPlate category={post.category} slug={post.slug} className="aspect-video rounded-none sm:aspect-21/9" />
        <div className="absolute inset-0 flex flex-col items-center justify-end bg-linear-to-t from-black/70 via-black/10 to-transparent px-4 pb-10 text-center sm:px-6">
          <span className="mb-3 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-widest text-white" style={{ backgroundColor: accent }}>
            {post.category}
          </span>
          <h1 className="max-w-2xl font-display text-3xl font-semibold text-white sm:text-5xl">{post.title}</h1>
          <p className="mt-3 text-sm text-white/75">
            {new Date(post.publishedAt).toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" })}
            {" · "}
            {readingTimeMinutes(post)} min de lectura
          </p>
        </div>
      </section>

      <article className="mx-auto max-w-2xl px-4 py-14 sm:px-6">
        <div className="mb-8 flex items-center justify-between">
          <Link href="/journal" className="text-sm text-ink-soft hover:text-terracotta">
            ← Journal
          </Link>
          <ShareButton title={post.title} />
        </div>
        <div className="flex flex-col gap-5 text-lg leading-relaxed text-ink-soft">
          {post.content.map((para, i) =>
            i === 0 ? (
              <p key={i} className="first-letter:float-left first-letter:mr-2 first-letter:font-display first-letter:text-6xl first-letter:font-semibold first-letter:leading-[0.85] first-letter:text-ink">
                {para}
              </p>
            ) : (
              <p key={i}>{para}</p>
            )
          )}
        </div>
      </article>

      {related.length > 0 && (
        <section className="mx-auto max-w-5xl px-4 pb-16 sm:px-6">
          <h2 className="mb-6 font-display text-xl font-semibold">Piezas de este artículo</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {more.length > 0 && (
        <section className="border-t border-line px-4 py-14 sm:px-6">
          <p className="mx-auto mb-6 max-w-5xl text-xs font-bold uppercase tracking-widest text-ink-soft">Más en {post.category}</p>
          <div className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-2">
            {more.map((p) => (
              <Link key={p.slug} href={`/journal/${p.slug}`} className="group">
                <JournalPlate category={p.category} slug={p.slug} className="aspect-4/3 rounded-2xl transition-transform group-hover:scale-[1.02]" />
                <h3 className="mt-3 font-display text-lg font-semibold group-hover:text-terracotta">{p.title}</h3>
              </Link>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
