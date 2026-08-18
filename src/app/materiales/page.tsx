import Link from "next/link";
import type { Metadata } from "next";
import { PRODUCTS } from "@/lib/products";
import { MaterialSwatch } from "@/components/MaterialSwatch";
import { ProductPlate } from "@/components/ProductPlate";
import { Reveal } from "@/components/Reveal";
import { money } from "@/lib/storage";
import { MaterialesHero, MaterialesPiecesLabel, MaterialesTraceability } from "@/components/MaterialesChrome";

export const metadata: Metadata = {
  title: "Materiales",
  description: "Con qué materiales trabaja ALDARA: baño de oro 18k, acero quirúrgico, piedras naturales, perlas cultivadas, cristal checo y más.",
};

const MATERIALS = [
  {
    slug: "bano-de-oro",
    name: "Baño de oro 18k",
    keyword: "baño de oro 18k",
    text: "Nuestra base para la mayoría de piezas: una capa de oro real sobre acero quirúrgico o latón. Resistente al agua y al uso diario, mantiene el brillo mucho más tiempo que un baño fino convencional.",
    sensory: "Cálido al tacto casi de inmediato — se nota la diferencia con un metal frío en cuanto lo tocas.",
    pattern: "hatch" as const,
    color: "var(--gold)",
  },
  {
    slug: "acero-quirurgico",
    name: "Acero quirúrgico",
    keyword: "acero quirúrgico",
    text: "El mismo material que se usa en implantes médicos. No lleva níquel expuesto, por lo que es apto para pieles sensibles en la mayoría de los casos.",
    sensory: "Frío el primer segundo, se entibia enseguida con la piel. Superficie lisa, sin textura.",
    pattern: "brushed" as const,
    color: "var(--blue)",
  },
  {
    slug: "piedras-naturales",
    name: "Piedras naturales",
    keyword: "piedra natural",
    text: "Ámbar, cuarzo y turquesa según la colección. Cada piedra es única: el veteado y el color varían ligeramente de una pieza a otra, y eso es parte de su valor.",
    sensory: "Pesan un poco más de lo que esperas para su tamaño — es lo primero que se nota al cogerlas.",
    pattern: "mottled" as const,
    color: "var(--terracotta)",
  },
  {
    slug: "perlas-cultivadas",
    name: "Perlas cultivadas",
    keyword: "perla cultivada",
    text: "Seleccionadas a mano por brillo, forma y tamaño. Son sensibles a perfumes y productos químicos: mejor ponerlas al final de tu rutina.",
    sensory: "Superficie suave, casi resbaladiza. Nunca dos exactamente iguales, ni en la misma pieza.",
    pattern: "pearled" as const,
    color: "var(--gold-light)",
  },
  {
    slug: "cristal-checo",
    name: "Cristal checo",
    keyword: "cristal checo",
    text: "Color intenso y gran durabilidad, ideal para pulseras y charms con mucho uso.",
    sensory: "Duro y con aristas — atrapa la luz distinto según el ángulo, no es un brillo plano.",
    pattern: "faceted" as const,
    color: "var(--blue)",
  },
  {
    slug: "hilo-encerado",
    name: "Hilo encerado",
    keyword: "hilo encerado",
    text: "La base de nuestras pulseras trenzadas. Resistente al agua y al roce, se ajusta con el uso sin perder forma.",
    sensory: "Flexible desde el primer día — se adapta a la muñeca en un par de usos, no da la sensación rígida del metal.",
    pattern: "woven" as const,
    color: "var(--terracotta)",
  },
];

export default function MaterialesPage() {
  const materialsWithProducts = MATERIALS.map((m) => ({
    ...m,
    products: PRODUCTS.filter((p) => p.materials.toLowerCase().includes(m.keyword)),
  }));

  return (
    <>
      <MaterialesHero />

      <div className="mx-auto max-w-5xl px-4 pb-24 sm:px-6">
        {materialsWithProducts.map((m, i) => (
          <Reveal key={m.slug} delayMs={i * 60} className="mb-20 last:mb-0">
            <div className={`grid gap-8 lg:grid-cols-2 lg:items-center ${i % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""}`}>
              <MaterialSwatch id={`swatch-${m.slug}`} pattern={m.pattern} color={m.color} className="aspect-video rounded-2xl sm:aspect-3/2" />
              <div>
                <h2 className="font-display text-2xl font-semibold sm:text-3xl">{m.name}</h2>
                <p className="mt-3 text-ink-soft">{m.text}</p>
                <p className="mt-3 font-display text-lg italic" style={{ color: m.color }}>
                  {m.sensory}
                </p>
              </div>
            </div>

            {m.products.length > 0 && (
              <div className="mt-8">
                <MaterialesPiecesLabel />
                <div className="flex gap-4 overflow-x-auto pb-2">
                  {m.products.map((p) => (
                    <Link key={p.id} href={`/producto/${p.slug}`} className="group w-32 shrink-0">
                      <ProductPlate product={p} className="aspect-square rounded-xl transition-transform group-hover:scale-105" />
                      <p className="mt-2 truncate text-sm font-medium group-hover:text-terracotta">{p.name}</p>
                      <p className="text-xs text-ink-soft">{money(p.price)}</p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </Reveal>
        ))}
      </div>

      {/* Trazabilidad (Bloque 8, #91) — compromisos verificables reales, no
          certificaciones ni cifras fabricadas: los mismos hechos ya usados
          en "Nuestra historia" (taller propio, Puerto Almenara, artesanas reales). */}
      <section className="mx-auto max-w-3xl px-4 pb-24 text-center sm:px-6">
        <MaterialesTraceability />
      </section>
    </>
  );
}
