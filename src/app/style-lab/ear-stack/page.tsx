import type { Metadata } from "next";
import { EarStackBuilder } from "@/components/EarStackBuilder";
import { StyleLabHero } from "@/components/StyleLabHero";
import { PhotoSlot } from "@/components/PhotoSlot";

export const metadata: Metadata = {
  title: "Ear Stack Builder",
  description: "Combina hasta 3 pendientes reales del catálogo ALDARA y añade la combinación completa a tu cesta.",
};

const INSPIRATION = ["style-combinacion-2", "style-combinacion-3", "category-necklaces-layering", "layering-collares"];

export default function EarStackPage() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <StyleLabHero />
      <EarStackBuilder />

      <div className="mt-16">
        <p className="mb-4 text-xs font-bold uppercase tracking-widest text-ink-soft">Combinaciones que te pueden encantar</p>
        <div className="grid gap-4 sm:grid-cols-2">
          {INSPIRATION.map((name) => (
            <div key={name} className="relative aspect-4/5 overflow-hidden rounded-2xl">
              <PhotoSlot name={name} alt="" fallback={<div className="absolute inset-0 bg-surface-2" />} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
