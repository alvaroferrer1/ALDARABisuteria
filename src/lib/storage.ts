/**
 * Envoltorio seguro de localStorage. La versión estática de este
 * proyecto (aldara-web) tuvo un bug real: una llamada a
 * localStorage sin try/catch podía tirar todo el script si el
 * navegador lo bloqueaba (modo privado, política de cookies, etc.).
 * Aquí se evita desde el principio.
 */
export const safeStorage = {
  get(key: string): string | null {
    if (typeof window === "undefined") return null;
    try {
      return window.localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  set(key: string, value: string): void {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(key, value);
    } catch {
      /* almacenamiento no disponible: seguimos solo en memoria */
    }
  },
};

export function money(n: number): string {
  return n.toLocaleString("es-ES", { style: "currency", currency: "EUR" });
}
