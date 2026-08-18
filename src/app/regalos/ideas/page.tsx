import type { Metadata } from "next";
import Link from "next/link";
import { PRODUCTS } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";
import { Reveal } from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Regalos con intención",
  description: "Universo de regalo ALDARA: por destinatario, ocasión, presupuesto y tipo de joya, con tarjeta regalo y envoltorio premium.",
};

// Calcado del mockup "Regalos con intención" (p.24): hub de descubrimiento
// por destinatario/ocasión/presupuesto/tipo de joya + destacados + tarjeta
// regalo + envoltorio, distinto del asistente paso a paso de /regalos (Gift
// Finder, p.23). Antes no existía como página propia — gap real detectado
// en la auditoría visual (ref. 3.2). Todos los enlaces son funcionales de
// verdad (filtros reales de /shop, /gift-cards real, no decorativos).
const BY_RECIPIENT = [
  { label: "Para mamá", hue: "#a9663a" },
  { label: "Para pareja", hue: "#8a5a34" },
  { label: "Para amiga", hue: "#b98a3f" },
  { label: "Para hermana", hue: "#7a4526" },
];

const BY_OCCASION = [
  { label: "Cumpleaños", sub: "Sorprende en su día especial" },
  { label: "Aniversario", sub: "Celebrad vuestro camino juntos" },
  { label: "Gracias", sub: "El gesto que lo dice todo" },
  { label: "Celebración", sub: "Magia y detalles únicos" },
];

const BY_BUDGET = [
  { label: "Menos de 15€", sub: "Detalles que enamoran", maxPrice: 15 },
  { label: "Menos de 25€", sub: "Acertar es posible", maxPrice: 25 },
  { label: "Sin límite", sub: "Regalos que duran para siempre", maxPrice: undefined },
];

const BY_TYPE = [
  { label: "Colgantes", categoria: "colgantes" },
  { label: "Pulseras", categoria: "pulseras" },
  { label: "Pendientes", categoria: "pendientes" },
  { label: "Charms", categoria: "charms" },
];

export default function RegalosIdeasPage() {
  const featured = PRODUCTS.filter((p) => p.badges?.includes("bestseller") && p.stock > 0).slice(0, 6);

  return (
    <>
      <section className="px-4 pb-10 pt-24 text-center sm:px-6">
        <p className="mb-3 text-xs font-bold uppercase tracking-widest text-terracotta">Regalos con alma</p>
        <h1 className="font-display text-4xl font-semibold sm:text-5xl">
          Regalos con <em className="not-italic text-terracotta">intención</em>
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-ink-soft">
          Joyas artesanales que cuentan historias y acompañan momentos inolvidables. Porque cuando regalas con intención, siempre aciertas.
        </p>
        <Link href="/regalos" className="mt-6 inline-block rounded-full bg-ink px-7 py-3.5 font-semibold text-ivory">
          Encuentra el regalo perfecto
        </Link>
      </section>

      {/* Por quién recibe */}
      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <h2 className="mb-6 text-center text-xs font-bold uppercase tracking-widest text-ink-soft">Regalos por quién recibe</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {BY_RECIPIENT.map((r) => (
            <Reveal key={r.label}>
              <Link href="/regalos" className="group relative flex aspect-3/4 flex-col justify-end overflow-hidden rounded-2xl p-4">
                <span
                  className="absolute inset-0 transition-transform duration-500 group-hover:scale-105"
                  style={{ background: `radial-gradient(circle at 35% 25%, ${r.hue}66, ${r.hue}e6)` }}
                  aria-hidden="true"
                />
                <span className="absolute inset-0 bg-linear-to-t from-black/55 to-transparent" aria-hidden="true" />
                <span className="relative text-sm font-bold uppercase tracking-wide text-white">{r.label}</span>
                <span className="relative text-xs text-white/80">Ver regalos →</span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Por ocasión */}
      <section className="border-y border-line bg-surface-2 px-4 py-12 sm:px-6">
        <h2 className="mb-8 text-center text-xs font-bold uppercase tracking-widest text-ink-soft">Regalos por ocasión</h2>
        <div className="mx-auto grid max-w-4xl grid-cols-2 gap-8 sm:grid-cols-4">
          {BY_OCCASION.map((o) => (
            <Link key={o.label} href="/regalos" className="text-center">
              <p className="font-semibold">{o.label}</p>
              <p className="mt-1 text-xs text-ink-soft">{o.sub}</p>
              <p className="mt-2 text-xs font-semibold text-terracotta">Ver regalos →</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Por presupuesto + por tipo */}
      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-2">
        <div>
          <h2 className="mb-5 text-xs font-bold uppercase tracking-widest text-ink-soft">Regalos por presupuesto</h2>
          <div className="grid grid-cols-3 gap-3">
            {BY_BUDGET.map((b) => (
              <Link
                key={b.label}
                href={b.maxPrice ? `/shop?maxPrice=${b.maxPrice}` : "/shop"}
                className="rounded-xl border border-line p-4 text-center hover:border-ink"
              >
                <p className="text-sm font-semibold">{b.label}</p>
                <p className="mt-1 text-xs text-ink-soft">{b.sub}</p>
              </Link>
            ))}
          </div>
        </div>
        <div>
          <h2 className="mb-5 text-xs font-bold uppercase tracking-widest text-ink-soft">Regalos por tipo de joya</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {BY_TYPE.map((t) => (
              <Link key={t.categoria} href={`/shop?categoria=${t.categoria}`} className="rounded-xl border border-line p-4 text-center hover:border-ink">
                <p className="text-sm font-semibold">{t.label}</p>
                <p className="mt-1 text-xs text-terracotta">Ver {t.label.toLowerCase()} →</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Destacados */}
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <h2 className="mb-8 text-center text-xs font-bold uppercase tracking-widest text-ink-soft">Regalos destacados</h2>
        <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* Tarjeta regalo + envoltorio */}
      <section className="mx-auto grid max-w-6xl gap-6 px-4 pb-20 sm:px-6 lg:grid-cols-2">
        <Link href="/gift-cards" className="rounded-2xl bg-ink p-8 text-ivory transition-transform hover:-translate-y-0.5">
          <p className="text-xs font-bold uppercase tracking-widest text-gold-light">Tarjeta regalo ALDARA</p>
          <p className="mt-2 text-white/85">Deja que elijan lo que más les guste. Válida en toda la tienda online.</p>
          <p className="mt-4 inline-block rounded-full bg-gold-light px-5 py-2.5 text-sm font-semibold text-ink">Comprar tarjeta regalo →</p>
        </Link>
        <div className="rounded-2xl border border-line p-8">
          <p className="text-xs font-bold uppercase tracking-widest text-terracotta">Envoltura premium y nota manuscrita</p>
          <p className="mt-2 text-ink-soft">
            En el checkout puedes añadir nuestro envoltorio de regalo y una dedicatoria escrita por ti — se aplica a todo el pedido.
          </p>
          <Link href="/regalos" className="mt-4 inline-block text-sm font-semibold text-terracotta underline">
            Descubrir más →
          </Link>
        </div>
      </section>
    </>
  );
}
