import type { Collection } from "@/lib/collections";
import { Reveal } from "./Reveal";
import { PhotoSlot } from "./PhotoSlot";

/**
 * Hero de colección individual — calcado en COMPOSICIÓN del mockup
 * "22. Colección individual" (ALDARA_Propuesta_Cliente_FINAL_v2.pdf p.21,
 * ficha "RAÍCES"): foto a sangre completa con retrato+collar, nombre de la
 * colección en display grande sobre velo oscuro, tagline, CTA "Descubrir
 * colección". Antes esta página tenía solo texto centrado sobre un fondo
 * `color-mix` plano — gap real detectado en la auditoría visual (ref. 2.2).
 *
 * GENERATED_DEMO: sin fotografía real todavía, misma técnica que
 * `HomeHero`/`CollectionCover` (grano feTurbulence + silueta + viñeta),
 * teñida con el color de acento de cada colección.
 */
export function CollectionHero({ collection }: { collection: Collection }) {
  return (
    <section className="relative overflow-hidden">
      <div className="relative aspect-auto min-h-115 w-full sm:aspect-21/9 sm:min-h-0 lg:aspect-21/8">
        <PhotoSlot
          name={`collection-${collection.slug}`}
          alt={collection.name}
          fallback={<CollectionPhotoPlaceholder color={collection.color} seed={collection.slug} />}
        />

        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(100deg, rgba(15,10,8,0.7) 0%, rgba(15,10,8,0.42) 40%, rgba(15,10,8,0.05) 68%, rgba(15,10,8,0) 88%)" }}
          aria-hidden="true"
        />

        <div className="relative z-10 flex h-full flex-col justify-center px-4 py-14 sm:px-8 lg:px-16">
          <Reveal className="max-w-md">
            <p className="mb-3 text-xs font-bold uppercase tracking-widest" style={{ color: collection.color }}>
              Colección
            </p>
            <h1 className="font-display text-5xl font-semibold leading-[1.05] text-white sm:text-6xl">{collection.name}</h1>
            <p className="mt-4 max-w-sm text-lg text-white/85">{collection.tagline}</p>
            <div className="mt-7">
              <a
                href="#piezas"
                className="inline-block rounded-full bg-white px-7 py-3.5 font-semibold text-[#140c08] transition-transform hover:-translate-y-0.5"
              >
                Descubrir colección
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function CollectionPhotoPlaceholder({ color, seed }: { color: string; seed: string }) {
  const id = `collhero-${seed}`;
  // pequeña variación determinista de composición entre colecciones para que no sean clones
  const tilt = (seed.length % 5) * 6 - 12;
  return (
    <svg viewBox="0 0 1600 900" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-bg`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#20140d" />
          <stop offset="45%" stopColor={color} stopOpacity="0.55" />
          <stop offset="100%" stopColor={color} stopOpacity="0.85" />
        </linearGradient>
        <radialGradient id={`${id}-vignette`} cx="68%" cy="42%" r="65%">
          <stop offset="0%" stopColor="#000" stopOpacity="0" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.4" />
        </radialGradient>
        <linearGradient id={`${id}-skin`} x1="0%" y1="0%" x2="100%" y2="60%">
          <stop offset="0%" stopColor="#c98a5c" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#7d4c2d" stopOpacity="0.45" />
        </linearGradient>
        <filter id={`${id}-grain`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" result="noise" />
          <feColorMatrix in="noise" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.05 0" />
        </filter>
        <filter id={`${id}-blur`}>
          <feGaussianBlur stdDeviation="20" />
        </filter>
      </defs>

      <rect width="1600" height="900" fill={`url(#${id}-bg)`} />

      {/* Silueta difusa de hombro/cuello, sugiriendo el retrato del mockup */}
      <g filter={`url(#${id}-blur)`} opacity="0.92" transform={`rotate(${tilt} 1150 500)`}>
        <path d="M950 0 C1150 60 1320 220 1360 420 C1400 620 1320 800 1150 900 L1600 900 L1600 0 Z" fill={`url(#${id}-skin)`} />
      </g>

      {/* Collar con colgante — anillos concéntricos y colgante colgando, tono de la colección */}
      <g transform="translate(1180 480)">
        <path d="M-120 -40 Q0 60 120 -40" fill="none" stroke="#f0d089" strokeWidth="6" opacity="0.85" />
        <circle cx="0" cy="70" r="26" fill="#f0d089" opacity="0.92" />
        <circle cx="0" cy="70" r="10" fill={color} opacity="0.8" />
      </g>

      <rect width="1600" height="900" fill={`url(#${id}-vignette)`} />
      <rect width="1600" height="900" filter={`url(#${id}-grain)`} />
    </svg>
  );
}
