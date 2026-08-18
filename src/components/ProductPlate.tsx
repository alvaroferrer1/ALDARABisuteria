"use client";

import type { Product } from "@/lib/types";
import { ProductVisual } from "./ProductVisual";
import { PhotoSlot } from "./PhotoSlot";
import { usePhotoAvailable } from "@/lib/usePhotoAvailable";

const TINT_VAR = ["var(--gold)", "var(--terracotta)", "var(--blue)"] as const;

/** Nombre de archivo esperado en `public/photos/` para la foto de un producto — ver PHOTO_ASSET_MANIFEST.md. */
export function productPhotoName(product: Product, hue = 0) {
  return `product-${product.slug}-${hue}`;
}

/**
 * GENERATED_DEMO — composición vectorial procedural (gradientes + filtro SVG),
 * NO fotografía. Simula un plano de estudio con luz controlada por detrás del
 * icono de producto: gradiente radial de "luz" + un arco de "reflejo de metal"
 * con blur, sobre un fondo neutro. Sustituir por fotografía macro real cuando
 * exista (ver PHOTO_ASSET_MANIFEST.md). El objetivo es que el catálogo se
 * sienta como un plano de producto cuidado, no un icono suelto sobre fondo
 * plano.
 *
 * Sustitución preparada: en cuanto exista `public/photos/product-<slug>-
 * <hue>.webp`, este mismo componente lo muestra automáticamente en vez de
 * la composición generativa — sin tocar ningún caller (`ProductPlate`,
 * `ProductGallery`, `ProductLightbox`, `Product360Viewer`,
 * `PersonalizationConfigurator`, `EditCover`).
 */
/**
 * Solo el fondo generativo/foto (sin icono) — para composiciones que necesitan
 * controlar el icono/rotación por separado, como `ProductGallery`.
 */
export function ProductLightField({ product, hue = 0 }: { product: Product; hue?: number }) {
  const tint = TINT_VAR[product.tint];
  const gradientId = `plate-light-${product.id}-${hue}`;
  const glowId = `plate-glow-${product.id}-${hue}`;
  const grainId = `plate-grain-${product.id}-${hue}`;
  // hue desplaza el punto de luz para dar variación entre "encuadres" simulados de un mismo producto
  const cx = 32 + hue * 14;
  const cy = 28 - hue * 6;

  const generative = (
    <svg
      viewBox="0 0 200 200"
      className="absolute inset-0 h-full w-full overflow-hidden"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id={gradientId} cx={`${cx}%`} cy={`${cy}%`} r="75%">
          <stop offset="0%" stopColor={tint} stopOpacity="0.22" />
          <stop offset="45%" stopColor={tint} stopOpacity="0.08" />
          <stop offset="100%" stopColor={tint} stopOpacity="0" />
        </radialGradient>
        <linearGradient id={glowId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--ivory)" stopOpacity="0.55" />
          <stop offset="55%" stopColor="var(--ivory)" stopOpacity="0" />
        </linearGradient>
        <radialGradient id={`${gradientId}-vignette`} cx="50%" cy="45%" r="72%">
          <stop offset="0%" stopColor="#000" stopOpacity="0" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.16" />
        </radialGradient>
        <filter id={`${gradientId}-blur`}>
          <feGaussianBlur stdDeviation="14" />
        </filter>
        {/* Grano fotográfico sutil — mismo lenguaje que HomeHero/CollectionCover,
            para que cada plano de producto se sienta como estudio fotográfico
            y no como un icono plano sobre un degradado. */}
        <filter id={grainId}>
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" result="noise" />
          <feColorMatrix in="noise" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.035 0" />
        </filter>
      </defs>
      <rect width="200" height="200" fill={`url(#${gradientId})`} />
      {/* Arco de "reflejo de metal": elipse desenfocada, simula un highlight de estudio, no una foto */}
      <ellipse cx={60 + hue * 20} cy="46" rx="90" ry="30" fill={`url(#${glowId})`} filter={`url(#${gradientId}-blur)`} opacity="0.6" />
      <rect width="200" height="200" fill={`url(#${gradientId}-vignette)`} />
      <rect width="200" height="200" filter={`url(#${grainId})`} />
    </svg>
  );

  return <PhotoSlot name={productPhotoName(product, hue)} alt={product.name} fallback={generative} />;
}

/** Igual que `usePhotoAvailable`, ya con el nombre de archivo correcto para este producto — para que los callers que dibujan un icono/silueta ENCIMA de `ProductLightField` sepan cuándo ocultarlo. */
export function useProductPhotoAvailable(product: Product, hue = 0) {
  return usePhotoAvailable(productPhotoName(product, hue));
}

export function ProductPlate({
  product,
  className = "aspect-square rounded-2xl",
  iconSize = 72,
}: {
  product: Product;
  /** Controla aspect ratio y radio de borde del contenedor; por defecto un plano cuadrado. */
  className?: string;
  /**
   * Bug real corregido: el icono se dibujaba siempre a 72px pase lo que
   * pase el tamaño del contenedor. En una card de catálogo (~230px) se ve
   * proporcionado; en un panel de hero (~700px, p. ej. `/contacto`) un
   * icono de 72px es prácticamente invisible — el resultado real era un
   * panel que parecía vacío. Los llamadores a tamaño hero deben pasar un
   * `iconSize` grande (200+) para que el icono ancle la composición.
   */
  iconSize?: number;
}) {
  // Bug real corregido en auditoría visual: el contenedor exterior no puede
  // llevar `position: relative` fijo aquí, porque cuando un caller pasa
  // "absolute inset-0" en `className` (ProductCard, para llenar la tarjeta
  // completa) Tailwind genera "relative" y "absolute" en un orden fijo en su
  // hoja de estilos — "relative" gana pase lo que pase el orden en el HTML,
  // así que el contenedor se quedaba en flujo normal y colapsaba a la altura
  // del icono (72px) en vez de llenar la tarjeta entera (~234px), dejando un
  // hueco blanco enorme debajo en CADA tarjeta de producto de todo el sitio.
  // Ahora el posicionamiento lo decide siempre quien llama (`className`), y
  // un div interior fijo en `relative h-full w-full` da el contexto de
  // posicionamiento que `ProductLightField` necesita, sin pelearse con nada.
  //
  // El icono vectorial solo tiene sentido sobre el plano generativo — en
  // cuanto exista `product-<slug>-0.webp`, `ProductLightField` lo muestra
  // solo y el icono debe desaparecer (no tiene sentido un icono flotando
  // sobre una foto real). `useProductPhotoAvailable` usa el mismo sondeo
  // que `ProductLightField` internamente, así que ambos coinciden siempre.
  const photoAvailable = useProductPhotoAvailable(product);
  return (
    <div className={`flex items-center justify-center overflow-hidden bg-surface-2 ${className}`} aria-hidden="true">
      <div className="relative h-full w-full">
        <ProductLightField product={product} />
        {!photoAvailable && (
          <div className="absolute inset-0 flex items-center justify-center drop-shadow-[0_6px_14px_rgba(0,0,0,0.12)]">
            <ProductVisual product={product} size={iconSize} />
          </div>
        )}
      </div>
    </div>
  );
}
