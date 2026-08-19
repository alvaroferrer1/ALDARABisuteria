import { randomUUID } from "node:crypto";
import { readJson, writeJson, withFileLock } from "./localDb";

const FILE = "club-ledger.json";

export type ClubMovementType = "earn" | "redeem" | "adjustment";

export interface ClubMovement {
  id: string;
  user: string; // email, siempre en minúsculas
  type: ClubMovementType;
  /** Con signo: earn/adjustment positivo, redeem negativo. El saldo es la suma. */
  points: number;
  reason: string;
  orderId?: string;
  timestamp: string;
}

/**
 * Ledger de puntos del Club — reemplaza el cálculo frágil anterior (restar
 * directamente sobre `orders.json` en cada render). Cada movimiento real
 * queda registrado con motivo y trazabilidad (pedido asociado si aplica);
 * el saldo siempre es la suma de movimientos, nunca un número que se
 * sobrescribe. Un backend de fidelización real podría sustituir este
 * fichero por una tabla, sin cambiar la interfaz (`getBalance`/`appendMovement`).
 */
export async function getLedger(): Promise<ClubMovement[]> {
  return readJson<ClubMovement[]>(FILE, []);
}

export async function getUserMovements(user: string): Promise<ClubMovement[]> {
  const ledger = await getLedger();
  return ledger.filter((m) => m.user === user.toLowerCase());
}

export async function getBalance(user: string): Promise<number> {
  const movements = await getUserMovements(user);
  return movements.reduce((sum, m) => sum + m.points, 0);
}

// withFileLock: dos pedidos ganando/canjeando puntos a la vez podían leer el
// mismo ledger de partida y la segunda escritura borraba el movimiento de la
// primera — mismo bug de concurrencia real que en pedidos/tarjetas regalo.
export async function appendMovement(input: {
  user: string;
  type: ClubMovementType;
  points: number;
  reason: string;
  orderId?: string;
}): Promise<ClubMovement> {
  const movement: ClubMovement = {
    id: randomUUID(),
    user: input.user.toLowerCase(),
    type: input.type,
    points: input.points,
    reason: input.reason,
    orderId: input.orderId,
    timestamp: new Date().toISOString(),
  };
  await withFileLock(FILE, async () => {
    const ledger = await getLedger();
    ledger.push(movement);
    await writeJson(FILE, ledger);
  });
  return movement;
}
