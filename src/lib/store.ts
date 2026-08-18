import { safeStorage } from "./storage";

type Listener = () => void;

/**
 * Store mínimo sincronizado con localStorage, pensado para usarse con
 * React 19's useSyncExternalStore. Evita el antipatrón "cargar en un
 * useEffect y hacer setState" (regla react-hooks/set-state-in-effect):
 * en vez de eso, el propio store es la fuente de verdad y React se
 * limita a suscribirse. Esto también elimina de raíz la condición de
 * carrera que existía si el usuario interactuaba antes de que el
 * efecto de carga inicial terminase.
 */
export function createLocalStorageStore<T>(key: string, parse: (raw: string | null) => T, defaultValue: T) {
  let value: T = defaultValue;
  let initialized = false;
  const listeners = new Set<Listener>();

  function ensureInit() {
    if (initialized || typeof window === "undefined") return;
    value = parse(safeStorage.get(key));
    initialized = true;
  }

  function getSnapshot(): T {
    ensureInit();
    return value;
  }

  function getServerSnapshot(): T {
    return defaultValue;
  }

  function subscribe(listener: Listener): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
  }

  function setValue(next: T | ((prev: T) => T)): void {
    ensureInit();
    value = typeof next === "function" ? (next as (prev: T) => T)(value) : next;
    safeStorage.set(key, JSON.stringify(value));
    listeners.forEach((listener) => listener());
  }

  return { getSnapshot, getServerSnapshot, subscribe, setValue };
}
