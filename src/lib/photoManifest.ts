import fs from "node:fs";
import path from "node:path";

/**
 * Lee `public/photos/` en el servidor (una vez por request, coste mínimo:
 * un `readdirSync` sobre una carpeta pequeña) y devuelve los nombres de
 * fotografía final YA disponibles (sin extensión). Server-only — usa `fs`,
 * por eso solo se llama desde `layout.tsx` (Server Component) y se reparte
 * al resto del árbol vía `PhotoManifestProvider`/`usePhotoAvailable`.
 *
 * Enfoque elegido en vez de comprobar cada `<img>`/`fetch` en el cliente:
 * cualquier petición de red que devuelva 404 (aunque esté controlada con
 * onError) Chrome la registra igualmente como "Failed to load resource" en
 * la consola — ensuciaría la consola de TODA la web mientras no exista
 * fotografía real. Leyendo el directorio en el servidor no hay ninguna
 * petición de red de más: cero ruido, cero coste en el cliente.
 */
export function getAvailablePhotos(): string[] {
  try {
    const dir = path.join(process.cwd(), "public", "photos");
    const files = fs.readdirSync(dir);
    return files.filter((f) => f.toLowerCase().endsWith(".webp")).map((f) => f.slice(0, -".webp".length));
  } catch {
    // La carpeta `public/photos/` todavía no existe (caso de hoy) — sin fotos disponibles, no es un error.
    return [];
  }
}
