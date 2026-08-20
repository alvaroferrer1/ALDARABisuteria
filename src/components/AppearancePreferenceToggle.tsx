"use client";

import { useSyncExternalStore } from "react";
import { themeStore, setTheme } from "@/lib/themeStore";

/**
 * Bug real corregido: la fila "Apariencia" de Preferencias mostraba el
 * título y la descripción pero no tenía ningún control — prometía un
 * ajuste que no se podía cambiar desde ahí (solo existía el icono suelto
 * del header, sin relación visible con esta página). Mismo interruptor
 * visual que el resto de ajustes (newsletter), ahora con estado y etiqueta
 * reales.
 */
export function AppearancePreferenceToggle() {
  const theme = useSyncExternalStore(themeStore.subscribe, themeStore.getSnapshot, themeStore.getServerSnapshot);
  const isDark = theme === "dark";

  return (
    <div className="flex shrink-0 items-center gap-3">
      <span className="text-sm font-medium text-ink-soft">{isDark ? "Oscuro" : "Claro"}</span>
      <button
        type="button"
        onClick={() => setTheme(isDark ? "light" : "dark")}
        aria-pressed={isDark}
        aria-label="Cambiar modo claro/oscuro"
        className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${isDark ? "bg-terracotta" : "bg-line"}`}
      >
        <span className={`absolute top-1 h-5 w-5 rounded-full bg-white transition-transform ${isDark ? "translate-x-6" : "translate-x-1"}`} />
      </button>
    </div>
  );
}
