"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * Factoría genérica para listas persistidas en localStorage (recently
 * viewed, comparador...) — mismo patrón ya probado en `savedLooks.ts`
 * (useSyncExternalStore, sin setState-en-efecto, sin desajuste de
 * hidratación). Cada store tiene su propia clave y límite de tamaño.
 */
export function createPersistedListStore(storageKey: string, maxItems = 20) {
  const listeners = new Set<() => void>();
  let cache: string[] = [];
  let cacheRaw = "";

  function readStored(): string[] {
    if (typeof window === "undefined") return [];
    try {
      const raw = window.localStorage.getItem(storageKey) ?? "[]";
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
    window.localStorage.setItem(storageKey, cacheRaw);
    listeners.forEach((l) => l());
  }

  function subscribe(onStoreChange: () => void) {
    listeners.add(onStoreChange);
    return () => listeners.delete(onStoreChange);
  }

  function add(id: string) {
    const current = readStored().filter((x) => x !== id);
    writeStored([id, ...current].slice(0, maxItems));
  }

  function remove(id: string) {
    writeStored(readStored().filter((x) => x !== id));
  }

  function clear() {
    writeStored([]);
  }

  function useList() {
    const items = useSyncExternalStore(subscribe, readStored, () => []);
    const addItem = useCallback((id: string) => add(id), []);
    const removeItem = useCallback((id: string) => remove(id), []);
    const clearAll = useCallback(() => clear(), []);
    const has = useCallback((id: string) => items.includes(id), [items]);
    return { items, addItem, removeItem, clearAll, has };
  }

  return { useList, add, remove, clear };
}
