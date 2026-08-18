"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import type { Product } from "@/lib/types";
import { ProductVisual } from "./ProductVisual";
import { ProductLightField, useProductPhotoAvailable } from "./ProductPlate";

const FRAME_COUNT = 24;
const FRAME_STEP = 360 / FRAME_COUNT;
const MIN_ZOOM = 1;
const MAX_ZOOM = 2.5;
const DRAG_SENSITIVITY = 0.6;

interface Hotspot {
  id: string;
  xPercent: number;
  yPercent: number;
  label: string;
  detail: string;
}

function buildHotspots(product: Product): Hotspot[] {
  return [
    { id: "materials", xPercent: 72, yPercent: 38, label: "Materiales", detail: product.materials },
    { id: "care", xPercent: 28, yPercent: 62, label: "Acabado y cuidado", detail: product.care },
  ];
}

function subscribeReducedMotion(onChange: () => void): () => void {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}
function getReducedMotionSnapshot(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(subscribeReducedMotion, getReducedMotionSnapshot, () => false);
}

/**
 * Visor 360° — Bloque 9, ref. 9.4. DEMO_SIMULATED: true.
 *
 * No existe captura fotográfica 360° real de ninguna pieza ALDARA todavía.
 * En vez de dejar la experiencia sin construir (lo que estaba PARTIAL antes),
 * esto simula un turntable real: arrastrar/swipe/teclado gira la pieza en
 * pasos de 15° (24 "frames") sobre la misma composición generativa del resto
 * del catálogo (`ProductVisual`/`ProductLightField`), con zoom, pan cuando hay
 * zoom, pantalla completa, hotspots reales (materiales/cuidado del producto,
 * no inventados) y estados de carga/error. Se declara explícitamente como
 * simulación en la UI — no se presenta como fotografía real. Sustituir la capa
 * visual por frames fotográficos reales cuando existan (ver ASSET_REGISTRY.md)
 * sin tocar la interacción, que ya es real y queda congelada.
 */
