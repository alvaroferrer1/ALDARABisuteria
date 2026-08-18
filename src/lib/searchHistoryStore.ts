import { createLocalStorageStore } from "./store";

const MAX_ENTRIES = 8;

function parse(raw: string | null): string[] {
  if (!raw) return [];
  try {
    const value = JSON.parse(raw);
    return Array.isArray(value) ? value.filter((v): v is string => typeof v === "string") : [];
  } catch {
    return [];
  }
}

/**
 * Historial de búsqueda (Master #89) — antes SearchOverlay no guardaba
 * nada: cada apertura partía de cero (verificado por grep: sin match de
 * "recent|history"). Guardado local, sin enviar queries a ningún backend.
 */
export const searchHistoryStore = createLocalStorageStore<string[]>("aldara_search_history", parse, []);

export function recordSearch(query: string) {
  const trimmed = query.trim();
  if (trimmed.length < 2) return;
  searchHistoryStore.setValue((prev) => {
    const deduped = [trimmed, ...prev.filter((q) => q.toLowerCase() !== trimmed.toLowerCase())];
    return deduped.slice(0, MAX_ENTRIES);
  });
}

export function clearSearchHistory() {
  searchHistoryStore.setValue([]);
}
