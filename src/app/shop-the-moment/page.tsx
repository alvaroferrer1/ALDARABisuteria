import type { Metadata } from "next";
import { getAllMoments } from "@/lib/moments";
import { getProductById } from "@/lib/products";
import { MomentClient } from "@/components/MomentClient";
import { PhotoSlot } from "@/components/PhotoSlot";

export const metadata: Metadata = {
  title: "Shop the Moment",
  description: "Combinaciones ya pensadas para ocasiones reales: entrevista, boda, mañana de cafés, noche de viernes.",
};

/**
 * SHOP THE MOMENT — el punto de partida es la ocasión, no el producto ni la
 * sensación (esa es Mood Shop) ni la persona a la que regalas (esa es
 * /regalos). Cada momento trae una combinación fija de 2-3 piezas.
 */
export default function ShopTheMomentPage() {
  const moments = getAllMoments();
  const productsByMoment = Object.fromEntries(
    moments.map((m) => [m.slug, m.productIds.map((id) => getProductById(id)).filter((p): p is NonNullable<typeof p> => Boolean(p))])
  );

  return (
    <>
      <section className="px-4 pb-8 pt-24 text-center sm:px-6">
        <div className="relative mx-auto mb-8 aspect-21/9 max-w-4xl overflow-hidden rounded-3xl">
          <PhotoSlot name="shop-the-moment" alt="" fallback={<div className="absolute inset-0 bg-surface-2" />} />
        </div>
        <p className="mb-3 text-xs font-bold uppercase tracking-widest text-terracotta">Shop the Moment</p>
        <h1 className="mx-auto max-w-2xl font-display text-4xl font-semibold sm:text-5xl">¿Para qué momento te vistes hoy?</h1>
        <p className="mx-auto mt-4 max-w-lg text-ink-soft">
          Elige la ocasión y te dejamos la combinación ya pensada — nada de armar el look pieza a pieza.
        </p>
      </section>

      <section className="mx-auto max-w-4xl px-4 pb-24 sm:px-6">
        <MomentClient moments={moments} productsByMoment={productsByMoment} />
      </section>
    </>
  );
}
