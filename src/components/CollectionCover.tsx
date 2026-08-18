import type { Collection } from "@/lib/collections";
import type { Product } from "@/lib/types";
import { ProductVisual } from "./ProductVisual";

/**
 * Portada de colección con textura/profundidad (grano + viñeta + silueta de
 * producto grande de fondo), no un gradiente plano — mismo lenguaje que
 * HeroPhotoPlaceholder, para que la fila de colecciones de Home se sienta
 * como planos fotográficos y no como tarjetas de color sueltas.
 * GENERATED_DEMO: sigue sin ser fotografía real (ver ASSET_REGISTRY.md).
 */
export function CollectionCover({ collection, coverProduct }: { collection: Collection; coverProduct?: Product }) {
  const id = `collection-cover-${collection.slug}`;
  return (
    <svg viewBox="0 0 500 625" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-bg`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={collection.color} stopOpacity="0.5" />
          <stop offset="55%" stopColor={collection.color} stopOpacity="0.18" />
          <stop offset="100%" stopColor="var(--surface)" stopOpacity="0.05" />
        </linearGradient>
        <radialGradient id={`${id}-vignette`} cx="50%" cy="35%" r="75%">
          <stop offset="0%" stopColor="#000" stopOpacity="0" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.3" />
        </radialGradient>
        <linearGradient id={`${id}-scrim`} x1="0%" y1="60%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#000" stopOpacity="0" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.55" />
        </linearGradient>
        <filter id={`${id}-grain`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch" result="noise" />
          <feColorMatrix in="noise" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.045 0" />
        </filter>
      </defs>
      <rect width="500" height="625" fill="var(--surface-2)" />
      <rect width="500" height="625" fill={`url(#${id}-bg)`} />
      <rect width="500" height="625" fill={`url(#${id}-vignette)`} />
      <rect width="500" height="625" fill={`url(#${id}-scrim)`} />
      <rect width="500" height="625" filter={`url(#${id}-grain)`} />
      {coverProduct && (
        <foreignObject x="150" y="140" width="200" height="200" opacity="0.85">
          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: collection.color }}>
            <ProductVisual product={coverProduct} size={170} />
          </div>
        </foreignObject>
      )}
    </svg>
  );
}
