"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { PRODUCTS } from "@/lib/products";
import { ProductVisual } from "./ProductVisual";
import { demo2DTryOnProvider, cameraApiAvailable } from "@/lib/tryOn";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { money } from "@/lib/storage";
import type { Product } from "@/lib/types";

const MOVE_STEP = 2;
const SCALE_STEP = 0.1;
const ROTATE_STEP = 10;

interface OverlayTransform {
  xPercent: number;
  yPercent: number;
  scale: number;
  rotation: number;
}

function transformFor(product: Product): OverlayTransform {
  const overlay = demo2DTryOnProvider.getOverlayForProduct(product);
  return { xPercent: overlay.anchor.xPercent, yPercent: overlay.anchor.yPercent, scale: overlay.defaultScale, rotation: 0 };
}

/**
 * Try-On (Master #28) — nivel 1 progresivo. El MASTER lo condiciona a
 * "si es viable"; para este entorno, viable significa: cámara del navegador
 * O foto subida (siempre hay un camino funcional, nunca "no disponible"),
 * overlay 2D real posicionable a mano (`Demo2DTryOnProvider`, ver
 * lib/tryOn.ts), sin AR/WebXR. Procesamiento 100% local: la foto nunca se
 * envía a ningún servidor, y "guardar previsualización" descarga un archivo
 * en el propio dispositivo, no lo sube a ningún sitio.
 */
