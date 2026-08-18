"use client";

import { useCallback, useSyncExternalStore } from "react";

const STORAGE_KEY = "aldara_saved_looks";
const listeners = new Set<() => void>();
let cache: string[] = [];
let cacheRaw = "";

function readStored(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY) ?? "[]";
    if (raw !== cacheRaw) {
      cacheRaw = raw;
      cache = JSON.parse(raw) as string[];
    }
    return cache;
  } catch {
    return [];
  }
}

function writeStored(next: string[]) {
  cacheRaw = JSON.stringify(next);
  cache = next;
  window.localStorage.setItem(STORAGE_KEY, cacheRaw);
  listeners.forEach((l) => l());
}

function subscribe(onStoreChange: () => void) {
  listeners.add(onStoreChange);
  return () => listeners.delete(onStoreChange);
}

/**
 * Guardar look — persistencia real en localStorage (no hay cuenta de
 * servidor para esto todavía, documentado como tal). `useSyncExternalStore`
 * evita el patrón "setState dentro de un efecto" y el desajuste de
 * hidratación server/cliente: en servidor siempre es `[]`, en cliente lee
 * el valor real una vez montado, sin renders en cascada.
 */
export function useSavedLooks() {
  const saved = useSyncExternalStore(subscribe, readStored, () => []);

  const toggle = useCallback((slug: string) => {
    const current = readStored();
    const next = current.includes(slug) ? current.filter((s) => s !== slug) : [...current, slug];
    writeStored(next);
  }, []);

  const isSaved = useCallback((slug: string) => saved.includes(slug), [saved]);

  return { saved, toggle, isSaved };
}
