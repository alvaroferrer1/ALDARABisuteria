"use client";

import { useSyncExternalStore } from "react";

// Estado en memoria (no localStorage) para abrir/cerrar el buscador global
// desde cualquier sitio (icono del header, atajo de teclado) sin prop drilling.
let isOpen = false;
const listeners = new Set<() => void>();

function subscribe(onStoreChange: () => void) {
  listeners.add(onStoreChange);
  return () => listeners.delete(onStoreChange);
}

function getSnapshot() {
  return isOpen;
}

function getServerSnapshot() {
  return false;
}

export function openSearch() {
  isOpen = true;
  listeners.forEach((l) => l());
}

export function closeSearch() {
  isOpen = false;
  listeners.forEach((l) => l());
}

export function useSearchOverlayOpen() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
