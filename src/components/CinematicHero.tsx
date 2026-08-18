"use client";

import Link from "next/link";
import { getProductById } from "@/lib/products";
import { ProductVisual } from "./ProductVisual";
import { Reveal } from "./Reveal";

/**
 * ACT 1 de la Home. GENERATED_DEMO (ver ASSET_REGISTRY.md): sin fotografía
 * real de producto, esta escena usa una dirección artística propia —
 * escenario oscuro deliberado (rompe con el resto de la web, en ivory),
 * halo de luz generativo detrás de una pieza real ampliada a gran escala,
 * y una entrada de texto coreografiada por scroll (`Reveal`). No es un
 * fondo decorativo: es la pieza más pedida del catálogo (`Mapa del Alma`,
 * ver su `story` real) puesta en el centro de la narrativa de marca.
 *
 * Colores fijos (no ligados a --ink/--ivory, que se invierten en dark mode):
 * esta escena es intencionalmente oscura en cualquier tema del sitio.
 */
export function CinematicHero() {
  const heroPiece = getProductById("p9"); // Mapa del Alma — "la pieza que más nos han pedido"

  return (
    <section
      className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden bg-[#161009] px-4 text-center text-[#faf5ec]"
      aria-label="Presentación de ALDARA"
    >
      {/* Escena generativa de fondo: spotlight + constelación de puntos de luz */}
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full opacity-90" aria-hidden="true">
        <defs>
          <radialGradient id="hero-spotlight" cx="50%" cy="34%" r="60%">
            <stop offset="0%" stopColor="#3a2b16" stopOpacity="0.9" />
            <stop offset="55%" stopColor="#211709" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#161009" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="100" height="100" fill="url(#hero-spotlight)" />
        {[
          [12, 18], [82, 12], [22, 68], [70, 74], [46, 8], [90, 46], [8, 50], [58, 86], [34, 40], [78, 88],
        ].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={0.35 + (i % 3) * 0.15} fill="#d9b471" opacity={0.35 + (i % 4) * 0.1} />
        ))}
      </svg>

      {/* Halo + pieza hero a gran escala */}
      <div className="relative mb-8 flex h-[220px] w-[220px] items-center justify-center sm:h-[280px] sm:w-[280px]">
        <div
          className="motion-safe:animate-[aldara-drift_9s_ease-in-out_infinite] absolute inset-0 rounded-full blur-3xl"
          style={{ background: "radial-gradient(circle, rgba(217,180,113,0.35) 0%, rgba(217,180,113,0) 70%)" }}
          aria-hidden="true"
        />
        {heroPiece && (
          <div className="motion-safe:animate-[aldara-float_8s_ease-in-out_infinite] relative drop-shadow-[0_20px_40px_rgba(0,0,0,0.5)]">
            <ProductVisual product={heroPiece} size={140} />
          </div>
        )}
      </div>

      <Reveal>
        <p className="mb-4 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#d9b471]">
          <svg viewBox="0 0 3 2" width="20" role="img" aria-label="Venezuela">
            <rect width="3" height="2" fill="#00247D" />
              <rect width="3" height="0.666" fill="#FFCC00" />
              <rect width="3" height="0.666" y="1.333" fill="#CF142B" />
          </svg>
          <span>+</span>
          <svg viewBox="0 0 3 2" width="20" role="img" aria-label="Colombia">
            <rect width="3" height="1" fill="#FCD116" />
              <rect width="3" height="0.5" y="1" fill="#003893" />
              <rect width="3" height="0.5" y="1.5" fill="#CE1126" />
          </svg>
          <span>Hecho a mano en Puerto Almenara</span>
        </p>
      </Reveal>

      <Reveal delayMs={150}>
        <h1 className="mx-auto max-w-3xl font-display text-5xl font-semibold leading-[1.05] sm:text-7xl">
          Dos países.
          <br />
          Un mismo mapa.
        </h1>
      </Reveal>

      <Reveal delayMs={300}>
        <p className="mx-auto mt-6 max-w-md text-lg text-[#f3ece0]/80">
          {heroPiece?.story ?? "Piezas hechas a mano que tejen la tradición de Venezuela y Colombia en cada pieza."}
        </p>
      </Reveal>

      <Reveal delayMs={450}>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/shop"
            className="rounded-full bg-[#faf5ec] px-7 py-3.5 font-semibold text-[#161009] transition-transform hover:-translate-y-0.5"
          >
            Ver catálogo
          </Link>
          <a
            href="#descubre"
            className="rounded-full border border-[#faf5ec]/40 px-7 py-3.5 font-semibold text-[#faf5ec] transition-colors hover:bg-[#faf5ec]/10"
          >
            Descubre la historia
          </a>
        </div>
      </Reveal>

      <a
        href="#descubre"
        className="motion-safe:animate-bounce absolute bottom-8 flex flex-col items-center gap-1.5 text-xs font-medium text-[#f3ece0]/60 hover:text-[#f3ece0]"
      >
        Desliza
        <svg viewBox="0 0 24 24" width="16" aria-hidden="true">
          <path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </a>
    </section>
  );
}
