"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/**
 * Transición de página estable (Bloque 9, ref. 9.6 "Page Transitions").
 * El mockup pide un fundido/deslizamiento entre páginas del estilo de
 * React's View Transitions API — pero React 19.2.8 (versión realmente
 * instalada en este proyecto) no la exporta bajo ningún nombre; se
 * confirmó con una build fallida (`import { unstable_ViewTransition }`)
 * antes de esta decisión. Instrucción explícita: no actualizar a una
 * versión inestable de React solo por esta función, usar una alternativa
 * ESTABLE. Esta es esa alternativa: `key={pathname}` remonta el árbol en
 * cada navegación, disparando la animación CSS `.page-transition`
 * (ver globals.css) sin ninguna API experimental.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return (
    <div key={pathname} className="page-transition">
      {children}
    </div>
  );
}
