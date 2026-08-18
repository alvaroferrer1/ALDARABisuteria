import type { Metadata } from "next";
import { TryOnStage } from "@/components/TryOnStage";
import { getProductBySlug } from "@/lib/products";

export const metadata: Metadata = {
  title: "Pruébatelo",
  description: "Previsualiza cómo te queda una pieza ALDARA con tu cámara o una foto — orientativo, procesado en tu dispositivo.",
};

export default async function TryOnPage({ searchParams }: { searchParams: Promise<{ producto?: string }> }) {
  const { producto } = await searchParams;
  const initialProduct = producto ? getProductBySlug(producto) : undefined;

  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <p className="mb-3 text-xs font-bold uppercase tracking-widest text-terracotta">Try-On</p>
      <h1 className="mb-3 font-display text-4xl font-semibold sm:text-5xl">Pruébatelo</h1>
      <p className="mb-10 max-w-2xl text-ink-soft">
        Elige una pieza y previsualízala con tu cámara o una foto que subas. Es una previsualización orientativa, no una
        medición real — pero funciona de verdad: mueve, escala y gira la pieza hasta que se vea como quieres.
      </p>
      <TryOnStage initialProductId={initialProduct?.id} />
    </section>
  );
}
