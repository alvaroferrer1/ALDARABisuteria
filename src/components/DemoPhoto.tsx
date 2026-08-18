"use client";

import { PhotoSlot } from "./PhotoSlot";

/**
 * GENERATED_DEMO — composición fotográfica genérica reutilizable (grano +
 * viñeta + silueta difusa teñida), misma técnica que HomeHero/CollectionHero.
 * Se usa para las páginas de contenido demo (Eventos, Colaboraciones,
 * Prensa, Archivo, Exposiciones, Ediciones limitadas, Tiendas, Product
 * Reveal...) donde el mockup pide fotografía real que no existe todavía.
 * Nunca se presenta como fotografía real — siempre documentado como DEMO
 * en el código que la usa.
 *
 * Sustitución preparada: en cuanto exista `public/photos/<seed>.webp` (el
 * mismo `seed` que ya recibe cada caller), se muestra automáticamente en
 * vez de la composición generativa — sin tocar ningún caller. Ver
 * PHOTO_ASSET_MANIFEST.md para el nombre exacto esperado en cada página.
 */
export function DemoPhoto({ seed, tone = "#a9663a", className = "" }: { seed: string; tone?: string; className?: string }) {
  const id = `demo-photo-${seed}`;
  const tilt = (seed.length % 5) * 6 - 12;
  const generative = (
    <svg
      viewBox="0 0 800 800"
      className={`absolute inset-0 h-full w-full overflow-hidden ${className}`}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`${id}-bg`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#20140d" />
          <stop offset="45%" stopColor={tone} stopOpacity="0.55" />
          <stop offset="100%" stopColor={tone} stopOpacity="0.85" />
        </linearGradient>
        <radialGradient id={`${id}-vignette`} cx="65%" cy="40%" r="65%">
          <stop offset="0%" stopColor="#000" stopOpacity="0" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.38" />
        </radialGradient>
        <filter id={`${id}-grain`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" result="noise" />
          <feColorMatrix in="noise" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.05 0" />
        </filter>
        <filter id={`${id}-blur`}>
          <feGaussianBlur stdDeviation="24" />
        </filter>
      </defs>
      <rect width="800" height="800" fill={`url(#${id}-bg)`} />
      <g filter={`url(#${id}-blur)`} opacity="0.9" transform={`rotate(${tilt} 500 420)`}>
        <ellipse cx="480" cy="360" rx="220" ry="300" fill="#c9905f" opacity="0.6" />
        <ellipse cx="600" cy="440" rx="160" ry="240" fill="#7a4526" opacity="0.55" />
      </g>
      <rect width="800" height="800" fill={`url(#${id}-vignette)`} />
      <rect width="800" height="800" filter={`url(#${id}-grain)`} />
    </svg>
  );

  return <PhotoSlot name={seed} alt="" className={className} fallback={generative} />;
}
