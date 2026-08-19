import { promises as fs } from "node:fs";
import path from "node:path";

/**
 * Persistencia local en JSON, solo para desarrollo/demo.
 * No es una base de datos real: sirve para que newsletter, contacto,
 * pedidos y cuentas de usuario funcionen de verdad en local sin
 * necesitar credenciales externas. Ver README para migrar a una
 * base de datos real (Postgres, etc.) antes de producción.
 */
const DATA_DIR = path.join(process.cwd(), "data");

// Memoizado: sin esto, cada lectura/escritura (potencialmente varias por
// request) repetía la llamada a fs.mkdir de forma innecesaria. Solo hace
// falta crear el directorio una vez por arranque del proceso.
let dataDirReady: Promise<void> | null = null;
function ensureDataDir(): Promise<void> {
  if (!dataDirReady) {
    dataDirReady = fs.mkdir(DATA_DIR, { recursive: true }).then(() => undefined);
  }
  return dataDirReady;
}

export async function readJson<T>(file: string, fallback: T): Promise<T> {
  await ensureDataDir();
  try {
    const raw = await fs.readFile(path.join(DATA_DIR, file), "utf-8");
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export async function writeJson<T>(file: string, data: T): Promise<void> {
  await ensureDataDir();
  await fs.writeFile(path.join(DATA_DIR, file), JSON.stringify(data, null, 2), "utf-8");
}

// Bug real de concurrencia corregido: cada endpoint hacía readJson → modificar
// en memoria → writeJson, sin ningún bloqueo entre medias. Con dos peticiones
// a la vez sobre el mismo archivo (dos pedidos, dos registros, dos canjes de
// tarjeta regalo...) la segunda escritura podía pisar por completo a la
// primera — se perdía un pedido entero en silencio. Confirmado de verdad con
// una prueba de carga: 4 peticiones simultáneas a /api/contact → solo 1
// mensaje sobrevivía en el JSON.
//
// withFileLock encola las operaciones sobre el MISMO archivo (nunca bloquea
// entre archivos distintos) para que el ciclo lectura-modificación-escritura
// de cada petición se complete entero antes de que empiece el siguiente.
// Suficiente para un solo proceso de Node como este; en un despliegue con
// varias instancias haría falta un lock compartido (Redis, etc.) o, mejor,
// una base de datos real — ver nota de arriba.
const fileQueues = new Map<string, Promise<unknown>>();

export function withFileLock<T>(file: string, fn: () => Promise<T>): Promise<T> {
  const prior = fileQueues.get(file) ?? Promise.resolve();
  const run = prior.then(fn, fn);
  // La cola nunca debe quedar "envenenada" por un fallo de una petición
  // anterior — si fn() rechaza, la siguiente petición debe poder ejecutarse
  // igualmente, solo que después de que la anterior haya terminado.
  fileQueues.set(
    file,
    run.catch(() => undefined)
  );
  return run;
}
