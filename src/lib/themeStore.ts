import { createLocalStorageStore } from "./store";

export type Theme = "light" | "dark";
const THEME_KEY = "aldara_theme";

function parseTheme(raw: string | null): Theme {
  if (raw === "dark" || raw === "light") return raw;
  // Sin preferencia guardada: respeta lo que ya aplicó el script
  // inline de layout.tsx (evita el parpadeo antes de hidratar).
  if (typeof document !== "undefined") {
    return document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
  }
  return "light";
}

export const themeStore = createLocalStorageStore<Theme>(THEME_KEY, parseTheme, "light");

export function setTheme(next: Theme): void {
  document.documentElement.setAttribute("data-theme", next);
  themeStore.setValue(next);
}
