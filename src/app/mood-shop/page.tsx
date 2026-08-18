import type { Metadata } from "next";
import { getAllMoods } from "@/lib/moods";
import { getProductById } from "@/lib/products";
import { MoodShopClient } from "@/components/MoodShopClient";

export const metadata: Metadata = {
  title: "Mood Shop",
  description: "Compra por sensación, no por categoría: Atrevida, Serena, Nostálgica, Luminosa, Curiosa o Libre. Elige cómo te quieres sentir hoy.",
};

/**
 * MOOD SHOP — deliberadamente sin filtros de talla/precio/categoría (esos
 * ya existen en /shop). La única entrada es una sensación. Ver lib/moods.ts
 * para la justificación frente al PDF y la diferencia con Shop the Moment
 * (que mezclará contexto/ocasión, no sensación pura).
 */
export default function MoodShopPage() {
  const moods = getAllMoods();
  const productsByMood = Object.fromEntries(
    moods.map((m) => [m.slug, m.productIds.map((id) => getProductById(id)).filter((p): p is NonNullable<typeof p> => Boolean(p))])
  );

  return (
    <>
      <section className="px-4 pb-8 pt-24 text-center sm:px-6">
        <p className="mb-3 text-xs font-bold uppercase tracking-widest text-terracotta">Mood Shop</p>
        <h1 className="mx-auto max-w-2xl font-display text-4xl font-semibold sm:text-5xl">¿Cómo te quieres sentir hoy?</h1>
        <p className="mx-auto mt-4 max-w-lg text-ink-soft">
          No hay filtros de talla ni de precio aquí — solo una elección. Cada sensación trae su propia curación pequeña.
        </p>
      </section>

      <section className="px-4 pb-24 sm:px-6">
        <MoodShopClient moods={moods} productsByMood={productsByMood} />
      </section>
    </>
  );
}
