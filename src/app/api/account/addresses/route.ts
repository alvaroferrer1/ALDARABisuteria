import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { cookies } from "next/headers";
import { readSessionCookieValue, SESSION_COOKIE_NAME } from "@/lib/auth";
import { readJson, writeJson, withFileLock } from "@/lib/localDb";
import type { Address } from "@/lib/types";

const FILE = "addresses.json";
interface StoredAddress extends Address {
  id: string;
  email: string;
}

async function requireUser() {
  const cookieStore = await cookies();
  return readSessionCookieValue(cookieStore.get(SESSION_COOKIE_NAME)?.value);
}

function isAddress(value: unknown): value is Address {
  if (typeof value !== "object" || value === null) return false;
  const a = value as Record<string, unknown>;
  return ["fullName", "street", "city", "postalCode", "province", "country", "phone"].every(
    (k) => typeof a[k] === "string" && (a[k] as string).trim().length > 0
  );
}

export async function POST(request: Request) {
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: "Inicia sesión." }, { status: 401 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Cuerpo inválido." }, { status: 400 });
  }
  if (!isAddress(body)) return NextResponse.json({ error: "Dirección incompleta." }, { status: 400 });

  const entry = await withFileLock(FILE, async () => {
    const addresses = await readJson<StoredAddress[]>(FILE, []);
    // Primera dirección del usuario → predeterminada automáticamente, para
    // que siempre haya una marcada sin pedirle un paso extra.
    const hasDefault = addresses.some((a) => a.email.toLowerCase() === user.email.toLowerCase() && a.isDefault);
    const newEntry: StoredAddress = { id: randomUUID(), email: user.email, ...(body as Address), isDefault: !hasDefault };
    addresses.push(newEntry);
    await writeJson(FILE, addresses);
    return newEntry;
  });
  return NextResponse.json({ ok: true, address: entry });
}

export async function PATCH(request: Request) {
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: "Inicia sesión." }, { status: 401 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Cuerpo inválido." }, { status: 400 });
  }
  const id = typeof body === "object" && body !== null ? (body as Record<string, unknown>).id : undefined;
  if (typeof id !== "string") return NextResponse.json({ error: "Falta el id." }, { status: 400 });

  const found = await withFileLock(FILE, async () => {
    const addresses = await readJson<StoredAddress[]>(FILE, []);
    let matched = false;
    const updated = addresses.map((a) => {
      if (a.email.toLowerCase() !== user.email.toLowerCase()) return a;
      if (a.id === id) matched = true;
      return { ...a, isDefault: a.id === id };
    });
    if (matched) await writeJson(FILE, updated);
    return matched;
  });
  if (!found) return NextResponse.json({ error: "Dirección no encontrada." }, { status: 404 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request) {
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: "Inicia sesión." }, { status: 401 });

  const id = new URL(request.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Falta el id." }, { status: 400 });

  await withFileLock(FILE, async () => {
    const addresses = await readJson<StoredAddress[]>(FILE, []);
    const deletingDefault = addresses.some((a) => a.id === id && a.email.toLowerCase() === user.email.toLowerCase() && a.isDefault);
    let filtered = addresses.filter((a) => !(a.id === id && a.email.toLowerCase() === user.email.toLowerCase()));
    // Si se borra la predeterminada y quedan otras, la siguiente pasa a serlo — nunca se queda el usuario sin ninguna marcada habiendo direcciones.
    if (deletingDefault) {
      const nextIndex = filtered.findIndex((a) => a.email.toLowerCase() === user.email.toLowerCase());
      if (nextIndex !== -1) filtered = filtered.map((a, i) => (i === nextIndex ? { ...a, isDefault: true } : a));
    }
    await writeJson(FILE, filtered);
  });
  return NextResponse.json({ ok: true });
}
