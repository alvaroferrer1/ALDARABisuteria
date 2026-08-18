import type { Product } from "@/lib/types";

const ICON_PATHS: Record<Product["icon"], string> = {
  earring:
    '<circle cx="24" cy="14" r="7" fill="none" stroke="currentColor" stroke-width="2"/><path d="M24 21v18" stroke="currentColor" stroke-width="2"/><circle cx="24" cy="41" r="4" fill="currentColor"/>',
  bracelet:
    '<ellipse cx="24" cy="24" rx="17" ry="10" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="7" cy="24" r="2.6" fill="currentColor"/><circle cx="41" cy="24" r="2.6" fill="currentColor"/>',
  pendant:
    '<path d="M15 9c0 9 18 9 18 0" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="24" cy="30" r="9" fill="none" stroke="currentColor" stroke-width="2"/>',
  charm:
    '<circle cx="17" cy="24" r="8" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="33" cy="24" r="8" fill="none" stroke="currentColor" stroke-width="2"/>',
};

const TINT_CLASS = ["text-gold", "text-terracotta", "text-blue"] as const;

/**
 * Ilustración vectorial provisional del producto. Sustituir por
 * fotografía real cuando exista (ver README, sección "Imágenes").
 */
export function ProductVisual({ product, size = 56 }: { product: Product; size?: number }) {
  return (
    <svg
      viewBox="0 0 48 48"
      width={size}
      height={size}
      aria-hidden="true"
      className={TINT_CLASS[product.tint]}
      dangerouslySetInnerHTML={{ __html: ICON_PATHS[product.icon] }}
    />
  );
}
