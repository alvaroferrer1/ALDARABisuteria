"use client";

import { createContext, useContext, useMemo } from "react";

const PhotoManifestContext = createContext<Set<string>>(new Set());

/** Envuelve el árbol con la lista de fotos finales ya disponibles (calculada en el servidor, ver `lib/photoManifest.ts`). */
export function PhotoManifestProvider({ available, children }: { available: string[]; children: React.ReactNode }) {
  const set = useMemo(() => new Set(available), [available]);
  return <PhotoManifestContext.Provider value={set}>{children}</PhotoManifestContext.Provider>;
}

/** ¿Existe ya `public/photos/<name>.webp`? Sin red, sin estado async, sin ruido de consola — solo lectura de un Set ya calculado en el servidor. */
export function usePhotoAvailable(name: string): boolean {
  const available = useContext(PhotoManifestContext);
  return available.has(name);
}