export function TryOnStage({ initialProductId }: { initialProductId?: string }) {
  const [photoSrc, setPhotoSrc] = useState<string | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState(initialProductId ?? PRODUCTS[0].id);
  const [compareId, setCompareId] = useState<string | null>(null);
  const [transform, setTransform] = useState<OverlayTransform>(() => transformFor(PRODUCTS.find((p) => p.id === initialProductId) ?? PRODUCTS[0]));
  const [compareTransform, setCompareTransform] = useState<OverlayTransform | null>(null);
  const [savedUrl, setSavedUrl] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dragRef = useRef<{ startX: number; startY: number; base: OverlayTransform; which: "main" | "compare" } | null>(null);
  const { toggle: toggleWishlist, has: hasInWishlist } = useWishlist();
  const { addItem } = useCart();

  const selected = PRODUCTS.find((p) => p.id === selectedId) ?? PRODUCTS[0];
  const compareProduct = compareId ? PRODUCTS.find((p) => p.id === compareId) : null;

  // Ajuste de estado al cambiar de pieza/comparación durante el propio
  // render (patrón oficial de React), en vez de un efecto con setState
  // síncrono en su cuerpo — evita el antipatrón ya documentado en el resto
  // del proyecto (ver lib/store.ts).
  const [trackedSelectedId, setTrackedSelectedId] = useState(selectedId);
  if (trackedSelectedId !== selectedId) {
    setTrackedSelectedId(selectedId);
    setTransform(transformFor(selected));
    setSavedUrl(null);
  }

  const [trackedCompareId, setTrackedCompareId] = useState(compareId);
  if (trackedCompareId !== compareId) {
    setTrackedCompareId(compareId);
    setCompareTransform(compareProduct ? transformFor(compareProduct) : null);
  }

  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  async function startCamera() {
    setCameraError(null);
    if (!cameraApiAvailable()) {
      setCameraError("Tu navegador no permite acceso a la cámara aquí. Sube una foto en su lugar.");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setCameraActive(true);
    } catch {
      setCameraError("No se pudo acceder a la cámara (permiso denegado o no disponible). Sube una foto en su lugar.");
      setCameraActive(false);
    }
  }

  function capturePhoto() {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0);
    setPhotoSrc(canvas.toDataURL("image/jpeg", 0.9));
    // Privacidad: en cuanto se captura el frame, se detiene la cámara —
    // no se mantiene el stream abierto más de lo necesario.
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setCameraActive(false);
  }

  function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPhotoSrc(typeof reader.result === "string" ? reader.result : null);
    reader.readAsDataURL(file); // Local: FileReader nunca hace una petición de red.
  }

  function clearPhoto() {
    setPhotoSrc(null);
    setSavedUrl(null);
  }

  function updateTransform(which: "main" | "compare", patch: Partial<OverlayTransform>) {
    function apply(prev: OverlayTransform | null): OverlayTransform {
      const base = prev ?? transformFor(which === "main" ? selected : compareProduct!);
      return {
        xPercent: Math.min(95, Math.max(5, patch.xPercent ?? base.xPercent)),
        yPercent: Math.min(95, Math.max(5, patch.yPercent ?? base.yPercent)),
        scale: Math.min(2.5, Math.max(0.2, patch.scale ?? base.scale)),
        rotation: patch.rotation ?? base.rotation,
      };
    }
    if (which === "main") setTransform((prev) => apply(prev));
    else setCompareTransform((prev) => apply(prev));
  }

  function handleOverlayKeyDown(which: "main" | "compare", e: React.KeyboardEvent) {
    const t = which === "main" ? transform : compareTransform;
    if (!t) return;
    if (e.key === "ArrowLeft") updateTransform(which, { xPercent: t.xPercent - MOVE_STEP });
    else if (e.key === "ArrowRight") updateTransform(which, { xPercent: t.xPercent + MOVE_STEP });
    else if (e.key === "ArrowUp") updateTransform(which, { yPercent: t.yPercent - MOVE_STEP });
    else if (e.key === "ArrowDown") updateTransform(which, { yPercent: t.yPercent + MOVE_STEP });
    else if (e.key === "+") updateTransform(which, { scale: t.scale + SCALE_STEP });
    else if (e.key === "-") updateTransform(which, { scale: t.scale - SCALE_STEP });
    else if (e.key === "[") updateTransform(which, { rotation: t.rotation - ROTATE_STEP });
    else if (e.key === "]") updateTransform(which, { rotation: t.rotation + ROTATE_STEP });
    else if (e.key === "0") setter(which);
    else return;
    e.preventDefault();
  }

  function setter(which: "main" | "compare") {
    if (which === "main") setTransform(transformFor(selected));
    else if (compareProduct) setCompareTransform(transformFor(compareProduct));
  }

  function handlePointerDown(which: "main" | "compare", e: React.PointerEvent) {
    const base = which === "main" ? transform : compareTransform;
    if (!base) return;
    dragRef.current = { startX: e.clientX, startY: e.clientY, base, which };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }

  function handlePointerMove(e: React.PointerEvent, containerEl: HTMLDivElement | null) {
    if (!dragRef.current || !containerEl) return;
    const rect = containerEl.getBoundingClientRect();
    const dx = ((e.clientX - dragRef.current.startX) / rect.width) * 100;
    const dy = ((e.clientY - dragRef.current.startY) / rect.height) * 100;
    updateTransform(dragRef.current.which, { xPercent: dragRef.current.base.xPercent + dx, yPercent: dragRef.current.base.yPercent + dy });
  }

  function handlePointerUp() {
    dragRef.current = null;
  }

  function savePreview() {
    const canvas = canvasRef.current;
    if (!canvas || !photoSrc) return;
    // El canvas ya tiene la foto capturada por la cámara; si la foto viene de
    // una subida, la volvemos a dibujar aquí antes de componer el overlay.
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      // Overlay simplificado: círculo de color representando la pieza en su
      // posición actual — una composición orientativa real, no una foto
      // realista con la joya puesta.
      const x = (transform.xPercent / 100) * canvas.width;
      const y = (transform.yPercent / 100) * canvas.height;
      const r = 30 * transform.scale;
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate((transform.rotation * Math.PI) / 180);
      ctx.fillStyle = "rgba(212,175,55,0.85)";
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      setSavedUrl(canvas.toDataURL("image/jpeg", 0.92));
    };
    img.src = photoSrc;
  }

  return (
    <div className="flex flex-col gap-8 lg:flex-row">
      <div className="flex-1">
        <p className="mb-4 rounded-xl bg-surface-2 px-4 py-3 text-xs text-ink-soft">
          Previsualización orientativa — no es una medición biométrica real. Tu imagen se procesa localmente en tu dispositivo para
          esta previsualización; no se envía a ningún servidor. Nada se guarda salvo que pulses &ldquo;Descargar
          previsualización&rdquo;.
        </p>

        {!photoSrc ? (
          <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-line p-10 text-center">
            {cameraActive ? (
              <>
                <video ref={videoRef} className="aspect-square w-full max-w-sm rounded-2xl bg-black object-cover" playsInline muted />
                <button type="button" onClick={capturePhoto} className="rounded-full bg-ink px-6 py-3 font-semibold text-ivory">
                  Hacer foto
                </button>
              </>
            ) : (
              <>
                <p className="text-sm text-ink-soft">Usa tu cámara o sube una foto para probarte una pieza.</p>
                <div className="flex flex-wrap justify-center gap-3">
                  <button type="button" onClick={startCamera} className="rounded-full bg-ink px-6 py-3 font-semibold text-ivory">
                    Usar cámara
                  </button>
                  <label className="cursor-pointer rounded-full border border-line px-6 py-3 font-semibold hover:border-ink">
                    Subir foto
                    <input type="file" accept="image/*" onChange={handleUpload} className="hidden" data-testid="tryon-upload-input" />
                  </label>
                </div>
                {cameraError && <p className="max-w-sm text-sm font-semibold text-red-600">{cameraError}</p>}
              </>
            )}
          </div>
        ) : (
          <TryOnCanvas
            photoSrc={photoSrc}
            product={selected}
            transform={transform}
            compareProduct={compareProduct}
            compareTransform={compareTransform}
            onPointerDownMain={(e) => handlePointerDown("main", e)}
            onPointerDownCompare={(e) => handlePointerDown("compare", e)}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onKeyDownMain={(e) => handleOverlayKeyDown("main", e)}
            onKeyDownCompare={(e) => handleOverlayKeyDown("compare", e)}
          />
        )}

        {photoSrc && (
          <div className="mt-4 flex flex-wrap gap-3">
            <button type="button" onClick={() => updateTransform("main", { scale: transform.scale + SCALE_STEP })} className="rounded-full border border-line px-4 py-2 text-sm font-semibold">
              Escalar +
            </button>
            <button type="button" onClick={() => updateTransform("main", { scale: transform.scale - SCALE_STEP })} className="rounded-full border border-line px-4 py-2 text-sm font-semibold">
              Escalar −
            </button>
            <button type="button" onClick={() => updateTransform("main", { rotation: transform.rotation - ROTATE_STEP })} className="rounded-full border border-line px-4 py-2 text-sm font-semibold">
              Girar ↺
            </button>
            <button type="button" onClick={() => updateTransform("main", { rotation: transform.rotation + ROTATE_STEP })} className="rounded-full border border-line px-4 py-2 text-sm font-semibold">
              Girar ↻
            </button>
            <button type="button" onClick={() => setTransform(transformFor(selected))} className="rounded-full border border-line px-4 py-2 text-sm font-semibold">
              Restablecer
            </button>
            <button type="button" onClick={clearPhoto} className="rounded-full border border-line px-4 py-2 text-sm font-semibold">
              Cambiar foto
            </button>
            <button type="button" onClick={savePreview} className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-ivory">
              Descargar previsualización
            </button>
          </div>
        )}

        {savedUrl && (
          <a href={savedUrl} download={`aldara-tryon-${selected.slug}.jpg`} className="mt-3 inline-block text-sm font-semibold text-terracotta underline">
            Descargar imagen ✓ (pulsa aquí si no se ha descargado sola)
          </a>
        )}

        <canvas ref={canvasRef} className="hidden" aria-hidden="true" />
      </div>

      <div className="w-full lg:w-80 lg:shrink-0">
        <h2 className="mb-3 font-semibold">Elige una pieza</h2>
        <div data-testid="tryon-product-grid" className="grid max-h-72 grid-cols-3 gap-2 overflow-y-auto rounded-2xl border border-line p-2 sm:grid-cols-4 lg:grid-cols-3">
          {PRODUCTS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setSelectedId(p.id)}
              aria-pressed={selectedId === p.id}
              aria-label={p.name}
              className={`flex flex-col items-center gap-1 rounded-xl border p-2 text-center ${selectedId === p.id ? "border-ink bg-surface-2" : "border-transparent"}`}
            >
              <ProductVisual product={p} size={36} />
              <span className="line-clamp-1 text-[0.65rem]">{p.name}</span>
            </button>
          ))}
        </div>

        <div className="mt-5 rounded-2xl border border-line p-4">
          <p className="text-sm font-semibold">{selected.name}</p>
          <p className="text-sm text-ink-soft">{money(selected.price)}</p>
          <p className="mt-2 text-xs text-ink-soft">{selected.description}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link href={`/producto/${selected.slug}`} className="rounded-full bg-ink px-4 py-2 text-xs font-semibold text-ivory">
              Ver producto
            </Link>
            <button
              type="button"
              onClick={() => addItem(selected.id)}
              disabled={selected.stock === 0}
              className="rounded-full border border-line px-4 py-2 text-xs font-semibold disabled:opacity-40"
            >
              Añadir al carrito
            </button>
            <button type="button" onClick={() => toggleWishlist(selected.id)} className="rounded-full border border-line px-4 py-2 text-xs font-semibold">
              {hasInWishlist(selected.id) ? "En tu wishlist ✓" : "Añadir a wishlist"}
            </button>
          </div>
        </div>

        <div className="mt-5">
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium text-ink-soft">Comparar con otra pieza (opcional)</span>
            <select
              value={compareId ?? ""}
              onChange={(e) => setCompareId(e.target.value || null)}
              className="rounded-lg border border-line bg-surface px-3 py-2 text-sm"
            >
              <option value="">Sin comparar</option>
              {PRODUCTS.filter((p) => p.id !== selectedId).map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="mt-6 rounded-2xl bg-surface-2 p-4 text-xs text-ink-soft">
          <p className="mb-1 font-semibold text-ink">¿Prefieres no usar cámara/foto?</p>
          <p>
            Puedes elegir la pieza, leer su descripción, compararla con otra y pasar directamente a{" "}
            <Link href={`/producto/${selected.slug}`} className="underline">
              su ficha de producto
            </Link>{" "}
            sin usar la parte visual de esta página.
          </p>
        </div>
      </div>
    </div>
  );
}

