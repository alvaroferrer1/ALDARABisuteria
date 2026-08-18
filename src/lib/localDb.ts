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
