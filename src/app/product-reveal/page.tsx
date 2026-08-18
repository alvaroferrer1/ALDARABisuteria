import type { Metadata } from "next";
import { PRODUCTS } from "@/lib/products";
import { DemoPhoto } from "@/components/DemoPhoto";
import { Reveal } from "@/components/Reveal";
import { ProductVisual } from "@/components/ProductVisual";
import { ProductLightField } from "@/components/ProductPlate";
import { AddToCartButton } from "@/components/AddToCartButton";
import { RevealHeroText, RevealSectionLabel, RevealMacroCaption, RevealViewFullLink, RevealZoomNote } from "@/components/ProductRevealChrome";
import { money } from "@/lib/storage";

export const metadata: Metadata = {
  title: "Product Reveal",
  description: "El storyboard de revelado de una pieza ALDARA: contexto humano, macro, y transición a la ficha de producto.",
};

/**
 * Product Reveal (Bloque 9, ref. 9.2) — storyboard completo del mockup
 * (contexto humano → macro/iluminación → reveal → transición a PDP →
 * zoom/lightbox → feedback real de "añadir al carrito"), construido con
 * composiciones generativas (`DemoPhoto`/`ProductVisual`, GENERATED_DEMO)
 * ya que no existe fotografía/vídeo real todavía. El "reveal" en sí usa la
 * misma técnica estable de scroll-reveal (`Reveal`, IntersectionObserver)
 * que el resto del sitio — sin depender de shared-element transitions
 * experimentales de React.
 */
export default function ProductRevealPage() {
  const product = PRODUCTS.find((p) => p.id === "p9")!;

  return (
    <>
      {/* 1. Contexto humano */}
      <section className="relative overflow-hidden">
        <div className="relative aspect-auto min-h-100 w-full sm:aspect-21/9 sm:min-h-0 lg:aspect-21/8">
          <DemoPhoto seed="reveal-contexto" tone="var(--terracotta)" />
          <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/15 to-transparent" aria-hidden="true" />
          <div className="relative z-10 flex h-full flex-col justify-end px-4 pb-10 sm:px-8 lg:px-16">
            <RevealHeroText />
          </div>
        </div>
      </section>

      {/* 2. Macro / iluminación */}
      <Reveal className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6">
        <RevealSectionLabel variant="macro" />
        {/* Panel MACRO: mismo fondo generativo que el resto del catálogo pero
            escalado (scale-150) para que se lea como un recorte de detalle
            real, no la misma composición plana que el panel REVEAL de abajo. */}
        <div className="relative mx-auto flex aspect-square max-w-md items-center justify-center overflow-hidden rounded-3xl bg-surface-2">
          <div className="absolute inset-0 scale-150">
            <ProductLightField product={product} hue={1} />
          </div>
          <div className="relative scale-150 drop-shadow-[0_12px_28px_rgba(0,0,0,0.25)]">
            <ProductVisual product={product} size={200} />
          </div>
        </div>
        <RevealMacroCaption />
      </Reveal>

      {/* 3. Reveal */}
      <Reveal delayMs={100} className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6">
        <RevealSectionLabel variant="reveal" />
        <div className="relative flex aspect-4/3 items-center justify-center overflow-hidden rounded-3xl bg-surface-2">
          <ProductLightField product={product} hue={0} />
          <div className="relative drop-shadow-[0_12px_28px_rgba(0,0,0,0.25)]">
            <ProductVisual product={product} size={220} />
          </div>
        </div>
        <h2 className="mt-6 font-display text-3xl font-semibold">{product.name}</h2>
        <p className="mt-2 text-ink-soft">{product.description}</p>
      </Reveal>

      {/* 4. Transición a PDP + zoom/lightbox + add to cart */}
      <Reveal delayMs={150} className="mx-auto max-w-lg px-4 pb-24 text-center sm:px-6">
        <p className="mb-4 font-display text-2xl font-semibold">{money(product.price)}</p>
        <div className="flex flex-wrap justify-center gap-3">
          <AddToCartButton productId={product.id} productName={product.name} variant="full" />
          <RevealViewFullLink productSlug={product.slug} />
        </div>
        <RevealZoomNote />
      </Reveal>
    </>
  );
}
