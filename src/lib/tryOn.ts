import type { Product } from "./types";

export interface TryOnOverlay {
  productId: string;
  /** Tipo de pieza, determina la zona por defecto sobre la foto. */
  type: Product["icon"];
  /** Posición inicial del ancla, en % del lienzo (0-100). */
  anchor: { xPercent: number; yPercent: number };
  defaultScale: number;
}

export interface TryOnProvider {
  id: string;
  label: string;
  isAvailable(): boolean;
  getOverlayForProduct(product: Product): TryOnOverlay;
}

// Ancla por defecto según el tipo de pieza — punto de partida razonable
// sobre una foto de medio cuerpo/retrato genérica. El usuario siempre puede
// mover/escalar/rotar desde ahí: no se afirma precisión biométrica, es una
// PREVISUALIZACIÓN ORIENTATIVA, nunca un ajuste automático "detectado".
const ANCHOR_BY_TYPE: Record<Product["icon"], { xPercent: number; yPercent: number; scale: number }> = {
  earring: { xPercent: 62, yPercent: 38, scale: 0.5 },
  pendant: { xPercent: 50, yPercent: 52, scale: 0.7 },
  bracelet: { xPercent: 30, yPercent: 78, scale: 0.9 },
  charm: { xPercent: 30, yPercent: 78, scale: 0.6 },
};

/**
 * Try-On progresivo (Master #28) — arquitectura con adapter para poder
 * sustituir la implementación sin tocar la UI. `Demo2DTryOnProvider` es la
 * única implementación real hoy: overlay 2D posicionable a mano sobre una
 * foto (cámara o subida), sin AR/WebXR/detección facial. Preparado para que
 * un futuro `WebARProvider`/`WebXRProvider`/`ThirdPartyARProvider` implemente
 * la misma interfaz sin romper nada — pero el cierre de esta experiencia NO
 * depende de que esa integración exista.
 */
export const demo2DTryOnProvider: TryOnProvider = {
  id: "demo-2d",
  label: "Previsualización 2D (demo)",
  isAvailable() {
    return true; // No requiere hardware: funciona con cámara O con foto subida O sin foto (modo accesible).
  },
  getOverlayForProduct(product) {
    const base = ANCHOR_BY_TYPE[product.icon];
    return {
      productId: product.id,
      type: product.icon,
      anchor: { xPercent: base.xPercent, yPercent: base.yPercent },
      defaultScale: base.scale,
    };
  },
};

export function cameraApiAvailable(): boolean {
  return typeof navigator !== "undefined" && !!navigator.mediaDevices && typeof navigator.mediaDevices.getUserMedia === "function";
}
