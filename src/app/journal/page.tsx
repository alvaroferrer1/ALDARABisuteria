import Link from "next/link";
import type { Metadata } from "next";
import { getAllPosts, JOURNAL_CATEGORY_COLORS, readingTimeMinutes } from "@/lib/journal";
import { JournalPlate } from "@/components/JournalPlate";
import { Reveal } from "@/components/Reveal";
import { JournalHero, JournalMoreStoriesHeading } from "@/components/JournalChrome";

export const metadata: Metadata = {
  title: "Journal",
  description: "Styling, materiales, regalos e historias detrás de ALDARA — revista, no un blog de SEO.",
};

/**
 * Portada de revista: número de portada + artículo destacado a toda página
 * (título superpuesto sobre el plate, no texto+imagen en dos columnas
 * planas) + el resto agrupado por sección, no una lista cronológica plana.
 * Gate B: "revista, no blog" — diferencia real frente a la versión anterior
 * (ul con divide-y).
 */
export default function JournalIndexPage() {
  const posts = getAllPosts().slice().sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));
  const [featured, ...rest] = posts;

  return (
    <>
      <JournalHero />

      {featured && (
        <section className="border-b border-line px-4 py-10 sm:px-6">
          <Link href={`/journal/${featured.slug}`} className="group mx-auto block max-w-5xl">
            <div className="relative overflow-hidden rounded-3xl">
              <JournalPlate category={featured.category} slug={featured.slug} className="aspect-video rounded-3xl sm:aspect-21/9" />
              <div className="absolute inset-0 flex flex-col justify-end bg-linear-to-t from-black/70 via-black/10 to-transparent p-6 sm:p-10">
                <span
                  className="mb-2 w-fit rounded-full px-3 py-1 text-xs font-bold uppercase tracking-widest text-white"
                  style={{ backgroundColor: JOURNAL_CATEGORY_COLORS[featured.category] ?? "var(--terracotta)" }}
                >
                  {featured.category}
                </span>
                <h2 className="max-w-2xl font-display text-2xl font-semibold text-white group-hover:underline sm:text-4xl">
                  {featured.title}
                </h2>
                <p className="mt-2 max-w-xl text-sm text-white/80 sm:text-base">{featured.excerpt}</p>
                <p className="mt-2 text-xs text-white/60">{readingTimeMinutes(featured)} min de lectura</p>
              </div>
            </div>
          </Link>
        </section>
      )}

      <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
        <JournalMoreStoriesHeading />
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((post, i) => (
            <Reveal key={post.slug} delayMs={i * 80}>
              <Link href={`/journal/${post.slug}`} className="group block">
                <div className="relative">
                  <JournalPlate category={post.category} slug={post.slug} className="aspect-4/3 rounded-2xl transition-transform group-hover:scale-[1.02]" />
                  <span
                    className="absolute left-3 top-3 rounded-full px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-widest text-white"
                    style={{ backgroundColor: JOURNAL_CATEGORY_COLORS[post.category] ?? "var(--terracotta)" }}
                  >
                    {post.category}
                  </span>
                </div>
                <h3 className="mt-3 font-display text-lg font-semibold group-hover:text-terracotta">{post.title}</h3>
                <p className="mt-1 text-sm text-ink-soft">{post.excerpt}</p>
                <p className="mt-1.5 text-xs text-ink-soft">{readingTimeMinutes(post)} min de lectura</p>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </>
  );
}
