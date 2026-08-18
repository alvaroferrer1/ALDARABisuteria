import Link from "next/link";
import { getAllProducts } from "@/lib/products";
import { getAllCollections } from "@/lib/collections";
import { ProductCard } from "@/components/ProductCard";
import { ProductPlate } from "@/components/ProductPlate";
import { CollectionCover } from "@/components/CollectionCover";
import { PhotoSlot } from "@/components/PhotoSlot";
import { HomeHero } from "@/components/HomeHero";
import { Reveal } from "@/components/Reveal";
import { HomeCollectionsHeader, HomeTrustBar, HomeCatalogTeaser, HomeViewFullCatalogLink, HomeFinalCta } from "@/components/HomeSections";

// Fila de categorías — calcada del mockup de Home aprobado (Charms, Pulseras,
// Pendientes, Colgantes, Gift Finder), no inventada. Cada una lleva el
// primer producto real de esa categoría como plano de apoyo (ProductPlate),
// en vez de un icono suelto flotando en un fondo plano.
const CATEGORIES = [
  { slug: "charms", label: "Charms", sub: "Pequeños símbolos, grandes historias" },
  { slug: "pulseras", label: "Pulseras", sub: "Colores que nos conectan" },
  { slug: "pendientes", label: "Pendientes", sub: "Detalles que te hacen brillar" },
  { slug: "colgantes", label: "Colgantes", sub: "Lleva tu historia siempre contigo" },
] as const;

