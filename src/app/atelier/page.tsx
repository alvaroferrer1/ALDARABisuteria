import type { Metadata } from "next";
import { PRODUCTS } from "@/lib/products";
import { Reveal } from "@/components/Reveal";
import { AtelierHero, AtelierMateriaHeader, AtelierMaterialCount, AtelierGuideLink, AtelierCta } from "@/components/AtelierChrome";

export const metadata: Metadata = {
  title: "Atelier",
  description: "El proceso real detrás de cada pieza ALDARA: de la idea al material, hasta que llega a tus manos.",
};

const STEPS = [
  {
    n: "01",
    title: "La idea",
    text: "Cada pieza empieza en una conversación: algo de Venezuela, algo de Colombia, algo del día a día en Puerto Almenara. No hay un catálogo de tendencias detrás — hay una anécdota concreta que se quiere llevar puesta.",
  },
  {
    n: "02",
    title: "El boceto",
    text: "La idea se dibuja a mano antes de tocar ningún material. Si no funciona en boceto, no llega a producirse — es el primer filtro, no el último.",
  },
  {
    n: "03",
    title: "El material",
    text: "Baño de oro 18k, plata, acero quirúrgico, piedra natural, perla cultivada. Cada material se elige por lo que aporta a esa pieza concreta, no porque sea el más barato disponible.",
  },
  {
    n: "04",
    title: "El acabado",
    text: "Pulido, esmaltado a mano o grabado a medida, según la pieza. Es el paso donde una idea deja de ser un boceto y empieza a parecer joyería.",
  },
  {
    n: "05",
    title: "La pieza",
    text: "Lista para vivir contigo: en el catálogo, en una combinación del Style Lab, o dentro de una historia de regalo. El proceso termina cuando la lleva alguien, no cuando sale del taller.",
  },
] as const;

// Materiales base reales, derivados del catálogo real (no inventados) — cuenta cuántas piezas usan cada uno.
function getMaterialBreakdown() {
  const counts = new Map<string, number>();
  for (const p of PRODUCTS) {
    for (const part of p.materials.split("·").map((s) => s.trim())) {
      counts.set(part, (counts.get(part) ?? 0) + 1);
    }
  }
  return Array.from(counts.entries()).sort((a, b) => b[1] - a[1]);
}

export default function AtelierPage() {
  const materials = getMaterialBreakdown();

  return (
    <>
      <section className="px-4 pb-14 pt-24 text-center sm:px-6">
        <Reveal>
          <AtelierHero />
        </Reveal>
      </section>

      {/* Proceso — panel de textura generativa distinto por paso, no el mismo gradiente de luz de Home/Lookbook */}
      <section className="mx-auto max-w-4xl px-4 pb-24 sm:px-6">
        <div className="flex flex-col gap-3">
          {STEPS.map((step, i) => (
            <Reveal key={step.n} delayMs={i * 90}>
              <div className="grid gap-6 rounded-3xl border border-line p-7 sm:grid-cols-[auto_1fr] sm:items-start sm:p-8">
                <div className="flex items-center gap-4 sm:flex-col sm:items-start sm:gap-2">
                  <span className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-surface-2">
                    <svg viewBox="0 0 64 64" className="absolute inset-0 h-full w-full opacity-40" aria-hidden="true">
                      <defs>
                        <pattern id={`hatch-${step.n}`} width="6" height="6" patternTransform={`rotate(${i * 18})`} patternUnits="userSpaceOnUse">
                          <line x1="0" y1="0" x2="0" y2="6" stroke="var(--gold)" strokeWidth="1" />
                        </pattern>
                      </defs>
                      <rect width="64" height="64" fill={`url(#hatch-${step.n})`} />
                    </svg>
                    <span className="relative font-display text-xl font-semibold text-terracotta">{step.n}</span>
                  </span>
                </div>
                <div>
                  <h2 className="font-display text-xl font-semibold sm:text-2xl">{step.title}</h2>
                  <p className="mt-2 text-ink-soft">{step.text}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Materiales reales — no una ficha decorativa, cuenta piezas reales del catálogo */}
      <section className="bg-surface-2 py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <Reveal className="mb-10 text-center">
            <AtelierMateriaHeader />
          </Reveal>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {materials.map(([name, count], i) => (
              <Reveal key={name} delayMs={i * 70}>
                <div className="rounded-2xl bg-surface p-5">
                  <p className="font-display text-lg font-semibold">{name}</p>
                  <AtelierMaterialCount count={count} />
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-10 text-center">
            <AtelierGuideLink />
          </Reveal>
        </div>
      </section>

      <section className="border-t border-line bg-ink py-20 text-center text-ivory">
        <Reveal>
          <AtelierCta />
        </Reveal>
      </section>
    </>
  );
}
