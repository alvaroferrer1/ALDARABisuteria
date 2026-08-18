"use client";

import type { Product } from "@/lib/types";
import { ProductLightField, useProductPhotoAvailable } from "./ProductPlate";
import { ProductVisual } from "./ProductVisual";

/**
 * Portada de una entrega de The Edit — tratamiento tipo "cover de revista",
 * no un ProductPlate genérico: número de entrega tipográfico gigante de
 * fondo + icono de producto a mayor escala que en las fichas normales de
 * catálogo. Detalle memorable propio de esta familia (Gate B).
 */
export function EditCover({ product, issue, className = "aspect-4/5 rounded-2xl" }: { product: Product; issue: string; className?: string }) {
  const issueNumber = issue.replace(/\D/g, "");
  const photoAvailable = useProductPhotoAvailable(product);
  return (
    <div className={`relative flex items-center justify-center overflow-hidden bg-surface-2 ${className}`}>
      <ProductLightField product={product} />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-6 -right-4 select-none font-display text-[9rem] font-semibold leading-none text-ink/[0.06]"
      >
        {issueNumber}
      </span>
      <span className="absolute left-5 top-5 text-xs font-bold uppercase tracking-widest text-terracotta">The Edit · {issue}</span>
      {!photoAvailable && (
        <div className="relative drop-shadow-[0_10px_24px_rgba(0,0,0,0.15)]">
          <ProductVisual product={product} size={160} />
        </div>
      )}
    </div>
  );
}