export function Product360Viewer({ product }: { product: Product }) {
  const [angle, setAngle] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [loading, setLoading] = useState(true);
  const [errored, setErrored] = useState(false);
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ x: number; y: number; angle: number; wasDrag: boolean } | null>(null);
  const panDragRef = useRef<{ x: number; y: number; panX: number; panY: number } | null>(null);
  const reducedMotion = usePrefersReducedMotion();
  const hotspots = buildHotspots(product);

  // Al cambiar de producto, se ajusta el estado durante el propio render
  // (patrón oficial de React para "adjusting state when a prop changes"),
  // en vez de un efecto que haga setState de forma síncrona en su cuerpo.
  const [loadedProductId, setLoadedProductId] = useState(product.id);
  if (loadedProductId !== product.id) {
    setLoadedProductId(product.id);
    setLoading(true);
    setErrored(false);
  }

  useEffect(() => {
    // Simulación honesta de carga de frames — no hay red real que esperar
    // (todo es generativo local), pero el estado de carga en sí es un
    // requisito real de la experiencia (skeleton antes de interactuar).
    // Este setState SÍ es legítimo en un efecto: ocurre de forma asíncrona
    // (tras el timeout), no de forma síncrona en el cuerpo del efecto.
    const t = setTimeout(() => setLoading(false), 450);
    return () => clearTimeout(t);
  }, [product.id]);

  useEffect(() => {
    function onFsChange() {
      setIsFullscreen(document.fullscreenElement === containerRef.current);
    }
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowRight") rotateBySteps(1);
      else if (e.key === "ArrowLeft") rotateBySteps(-1);
      else if (e.key === "+") setZoom((z) => Math.min(MAX_ZOOM, z + 0.25));
      else if (e.key === "-") setZoom((z) => Math.max(MIN_ZOOM, z - 0.25));
      else if (e.key === "0") resetView();
    }
    const node = containerRef.current;
    node?.addEventListener("keydown", onKey);
    return () => node?.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function rotateBySteps(steps: number) {
    setAngle((a) => normalizeAngle(a + steps * FRAME_STEP));
  }

  function normalizeAngle(a: number): number {
    return ((a % 360) + 360) % 360;
  }

  function resetView() {
    setAngle(0);
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }

  function handlePointerDown(e: React.PointerEvent) {
    if (zoom > 1) {
      panDragRef.current = { x: e.clientX, y: e.clientY, panX: pan.x, panY: pan.y };
      return;
    }
    dragRef.current = { x: e.clientX, y: e.clientY, angle, wasDrag: false };
  }

  function handlePointerMove(e: React.PointerEvent) {
    if (panDragRef.current) {
      const dx = e.clientX - panDragRef.current.x;
      const dy = e.clientY - panDragRef.current.y;
      setPan({ x: panDragRef.current.panX + dx, y: panDragRef.current.panY + dy });
      return;
    }
    if (!dragRef.current) return;
    const dx = e.clientX - dragRef.current.x;
    if (Math.abs(dx) > 3) dragRef.current.wasDrag = true;
    setAngle(normalizeAngle(dragRef.current.angle + dx * DRAG_SENSITIVITY));
  }

  function handlePointerUp() {
    if (dragRef.current) {
      // Turntable real: al soltar, encaja al frame de 15° más cercano.
      setAngle((a) => normalizeAngle(Math.round(a / FRAME_STEP) * FRAME_STEP));
    }
    dragRef.current = null;
    panDragRef.current = null;
  }

  function handleWheel(e: React.WheelEvent) {
    e.preventDefault();
    setZoom((z) => Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, z - e.deltaY * 0.001)));
  }

  async function toggleFullscreen() {
    try {
      if (!document.fullscreenElement) {
        await containerRef.current?.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch {
      // Fullscreen API no soportada/permitida: la experiencia sigue
      // funcionando igual dentro del contenedor, solo sin modo a pantalla
      // completa real — no es un error que deba bloquear nada.
      setIsFullscreen((v) => !v);
    }
  }

  const frameIndex = Math.round(angle / FRAME_STEP) % FRAME_COUNT;
  const photoAvailable = useProductPhotoAvailable(product, frameIndex % 3);

  if (errored) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl bg-surface-2 p-10 text-center">
        <p className="font-semibold">No se pudo cargar el visor 360°.</p>
        <button type="button" onClick={() => setErrored(false)} className="rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-ivory">
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      role="application"
      aria-label={`Visor 360° de ${product.name}, arrastra o usa las flechas para girar`}
      className={`relative flex flex-col overflow-hidden rounded-2xl bg-surface-2 outline-none ${isFullscreen ? "fixed inset-0 z-100 rounded-none" : ""}`}
    >
      <div
        className="relative flex flex-1 aspect-square min-h-80 items-center justify-center overflow-hidden"
        onWheel={handleWheel}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        style={{ cursor: zoom > 1 ? "grab" : "ew-resize", touchAction: "none" }}
      >
        {loading ? (
          <div className="flex flex-col items-center gap-3 text-ink-soft">
            <span className="h-8 w-8 animate-spin rounded-full border-2 border-line border-t-terracotta" aria-hidden="true" />
            <p className="text-xs">Cargando visor 360°…</p>
          </div>
        ) : (
          <>
            <div
              className="relative flex h-full w-full items-center justify-center"
              style={{
                transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                transition: reducedMotion ? "none" : "transform 120ms ease-out",
              }}
            >
              <ProductLightField product={product} hue={frameIndex % 3} />
              {!photoAvailable && (
                <div
                  className="relative drop-shadow-[0_10px_22px_rgba(0,0,0,0.16)]"
                  style={{
                    transform: `perspective(900px) rotateY(${angle}deg) scaleX(${0.55 + 0.45 * Math.abs(Math.cos((angle * Math.PI) / 180))})`,
                    transition: reducedMotion || dragRef.current ? "none" : "transform 140ms ease-out",
                  }}
                >
                  <ProductVisual product={product} size={220} />
                </div>
              )}
            </div>

            {hotspots.map((h) => (
              <button
                key={h.id}
                type="button"
                onClick={() => setActiveHotspot((v) => (v === h.id ? null : h.id))}
                aria-expanded={activeHotspot === h.id}
                aria-label={h.label}
                className="absolute flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-terracotta text-xs font-bold text-white shadow-md"
                style={{ left: `${h.xPercent}%`, top: `${h.yPercent}%` }}
              >
                +
              </button>
            ))}
            {activeHotspot && (
              <div className="absolute bottom-3 left-3 right-3 rounded-xl bg-black/80 p-3 text-xs text-white sm:max-w-xs">
                <p className="font-semibold">{hotspots.find((h) => h.id === activeHotspot)?.label}</p>
                <p className="mt-1 text-white/80">{hotspots.find((h) => h.id === activeHotspot)?.detail}</p>
              </div>
            )}
          </>
        )}

        <span className="absolute left-3 top-3 rounded-full bg-black/60 px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-wide text-white">
          360° DEMO · frame {frameIndex + 1}/{FRAME_COUNT}
        </span>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-line bg-surface px-3 py-2.5">
        <div className="flex items-center gap-1.5">
          <button type="button" onClick={() => rotateBySteps(-1)} aria-label="Girar a la izquierda" className="flex h-8 w-8 items-center justify-center rounded-full border border-line hover:border-ink">
            ↺
          </button>
          <button type="button" onClick={() => rotateBySteps(1)} aria-label="Girar a la derecha" className="flex h-8 w-8 items-center justify-center rounded-full border border-line hover:border-ink">
            ↻
          </button>
        </div>
        <div className="flex items-center gap-1.5">
          <button type="button" onClick={() => setZoom((z) => Math.max(MIN_ZOOM, z - 0.25))} aria-label="Alejar" className="flex h-8 w-8 items-center justify-center rounded-full border border-line hover:border-ink">
            −
          </button>
          <span className="w-10 text-center text-xs text-ink-soft">{Math.round(zoom * 100)}%</span>
          <button type="button" onClick={() => setZoom((z) => Math.min(MAX_ZOOM, z + 0.25))} aria-label="Acercar" className="flex h-8 w-8 items-center justify-center rounded-full border border-line hover:border-ink">
            +
          </button>
        </div>
        <button type="button" onClick={resetView} className="rounded-full border border-line px-3 py-1.5 text-xs font-semibold hover:border-ink">
          Restablecer
        </button>
        <button type="button" onClick={toggleFullscreen} className="rounded-full border border-line px-3 py-1.5 text-xs font-semibold hover:border-ink">
          {isFullscreen ? "Salir de pantalla completa" : "Pantalla completa"}
        </button>
      </div>
      <p className="border-t border-line px-3 py-2 text-center text-[0.7rem] text-ink-soft">
        Arrastra, desliza o usa ← → para girar · rueda o +/− para zoom · vista 360° simulada (DEMO), sustituible por fotografía real
      </p>
    </div>
  );
}
