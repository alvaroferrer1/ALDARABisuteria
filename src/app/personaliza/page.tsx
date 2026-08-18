import Link from "next/link";
import type { Metadata } from "next";
import { PRODUCTS } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";
import { PersonalizationConfigurator } from "@/components/PersonalizationConfigurator";
import { Reveal } from "@/components/Reveal";
import { PhotoSlot } from "@/components/PhotoSlot";

export const metadata: Metadata = {
  title: "Personalizadas",
  description: "Personaliza tu joya en vivo — grabado, material y charm opcional — más el Charms Studio y el Style Lab para componer la tuya.",
};

const PROCESS_STEPS = [
  { n: 1, title: "Tú lo imaginas", text: "Elige el diseño, materiales y personaliza cada detalle." },
  { n: 2, title: "Lo hacemos realidad", text: "Nuestras artesanas trabajan cada pieza con dedicación." },
  { n: 3, title: "Lo preparamos para ti", text: "Revisamos cada detalle y lo empaquetamos con amor." },
  { n: 4, title: "Lo recibes en casa", text: "Recibe tu joya en un empaque especial, lista para emocionar." },
];

export default function PersonalizaPage() {
  const personalizable = PRODUCTS.filter((p) => p.badges?.includes("personalizable"));

  return (
    <>
      {/* Breadcrumb — calcado del mockup (p.25: "Inicio > Personalizadas > Personalización"), gap real detectado en comparación directa PDF↔LIVE. */}
      <p className="mx-auto max-w-5xl px-4 pt-8 text-sm text-ink-soft sm:px-6">
        <Link href="/" className="hover:text-terracotta">
          Inicio
        </Link>{" "}
        / Personalizadas / Personalización
      </p>

      <section className="px-4 pb-10 pt-8 text-center sm:px-6">
        <Reveal>
          <div className="relative mx-auto mb-8 aspect-21/9 max-w-4xl overflow-hidden rounded-3xl">
            <PhotoSlot name="personalizacion-hero" alt="" fallback={<div className="absolute inset-0 bg-surface-2" />} />
          </div>
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-terracotta">Personalización</p>
          <h1 className="mx-auto max-w-2xl font-display text-4xl font-semibold sm:text-5xl">
            Personaliza <em className="not-italic text-terracotta">tu historia</em>
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-ink-soft">
            Crea una joya única que hable de ti o de quien más amas. Hecha a mano, con intención y significado.
          </p>
        </Reveal>
      </section>

      <section className="mx-auto max-w-5xl px-4 pb-16 sm:px-6">
        <PersonalizationConfigurator />
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-14 sm:px-6">
        <Reveal>
          <h2 className="mb-6 font-display text-2xl font-semibold">¿Buscas algo más libre?</h2>
        </Reveal>
        <div className="grid gap-6 sm:grid-cols-2">
          <Reveal>
            <Link
              href="/charms-studio"
              className="group flex h-full flex-col justify-between rounded-3xl border border-line p-8 transition-transform hover:-translate-y-1.5"
            >
              <div>
                <p className="mb-2 text-xs font-bold uppercase tracking-widest text-terracotta">Charms Studio</p>
                <h2 className="font-display text-2xl font-semibold">Cadena + charms, a tu gusto</h2>
                <p className="mt-2 text-ink-soft">Elige la cadena base y arrastra los charms que cuenten tu historia.</p>
              </div>
              <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-terracotta group-hover:gap-2.5 transition-all">
                Empezar a componer →
              </span>
            </Link>
          </Reveal>
          <Reveal delayMs={100}>
            <Link
              href="/style-lab/ear-stack"
              className="group flex h-full flex-col justify-between rounded-3xl border border-line p-8 transition-transform hover:-translate-y-1.5"
            >
              <div>
                <p className="mb-2 text-xs font-bold uppercase tracking-widest text-terracotta">Style Lab</p>
                <h2 className="font-display text-2xl font-semibold">Combina tu oreja</h2>
                <p className="mt-2 text-ink-soft">Lóbulo, segundo agujero y helix — combina hasta 3 pendientes reales.</p>
              </div>
              <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-terracotta group-hover:gap-2.5 transition-all">
                Empezar a combinar →
              </span>
            </Link>
          </Reveal>
        </div>
      </section>

      {/* "Nuestro proceso artesanal" — calcado del mockup (p.25, 4 pasos + tiempos de entrega), gap real detectado en comparación directa PDF↔LIVE. */}
      <section className="border-y border-line bg-surface-2 px-4 py-16 sm:px-6">
        <Reveal>
          <p className="mb-1 text-center text-xs font-bold uppercase tracking-widest text-terracotta">Hecho a mano, solo para ti</p>
          <h2 className="mb-10 text-center font-display text-2xl font-semibold">Nuestro proceso artesanal</h2>
        </Reveal>
        <div className="mx-auto grid max-w-4xl gap-8 sm:grid-cols-4">
          {PROCESS_STEPS.map((s) => (
            <Reveal key={s.n} delayMs={s.n * 80} className="text-center">
              <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-ink text-sm font-semibold text-ivory">
                {s.n}
              </div>
              <p className="font-semibold">{s.title}</p>
              <p className="mt-1 text-sm text-ink-soft">{s.text}</p>
            </Reveal>
          ))}
        </div>
        <p className="mx-auto mt-10 max-w-md text-center text-sm text-ink-soft">
          Producción: 2-4 días hábiles · Envío España: 24/48h · Envío internacional: 3-7 días
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-24 pt-16 sm:px-6">
        <Reveal>
          <h2 className="mb-8 font-display text-2xl font-semibold">Piezas ya personalizables</h2>
        </Reveal>
        <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-4">
          {personalizable.map((p, i) => (
            <Reveal key={p.id} delayMs={i * 90}>
              <ProductCard product={p} />
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
