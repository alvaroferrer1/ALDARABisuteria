import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllEdits, getEditBySlug } from "@/lib/edits";
import { getProductById } from "@/lib/products";
import { ProductPlate } from "@/components/ProductPlate";
import { Reveal } from "@/components/Reveal";
import { money } from "@/lib/storage";

export function generateStaticParams() {
  return getAllEdits().map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: PageProps<"/edit/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const edit = getEditBySlug(slug);
  if (!edit) return {};
  return { title: `${edit.title} · The Edit`, description: edit.standfirst };
}

export default async function EditPage({ params }: PageProps<"/edit/[slug]">) {
  const { slug } = await params;
  const edit = getEditBySlug(slug);
  if (!edit) notFound();

  const picks = edit.picks.map((pick) => ({ ...pick, product: getProductById(pick.productId) })).filter((p) => p.product);

  return (
    <>
      <section className="border-b border-line px-4 pb-10 pt-24 text-center sm:px-6">
        <Link href="/edit" className="mb-6 inline-block text-sm text-ink-soft hover:text-terracotta">
          ← The Edit
        </Link>
        <p className="mb-3 text-xs font-bold uppercase tracking-widest text-terracotta">{edit.issue}</p>
        <h1 className="mx-auto max-w-2xl font-display text-4xl font-semibold sm:text-5xl">{edit.title}</h1>
        <p className="mx-auto mt-4 max-w-lg text-ink-soft">{edit.standfirst}</p>
        <p className="mt-4 text-xs uppercase tracking-widest text-ink-soft">
          {edit.byline} · {new Date(edit.publishedAt).toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" })}
        </p>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
        <ol className="flex flex-col gap-16">
          {picks.map((pick, i) => (
            <Reveal key={pick.productId} delayMs={i * 100}>
              <li className="grid gap-6 sm:grid-cols-[auto_1fr] sm:items-center">
                <div className="flex items-start gap-5 sm:contents">
                  <span className="font-display text-5xl font-semibold text-line sm:row-span-2">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <Link href={`/producto/${pick.product!.slug}`} className="w-32 shrink-0 sm:w-40">
                    <ProductPlate product={pick.product!} className="aspect-square rounded-xl" />
                  </Link>
                </div>
                <div>
                  <Link href={`/producto/${pick.product!.slug}`}>
                    <h2 className="font-display text-2xl font-semibold hover:text-terracotta">{pick.product!.name}</h2>
                  </Link>
                  <p className="mt-1 text-sm text-ink-soft">{money(pick.product!.price)}</p>
                  <p className="mt-3 max-w-md font-display text-lg italic text-ink">&ldquo;{pick.note}&rdquo;</p>
                  <Link
                    href={`/producto/${pick.product!.slug}`}
                    className="mt-4 inline-block text-sm font-semibold text-terracotta hover:underline"
                  >
                    Ver la pieza →
                  </Link>
                </div>
              </li>
            </Reveal>
          ))}
        </ol>
      </section>

      <section className="border-t border-line bg-surface-2 px-4 py-14 text-center sm:px-6">
        <p className="mb-4 font-display text-xl font-semibold">¿Buscas otra entrega?</p>
        <Link href="/edit" className="inline-block rounded-full border border-ink px-6 py-3 text-sm font-semibold hover:bg-ink hover:text-ivory">
          Ver todas las entregas de The Edit
        </Link>
      </section>
    </>
  );
}