export default function HomePage() {
  const allProducts = getAllProducts();
  const featured = allProducts.slice(0, 3);
  const collections = getAllCollections();
  const categoryCovers = Object.fromEntries(
    CATEGORIES.map((c) => [c.slug, allProducts.find((p) => p.category === c.slug)])
  );

  return (
    <>
      <HomeHero />

      {/* Fila de categorías — cada tarjeta lleva un plano de producto real como
          miniatura (no un icono suelto), calcando la lógica del mockup (5
          tarjetas con imagen + texto), aunque sin fotografía real todavía. */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
          {CATEGORIES.map((cat, i) => {
            const cover = categoryCovers[cat.slug];
            return (
              <Reveal key={cat.slug} delayMs={i * 70}>
                <Link
                  href={`/shop?categoria=${cat.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl bg-surface-2 transition-transform hover:-translate-y-1"
                >
                  <div className="relative aspect-square overflow-hidden transition-transform duration-300 group-hover:scale-105">
                    <PhotoSlot
                      name={`category-${cat.slug}`}
                      alt={cat.label}
                      fallback={cover ? <ProductPlate product={cover} className="absolute inset-0 aspect-auto rounded-none" /> : <></>}
                    />
                  </div>
                  <div className="flex flex-1 flex-col justify-between gap-3 p-5">
                    <div>
                      <p className="font-display text-lg font-semibold">{cat.label}</p>
                      <p className="mt-0.5 text-xs text-ink-soft">{cat.sub}</p>
                    </div>
                    <span className="inline-block text-xs font-semibold text-terracotta group-hover:underline">Ver más →</span>
                  </div>
                </Link>
              </Reveal>
            );
          })}
          <Reveal delayMs={CATEGORIES.length * 70}>
            <Link
              href="/regalos"
              className="group relative flex h-full flex-col justify-between gap-4 overflow-hidden rounded-2xl p-6 text-white transition-transform hover:-translate-y-1"
              style={{ backgroundColor: "#0d1220" }}
            >
              {/* Bug real corregido: la tarjeta era un color plano sin ninguna
                  textura, mientras las otras 4 llevan un plano de producto real
                  — al lado de las demás se veía rota/incompleta. Mismo
                  tratamiento generativo (glow + grano) que el resto del sitio,
                  en la paleta azul profundo/dorado ya usada en el footer. */}
              <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full overflow-hidden" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
                <defs>
                  <radialGradient id="gift-tile-glow" cx="70%" cy="20%" r="80%">
                    <stop offset="0%" stopColor="#d4af37" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#d4af37" stopOpacity="0" />
                  </radialGradient>
                  <filter id="gift-tile-grain">
                    <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" result="noise" />
                    <feColorMatrix in="noise" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.05 0" />
                  </filter>
                </defs>
                <rect width="200" height="200" fill="url(#gift-tile-glow)" />
                <rect width="200" height="200" filter="url(#gift-tile-grain)" />
              </svg>
              <svg viewBox="0 0 24 24" width="26" height="26" className="relative text-[#d4af37]" aria-hidden="true">
                <path d="M20 12v9H4v-9M2 7h20v5H2V7Zm10-5C9 2 7 4 7 6.5S9 11 12 11s5-2 5-4.5S15 2 12 2Zm0 0c3 0 5 2 5 4.5S15 11 12 11" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <div className="relative">
                <p className="font-display text-lg font-semibold">Buscador de regalos</p>
                <p className="mt-0.5 text-xs text-white/60">El regalo perfecto está aquí</p>
                <span className="mt-2 inline-block text-xs font-semibold text-[#d4af37] group-hover:underline">Encontrar →</span>
              </div>
            </Link>
          </Reveal>
        </div>
      </section>

      {/* Colecciones destacadas */}
      <section className="bg-surface-2 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal className="mb-10 text-center">
            <HomeCollectionsHeader />
          </Reveal>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {collections.map((c, i) => {
              const coverProduct = allProducts.find((p) => p.id === c.productIds[0]);
              return (
                <Reveal key={c.slug} delayMs={i * 100}>
                  <Link
                    href={`/colecciones/${c.slug}`}
                    className="group relative flex aspect-4/5 flex-col justify-end overflow-hidden rounded-2xl p-6 text-left transition-transform hover:-translate-y-1.5"
                  >
                    <PhotoSlot
                      name={`collection-tile-${c.slug}`}
                      alt={c.name}
                      fallback={<CollectionCover collection={c} coverProduct={coverProduct} />}
                    />
                    <span className="relative font-display text-2xl font-semibold uppercase tracking-wide text-white">{c.name}</span>
                    <span className="relative mt-1 text-sm text-white/80">{c.tagline}</span>
                    <span className="relative mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-white">Comprar →</span>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Franja de confianza */}
      <Reveal className="border-y border-line py-8">
        <HomeTrustBar />
      </Reveal>

      {/* Storytelling: culturas + hechas a mano + puentes al resto del sitio.
          Antes Home terminaba en la franja de confianza directamente en el
          catálogo — hueco real detectado: la página se sentía vacía y sin
          ninguna narrativa de marca entre "colecciones" y "catálogo". */}
      <section className="border-b border-line py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal>
            <Link href="/nosotros" className="group relative block aspect-21/9 overflow-hidden rounded-3xl">
              <PhotoSlot
                name="home-culturas"
                alt="Bisutería que une culturas: Venezuela y Colombia"
                fallback={
                  <div className="absolute inset-0 bg-linear-to-br from-[#c9a768] to-[#8a6a34]" />
                }
              />
              <div className="absolute inset-0 bg-linear-to-r from-black/55 via-black/10 to-transparent" />
              <div className="relative flex h-full max-w-lg flex-col justify-center px-8 sm:px-12">
                <p className="mb-3 text-xs font-bold uppercase tracking-widest text-[#e3c665]">Nuestra historia</p>
                <h2 className="font-display text-2xl font-semibold text-white sm:text-3xl">Dos países, una misma forma de crear</h2>
                <p className="mt-3 max-w-sm text-sm text-white/85">
                  Venezuela y Colombia se encuentran en cada pieza ALDARA, hecha a mano en nuestro taller de Puerto Almenara.
                </p>
                <span className="mt-4 inline-block text-sm font-semibold text-white group-hover:underline">Conoce nuestra historia →</span>
              </div>
            </Link>
          </Reveal>

          <div className="mt-6 grid gap-6 sm:grid-cols-3">
            {[
              { name: "home-artesania", href: "/atelier", eyebrow: "Proceso", title: "Hechas a mano", sub: "Cada pieza pasa por manos artesanas en nuestro taller." },
              { name: "home-editorial", href: "/edit", eyebrow: "The Edit", title: "Selección editorial", sub: "Curaduría propia, historias detrás de cada elección." },
              { name: "home-gifts", href: "/regalos", eyebrow: "Para regalar", title: "Regalos con intención", sub: "Envuelto con cuidado, pensado para el momento exacto." },
            ].map((tile, i) => (
              <Reveal key={tile.name} delayMs={i * 100}>
                <Link href={tile.href} className="group relative flex aspect-4/5 flex-col justify-end overflow-hidden rounded-2xl p-6 transition-transform hover:-translate-y-1.5">
                  <PhotoSlot name={tile.name} alt={tile.title} fallback={<div className="absolute inset-0 bg-surface-3" />} />
                  <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-transparent" />
                  <p className="relative text-xs font-bold uppercase tracking-widest text-[#e3c665]">{tile.eyebrow}</p>
                  <span className="relative mt-1 font-display text-xl font-semibold text-white">{tile.title}</span>
                  <span className="relative mt-1 text-sm text-white/80">{tile.sub}</span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Destacados */}
      <section className="mx-auto max-w-6xl px-4 py-24 text-center sm:px-6">
        <Reveal>
          <HomeCatalogTeaser />
        </Reveal>
        <div className="mt-10 grid gap-7 text-left sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((product, i) => (
            <Reveal key={product.id} delayMs={i * 100}>
              <ProductCard product={product} />
            </Reveal>
          ))}
        </div>
        <HomeViewFullCatalogLink />
      </section>

      {/* CTA final */}
      <section className="border-t border-line py-20 text-center text-white" style={{ backgroundColor: "#0d1220" }}>
        <Reveal>
          <HomeFinalCta />
        </Reveal>
      </section>
    </>
  );
}
