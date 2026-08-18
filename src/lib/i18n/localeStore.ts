"use client";

import { useSyncExternalStore } from "react";
import { createLocalStorageStore } from "@/lib/store";
import { dictionaries } from "./dictionaries";
import { DEFAULT_LOCALE, LOCALES, type Locale } from "./locales";

const LOCALE_KEY = "aldara_locale";

function parseLocale(raw: string | null): Locale {
  try {
    const parsed = raw ? (JSON.parse(raw) as string) : null;
    return (LOCALES as readonly string[]).includes(parsed ?? "") ? (parsed as Locale) : DEFAULT_LOCALE;
  } catch {
    return DEFAULT_LOCALE;
  }
}

export const localeStore = createLocalStorageStore<Locale>(LOCALE_KEY, parseLocale, DEFAULT_LOCALE);

export function setLocale(next: Locale): void {
  localeStore.setValue(next);
}

/**
 * Cambio de idioma real en cliente (sin rutas /en /fr separadas — ver
 * DECISIONS.md para la justificación: reestructurar las 47+ rutas
 * existentes bajo `[locale]` en una sola sesión era un riesgo de regresión
 * demasiado alto; este patrón consigue el mismo resultado para el usuario
 * — recorrer todo el sitio en ES/EN/FR — sin ese riesgo estructural).
 * Mismo patrón ya probado que `themeStore.ts` (useSyncExternalStore,
 * localStorage, sin setState-en-efecto).
 */
export function useLocale(): Locale {
  return useSyncExternalStore(localeStore.subscribe, localeStore.getSnapshot, localeStore.getServerSnapshot);
}

export function useTranslations() {
  const locale = useLocale();
  return { locale, t: dictionaries[locale] };
}
