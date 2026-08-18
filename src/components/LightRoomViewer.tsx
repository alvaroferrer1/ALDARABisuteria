"use client";

import { useState } from "react";
import type { Product } from "@/lib/types";
import { ProductVisual } from "./ProductVisual";
import { ProductLightbox } from "./ProductLightbox";
import { productPhotoName, useProductPhotoAvailable } from "./ProductPlate";
import { usePhotoAvailable } from "@/context/PhotoManifestContext";

/**
 * The Light Room (Bloque 9, ref. 9.3) — implementado con la OPCIÓN B del
 * mockup (variantes de render/imagen en vez de WebGL/3D real, que sería
 * inestable de construir y verificar en el tiempo disponible): 6 presets de
 * luz reales que cambian filtros CSS (brillo/contraste/temperatura de
 * color) y el fondo, sobre la misma composición generativa de producto.
 * GENERATED_DEMO — sin fotografía real todavía.
 *
 * Sustitución preparada: en cuanto exista `public/photos/lightroom-<slug>.
 * webp` (una foto neutra de estudio, luz plana, para que los 6 filtros CSS
 * de este componente se apliquen sobre fotografía real en vez de sobre el
 * icono vectorial), este componente la usa automáticamente y aplica los
 * mismos filtros de brillo/contraste/temperatura por encima.
 */
const LIGHT_PRESETS = [
  { key: "warm", label: "Luz cálida", bg: "radial-gradient(circle at 35% 30%, #e3c088, #7a4526)", filter: "brightness(1.05) saturate(1.15) sepia(0.08)" },
  { key: "cool", label: "Luz fría", bg: "radial-gradient(circle at 35% 30%, #cfe0e8, #37505c)", filter: "brightness(1.02) saturate(0.95) hue-rotate(-8deg)" },
  { key: "golden", label: "Golden hour", bg: "radial-gradient(circle at 30% 25%, #f5c463, #8a4a1c)", filter: "brightness(1.12) saturate(1.3) sepia(0.18) contrast(1.05)" },
  { key: "interior", label: "Interior", bg: "radial-gradient(circle at 40% 35%, #d9c9a8, #4a3a28)", filter: "brightness(0.98) saturate(1.05) contrast(1.02)" },
  { key: "night", label: "Noche", bg: "radial-gradient(circle at 45% 30%, #4a5a78, #10141f)", filter: "brightness(0.85) saturate(0.85) hue-rotate(-15deg) contrast(1.1)" },
  { key: "soft", label: "Luz suave", bg: "radial-gradient(circle at 35% 30%, #f2ece0, #b8a988)", filter: "brightness(1.08) saturate(0.9) contrast(0.95)" },
] as const;

export function LightRoomViewer({ product }: { product: Product }) {
  const [presetKey, setPresetKey] = useState<(typeof LIGHT_PRESETS)[number]["key"]>("warm");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const preset = LIGHT_PRESETS.find((p) => p.key === presetKey)!;
  const lightRoomPhotoName = `lightroom-${product.slug}`;
  const hasLightRoomPhoto = usePhotoAvailable(lightRoomPhotoName);
  const hasProductPhoto = useProductPhotoAvailable(product);

  return (
    <div>
      <button
        type="button"
        onClick={() => setLightboxOpen(true)}
        aria-label="Abrir visor con zoom"
        className="relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-3xl transition-[background] duration-500"
        style={{ background: preset.bg }}
      >
        {hasLightRoomPhoto || hasProductPhoto ? (
          // eslint-disable-next-line @next/next/no-img-element -- misma foto de producto ya usada en el resto del sitio, filtro CSS aplicado en vivo
          <img
            src={`/photos/${hasLightRoomPhoto ? lightRoomPhotoName : productPhotoName(product)}.webp`}
            alt={product.name}
            className="absolute inset-0 h-full w-full object-cover transition-[filter] duration-500"
            style={{ filter: preset.filter }}
          />
        ) : (
          <div className="relative drop-shadow-[0_12px_28px_rgba(0,0,0,0.25)] transition-[filter] duration-500" style={{ filter: preset.filter }}>
            <ProductVisual product={product} size={220} />
          </div>
        )}
        <span className="absolute bottom-4 right-4 rounded-full bg-black/40 px-3 py-1.5 text-xs font-semibold text-white">Zoom</span>
      </button>

      <div className="mt-5 flex flex-wrap justify-center gap-2">
        {LIGHT_PRESETS.map((p) => (
          <button
            key={p.key}
            type="button"
            onClick={() => setPresetKey(p.key)}
            aria-pressed={presetKey === p.key}
            className={`rounded-full border px-4 py-2 text-sm font-semibold ${presetKey === p.key ? "border-ink bg-ink text-ivory" : "border-line hover:border-ink"}`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {lightboxOpen && <ProductLightbox product={product} initialSlide={0} onClose={() => setLightboxOpen(false)} />}
    </div>
  );
}
