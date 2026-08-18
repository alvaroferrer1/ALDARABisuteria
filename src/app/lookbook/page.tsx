import type { Metadata } from "next";
import { getAllLooks } from "@/lib/looks";
import { getAllCollections } from "@/lib/collections";
import { Reveal } from "@/components/Reveal";
import { LookbookGrid } from "@/components/LookbookGrid";

export const metadata: Metadata = {
  title: "Lookbook",
  description: "Looks completos con piezas ALDARA: toca cada punto de la escena, guarda el look o cómpralo entero de una vez.",
};

export default function LookbookIndexPage() {
  const looks = getAllLooks();
  const collections = getAllCollections();

  return (
    <>
      <section className="px-4 pb-10 pt-24 text-center sm:px-6">
        <Reveal>
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-terracotta">Lookbook</p>
          <h1 className="font-display text-4xl font-semibold sm:text-5xl">Looks completos, piezas reales</h1>
          <p className="mx-auto mt-4 max-w-lg text-ink-soft">
            Cada escena es shoppable: toca los puntos, guarda el look o compra el conjunto entero de una vez.
          </p>
        </Reveal>
      </section>
      <section className="mx-auto max-w-5xl px-4 pb-24 sm:px-6">
        <LookbookGrid looks={looks} collections={collections} />
      </section>
    </>
  );
}