function TryOnCanvas({
  photoSrc,
  product,
  transform,
  compareProduct,
  compareTransform,
  onPointerDownMain,
  onPointerDownCompare,
  onPointerMove,
  onPointerUp,
  onKeyDownMain,
  onKeyDownCompare,
}: {
  photoSrc: string;
  product: Product;
  transform: OverlayTransform;
  compareProduct: Product | null | undefined;
  compareTransform: OverlayTransform | null;
  onPointerDownMain: (e: React.PointerEvent) => void;
  onPointerDownCompare: (e: React.PointerEvent) => void;
  onPointerMove: (e: React.PointerEvent, containerEl: HTMLDivElement | null) => void;
  onPointerUp: () => void;
  onKeyDownMain: (e: React.KeyboardEvent) => void;
  onKeyDownCompare: (e: React.KeyboardEvent) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  return (
    <div
      ref={containerRef}
      className="relative aspect-square w-full max-w-lg overflow-hidden rounded-2xl bg-black"
      onPointerMove={(e) => onPointerMove(e, containerRef.current)}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={photoSrc} alt="Tu foto para la previsualización" className="h-full w-full object-cover" />
      <button
        type="button"
        onPointerDown={onPointerDownMain}
        onKeyDown={onKeyDownMain}
        aria-label={`Mover, escalar o girar la previsualización de ${product.name} (flechas para mover, +/- para escalar, [ ] para girar, 0 para restablecer)`}
        className="absolute flex items-center justify-center rounded-full border-2 border-white/70 bg-white/20 text-white outline-none backdrop-blur-sm focus-visible:ring-2 focus-visible:ring-white"
        style={{
          left: `${transform.xPercent}%`,
          top: `${transform.yPercent}%`,
          width: `${64 * transform.scale}px`,
          height: `${64 * transform.scale}px`,
          transform: `translate(-50%, -50%) rotate(${transform.rotation}deg)`,
          cursor: "grab",
          touchAction: "none",
        }}
      >
        <ProductVisual product={product} size={40 * transform.scale} />
      </button>

      {compareProduct && compareTransform && (
        <button
          type="button"
          onPointerDown={onPointerDownCompare}
          onKeyDown={onKeyDownCompare}
          aria-label={`Mover, escalar o girar la previsualización de comparación (${compareProduct.name})`}
          className="absolute flex items-center justify-center rounded-full border-2 border-dashed border-terracotta bg-terracotta/20 text-white outline-none backdrop-blur-sm focus-visible:ring-2 focus-visible:ring-terracotta"
          style={{
            left: `${compareTransform.xPercent}%`,
            top: `${compareTransform.yPercent}%`,
            width: `${64 * compareTransform.scale}px`,
            height: `${64 * compareTransform.scale}px`,
            transform: `translate(-50%, -50%) rotate(${compareTransform.rotation}deg)`,
            cursor: "grab",
            touchAction: "none",
          }}
        >
          <ProductVisual product={compareProduct} size={40 * compareTransform.scale} />
        </button>
      )}
    </div>
  );
}
