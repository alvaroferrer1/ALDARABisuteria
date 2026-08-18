"use client";

import { useState } from "react";
import type { Product } from "@/lib/types";
import { ProductVisual } from "./ProductVisual";
import { ProductLightField, useProductPhotoAvailable } from "./ProductPlate";
import { ProductLightbox } from "./ProductLightbox";

const SLIDES = [0, 1, 2];

/**
 * GENERATED_DEMO — galería con 3 encuadres simulados del mismo icono
 * vectorial (frontal, detalle girado, acabado) sobre un fondo generativo
 * (`ProductLightField`, gradientes SVG, no fotografía) hasta que exista
 * fotografía de producto real. Ver ASSET_REGISTRY.md.
 *
 * Layout calcado del mockup PDP (p.19): columna de miniaturas a la
 * izquierda + imagen grande a la derecha, en vez de flechas+dots sobre la
 * imagen — gap real detectado y corregido en la auditoría visual (ref. 1.8).
 *
 * La imagen grande abre `ProductLightbox` (zoom+pan reales) — versión
 * honesta del "Visor interactivo" del Bloque 9 (ref. 9.4): sin 360°/macro/
 * vídeo reales que mostrar, pero el zoom y el pan sí son reales.
 */
export function ProductGallery({ product }: { product: Product }) {
  const [slide, setSlide] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const slidePhotoAvailable = useProductPhotoAvailable(product, slide);

  return (
    <div className="flex flex-col gap-3 sm:flex-row-reverse">
      <button
        type="button"
        onClick={() => setLightboxOpen(true)}
        aria-label="Abrir visor con zoom"
        className="group relative flex flex-1 aspect-square items-center justify-center overflow-hidden rounded-3xl bg-surface-2"
      >
        <ProductLightField product={product} hue={slide} />
        {!slidePhotoAvailable && (
          <div className={`relative drop-shadow-[0_8px_18px_rgba(0,0,0,0.14)] ${slide === 1 ? "rotate-18" : ""}`}>
            <ProductVisual product={product} size={180} />
          </div>
        )}
        <span className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full bg-black/50 px-3 py-1.5 text-xs font-semibold text-white opacity-0 transition-opacity group-hover:opacity-100">
          <svg viewBox="0 0 24 24" width="14" aria-hidden="true">
            <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="2" />
            <path d="m20 20-3.5-3.5M11 8v6M8 11h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          Zoom
        </span>
      </button>

      {lightboxOpen && <ProductLightbox product={product} initialSlide={slide} onClose={() => setLightboxOpen(false)} />}

      <div className="flex shrink-0 flex-row gap-2 sm:w-16 sm:flex-col">
        {SLIDES.map((i) => (
          <GalleryThumb key={i} product={product} hue={i} active={slide === i} onSelect={() => setSlide(i)} />
        ))}
      </div>
    </div>
  );
}

function GalleryThumb({ product, hue, active, onSelect }: { product: Product; hue: number; active: boolean; onSelect: () => void }) {
  const photoAvailable = useProductPhotoAvailable(product, hue);
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-label={`Ver foto ${hue + 1}`}
      aria-current={active}
      className={`relative flex aspect-square flex-1 items-center justify-center overflow-hidden rounded-xl border-2 bg-surface-2 sm:flex-none ${
        active ? "border-ink" : "border-transparent hover:border-line"
      }`}
    >
      <ProductLightField product={product} hue={hue} />
      {!photoAvailable && (
        <div className={`relative ${hue === 1 ? "rotate-18" : ""}`}>
          <ProductVisual product={product} size={30} />
        </div>
      )}
    </button>
  );
}
