import type { Metadata } from "next";
import { EXHIBITION } from "@/lib/exhibitions";
import { PRODUCTS } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";
import { DemoPhoto } from "@/components/DemoPhoto";
import { Reveal } from "@/components/Reveal";
import { ExposicionesBadge } from "@/components/ExposicionesChrome";

export const metadata: Metadata = {
  title: "Exposiciones digitales",
  description: `${EXHIBITION.title} — una exposición digital de ALDARA sobre cultura, imagen y producto.`,
};

/**
 * Exposiciones digitales (Bloque 8, #93) — experiencia demo completa
 * ("Raíces que brillan", `lib/exhibitions.ts`), con scroll storytelling
 * real (`Reveal`) capítulo a capítulo, motion respetando reduced-motion.
 */
export default function ExposicionesPage() {
  return (
    <>
      <section className="relative overflow-hidden">
        <div className="relative aspect-auto min-h-115 w-full sm:aspect-21/9 sm:min-h-0 lg:aspect-21/8">
          <DemoPhoto seed="exposicion-hero" tone="var(--terracotta)" />
          <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/25 to-transparent" aria-hidden="true" />
          <ExposicionesBadge />
          <div className="relative z-10 flex h-full flex-col justify-end px-4 pb-10 sm:px-8 lg:px-16">
            <h1 className="max-w-lg font-display text-5xl font-semibold text-white sm:text-6xl">{EXHIBITION.title}</h1>
            <p className="mt-4 max-w-md text-white/85">{EXHIBITION.intro}</p>
          </div>
        </div>
      </section>

      {EXHIBITION.chapters.map((chapter, i) => {
        const chapterProducts = PRODUCTS.filter((p) => chapter.productIds.includes(p.id));
        return (
          <section key={chapter.number} className={i % 2 === 1 ? "bg-surface-2" : ""}>
            <Reveal className="mx-auto grid max-w-6xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:items-center">
              <div className={`relative aspect-4/3 overflow-hidden rounded-3xl ${i % 2 === 1 ? "lg:order-2" : ""}`}>
                <DemoPhoto seed={`exposicion-cap-${chapter.number}`} tone={chapter.tone} />
              </div>
              <div>
                <p className="mb-2 font-display text-5xl font-semibold" style={{ color: chapter.tone }}>
                  {chapter.number}
                </p>
                <h2 className="font-display text-3xl font-semibold">{chapter.title}</h2>
                <p className="mt-4 max-w-md text-ink-soft">{chapter.text}</p>
                {chapterProducts.length > 0 && (
                  <div className="mt-6 grid max-w-sm gap-4 sm:grid-cols-2">
                    {chapterProducts.map((p) => (
                      <ProductCard key={p.id} product={p} />
                    ))}
                  </div>
                )}
              </div>
            </Reveal>
          </section>
        );
      })}
    </>
  );
}
