import Link from "next/link";
import type { Metadata } from "next";
import { getAllEdits } from "@/lib/edits";
import { getProductById } from "@/lib/products";
import { EditCover } from "@/components/EditCover";
import { Reveal } from "@/components/Reveal";
import { PhotoSlot } from "@/components/PhotoSlot";

export const metadata: Metadata = {
  title: "The Edit",
  description: "Curación editorial de ALDARA: pocas piezas, una razón clara para cada una. No es una colección, es una opinión.",
};

/**
 * THE EDIT — se trata como una publicación con números de entrega (Nº 01,
 * Nº 02...), no como una categoría más de producto. Layout tipo índice de
 * revista: portada de la última entrega + lista numerada de anteriores,
 * deliberadamente distinto del grid de Colecciones y de las imágenes con
 * hotspots del Lookbook.
 */
export default function EditIndexPage() {
  const edits = getAllEdits();
  const [latest, ...rest] = edits;
  const cover = latest ? getProductById(latest.picks[0]?.productId) : undefined;

  return (
    <>
      <section className="border-b border-line px-4 pb-6 pt-24 text-center sm:px-6">
        <div className="relative mx-auto mb-8 aspect-4/5 max-w-xs overflow-hidden rounded-3xl">
          <PhotoSlot name="the-edit-hero" alt="" fallback={<div className="absolute inset-0 bg-surface-2" />} />
        </div>
        <p className="mb-3 text-xs font-bold uppercase tracking-widest text-terracotta">The Edit</p>
        <h1 className="mx-auto max-w-2xl font-display text-4xl font-semibold sm:text-5xl">
          No todo el catálogo merece la portada
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-ink-soft">
          Cada entrega es una selección pequeña y con opinión, firmada por el equipo ALDARA. Sin filtros de talla ni de
          precio — solo las piezas que elegiríamos nosotras.
        </p>
      </section>

      {latest && (
        <section className="border-b border-line px-4 py-14 sm:px-6">
          <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-2 md:items-center">
            <Reveal>
              <p className="mb-2 font-display text-sm italic text-terracotta">Última entrega · {latest.issue}</p>
              <h2 className="font-display text-3xl font-semibold sm:text-4xl">{latest.title}</h2>
              <p className="mt-4 text-ink-soft">{latest.standfirst}</p>
              <p className="mt-6 text-xs uppercase tracking-widest text-ink-soft">{latest.byline}</p>
              <Link
                href={`/edit/${latest.slug}`}
                className="mt-6 inline-block rounded-full bg-ink px-7 py-3.5 font-semibold text-ivory hover:-translate-y-0.5 transition-transform"
              >
                Leer la entrega →
              </Link>
            </Reveal>
            {cover && (
              <Reveal delayMs={150}>
                <Link href={`/edit/${latest.slug}`}>
                  <EditCover product={cover} issue={latest.issue} />
                </Link>
              </Reveal>
            )}
          </div>
        </section>
      )}

      <section className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
        <h2 className="mb-8 font-display text-xl font-semibold">Entregas anteriores</h2>
        <ol className="flex flex-col">
          {rest.map((edit, i) => (
            <Reveal key={edit.slug} delayMs={i * 80}>
              <Link
                href={`/edit/${edit.slug}`}
                className="group flex items-center justify-between gap-6 border-b border-line py-6 hover:border-terracotta"
              >
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-terracotta">{edit.issue}</p>
                  <p className="mt-1 font-display text-xl font-semibold group-hover:text-terracotta">{edit.title}</p>
                  <p className="mt-1 max-w-md text-sm text-ink-soft">{edit.standfirst}</p>
                </div>
                <span className="shrink-0 text-2xl text-ink-soft transition-transform group-hover:translate-x-1 group-hover:text-terracotta">
                  →
                </span>
              </Link>
            </Reveal>
          ))}
        </ol>
      </section>
    </>
  );
}
