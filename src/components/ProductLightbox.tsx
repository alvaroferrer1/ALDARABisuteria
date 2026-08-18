"use client";

import { useEffect, useRef, useState } from "react";
import type { Product } from "@/lib/types";
import { ProductVisual } from "./ProductVisual";
import { ProductLightField, useProductPhotoAvailable } from "./ProductPlate";
import { Product360Viewer } from "./Product360Viewer";

const MIN_ZOOM = 1;
const MAX_ZOOM = 3;

/**
 * Visor interactivo (Bloque 9, ref. 9.4) — versión honesta y ESTABLE de lo
 * que pide el mockup (p.53: zoom, pan, 360°, hotspots, macro, lightbox,
 * vídeo, comparación). No hay fotografía macro real, vídeo del proceso ni
 * captura 360° real que mostrar — construir esas partes sería fingir
 * contenido que no existe. Lo que SÍ es real y se construye aquí: un
 * lightbox real con zoom (rueda/botones) y pan (arrastrar), sobre las
 * mismas composiciones generativas de la galería. GENERATED_DEMO.
 */
export function ProductLightbox({ product, initialSlide = 0, onClose }: { product: Product; initialSlide?: number; onClose: () => void }) {
  const [mode, setMode] = useState<"foto" | "360">("foto");
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<{ x: number; y: number; panX: number; panY: number } | null>(null);
  const photoAvailable = useProductPhotoAvailable(product, initialSlide);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "+") setZoom((z) => Math.min(MAX_ZOOM, z + 0.25));
      if (e.key === "-") setZoom((z) => Math.max(MIN_ZOOM, z - 0.25));
    }
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  function resetView() {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }

  function handleWheel(e: React.WheelEvent) {
    e.preventDefault();
    setZoom((z) => Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, z - e.deltaY * 0.001)));
  }

  function handlePointerDown(e: React.PointerEvent) {
    if (zoom <= 1) return;
    dragRef.current = { x: e.clientX, y: e.clientY, panX: pan.x, panY: pan.y };
    setIsDragging(true);
  }
  function handlePointerMove(e: React.PointerEvent) {
    if (!dragRef.current) return;
    const dx = e.clientX - dragRef.current.x;
    const dy = e.clientY - dragRef.current.y;
    setPan({ x: dragRef.current.panX + dx, y: dragRef.current.panY + dy });
  }
  function handlePointerUp() {
    dragRef.current = null;
    setIsDragging(false);
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Visor de ${product.name}`}
      className="fixed inset-0 z-100 flex flex-col bg-black/92"
      onClick={onClose}
    >
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-3">
          <p className="text-sm font-semibold text-white">{product.name}</p>
          <div className="flex rounded-full bg-white/10 p-0.5 text-xs font-semibold text-white">
            <button
              type="button"
              onClick={() => setMode("foto")}
              aria-pressed={mode === "foto"}
              className={`rounded-full px-3 py-1.5 ${mode === "foto" ? "bg-white text-[#140c08]" : ""}`}
            >
              Foto
            </button>
            <button
              type="button"
              onClick={() => setMode("360")}
              aria-pressed={mode === "360"}
              className={`rounded-full px-3 py-1.5 ${mode === "360" ? "bg-white text-[#140c08]" : ""}`}
            >
              360°
            </button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {mode === "foto" && (
            <>
              <button
                type="button"
                onClick={() => setZoom((z) => Math.max(MIN_ZOOM, z - 0.25))}
                aria-label="Alejar"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
              >
                −
              </button>
              <span className="w-10 text-center text-xs text-white/70">{Math.round(zoom * 100)}%</span>
              <button
                type="button"
                onClick={() => setZoom((z) => Math.min(MAX_ZOOM, z + 0.25))}
                aria-label="Acercar"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
              >
                +
              </button>
              <button type="button" onClick={resetView} className="rounded-full bg-white/10 px-3 py-2 text-xs font-semibold text-white hover:bg-white/20">
                Restablecer
              </button>
            </>
          )}
          <button type="button" onClick={onClose} aria-label="Cerrar visor" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20">
            ✕
          </button>
        </div>
      </div>

      {mode === "foto" ? (
        <>
          <div
            className="relative flex flex-1 items-center justify-center overflow-hidden px-4 pb-6"
            onClick={(e) => e.stopPropagation()}
            onWheel={handleWheel}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
            style={{ cursor: zoom > 1 ? "grab" : "default" }}
          >
            <div
              className="relative flex aspect-square w-full max-w-xl items-center justify-center overflow-hidden rounded-2xl bg-surface-2"
              style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`, transition: isDragging ? "none" : "transform 150ms ease-out" }}
            >
              <ProductLightField product={product} hue={initialSlide} />
              {!photoAvailable && (
                <div className={`relative drop-shadow-[0_8px_18px_rgba(0,0,0,0.14)] ${initialSlide === 1 ? "rotate-18" : ""}`}>
                  <ProductVisual product={product} size={260} />
                </div>
              )}
            </div>
          </div>
          <p className="pb-4 text-center text-xs text-white/50">Rueda del ratón o botones +/− para hacer zoom · arrastra para mover · Esc para cerrar</p>
        </>
      ) : (
        <div className="flex flex-1 items-center justify-center overflow-hidden px-4 pb-6" onClick={(e) => e.stopPropagation()}>
          <div className="w-full max-w-xl">
            <Product360Viewer product={product} />
          </div>
        </div>
      )}
    </div>
  );
}
