"use client";

import { JOURNAL_CATEGORY_COLORS } from "@/lib/journal";
import { PhotoSlot } from "./PhotoSlot";

const CATEGORY_ICON: Record<string, string> = {
  Styling: 'M24 8v10m0 0-7 6m7-6 7 6M14 40h20', // percha estilizada
  Historias: "M12 10h24v28l-12-7-12 7Z", // libro/marcador
  Regalos: "M8 20h32v20H8ZM8 20 24 8l16 12M24 8v32", // caja de regalo con lazo
  Materiales: "M24 6c6 10 10 16 10 22a10 10 0 1 1-20 0c0-6 4-12 10-22Z", // gota de material
};

/**
 * Plate editorial por sección de Journal — reemplaza el ProductPlate
 * genérico (pensado para producto, no para artículo). Fondo tintado por
 * categoría + icono lineal propio de cada sección, para que Journal se
 * sienta como una revista con secciones reconocibles, no un blog plano.
 *
 * Sustitución preparada: si se pasa `slug`, en cuanto exista
 * `public/photos/journal-<slug>.webp` se muestra automáticamente en vez de
 * la composición generativa (ver PHOTO_ASSET_MANIFEST.md).
 */
export function JournalPlate({ category, slug, className = "aspect-4/3 rounded-2xl" }: { category: string; slug?: string; className?: string }) {
  const color = JOURNAL_CATEGORY_COLORS[category] ?? "var(--terracotta)";
  const icon = CATEGORY_ICON[category] ?? CATEGORY_ICON.Historias;
  const gradId = `journal-plate-${category.replace(/\s+/g, "-")}`;

  const generative = (
    <>
      <svg viewBox="0 0 200 150" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice">
        <defs>
          <radialGradient id={gradId} cx="30%" cy="25%" r="85%">
            <stop offset="0%" stopColor={color} stopOpacity="0.28" />
            <stop offset="55%" stopColor={color} stopOpacity="0.1" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="200" height="150" fill={`url(#${gradId})`} />
      </svg>
      <svg viewBox="0 0 48 48" width={56} height={56} className="relative" style={{ color }} aria-hidden="true">
        <path d={icon} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </>
  );

  return (
    <div className={`relative flex items-center justify-center overflow-hidden bg-surface-2 ${className}`} aria-hidden="true">
      {slug ? <PhotoSlot name={`journal-${slug}`} alt="" fallback={generative} /> : generative}
    </div>
  );
}
