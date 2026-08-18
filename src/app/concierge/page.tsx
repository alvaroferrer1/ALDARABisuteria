import type { Metadata } from "next";
import { ConciergeChat } from "@/components/ConciergeChat";
import { ConciergeHero } from "@/components/ConciergeHero";
import { Reveal } from "@/components/Reveal";
import { DemoPhoto } from "@/components/DemoPhoto";

export const metadata: Metadata = {
  title: "Concierge ALDARA",
  description: "Asesoramiento local basado en el catálogo real de ALDARA: cuéntanos qué buscas y te recomendamos piezas reales.",
};

export default function ConciergePage() {
  return (
    <>
      {/* Foto de hero — el mockup (p.27) abre con una fotografía a sangre
          completa, antes esta página empezaba directamente en texto, gap
          real detectado en comparación directa PDF↔LIVE. */}
      <section className="relative flex min-h-56 items-end overflow-hidden pb-6 sm:min-h-72">
        <DemoPhoto seed="concierge-hero" tone="var(--gold)" />
        <div className="absolute inset-0 bg-linear-to-t from-ivory via-ivory/50 to-transparent" aria-hidden="true" />
      </section>

      <section className="px-4 pb-24 pt-8 sm:px-6">
        <ConciergeHero />

        <Reveal delayMs={150} className="mx-auto mt-10 max-w-5xl">
          <ConciergeChat />
        </Reveal>
      </section>
    </>
  );
}
