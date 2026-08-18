import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { cookies } from "next/headers";
import { readSessionCookieValue, SESSION_COOKIE_NAME } from "@/lib/auth";
import { readJson, writeJson } from "@/lib/localDb";
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

  const addresses = await readJson<StoredAddress[]>(FILE, []);
  const entry: StoredAddress = { id: randomUUID(), email: user.email, ...body };
  addresses.push(entry);
  await writeJson(FILE, addresses);
  return NextResponse.json({ ok: true, address: entry });
}

export async function DELETE(request: Request) {
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: "Inicia sesión." }, { status: 401 });

  const id = new URL(request.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Falta el id." }, { status: 400 });

  const addresses = await readJson<StoredAddress[]>(FILE, []);
  const filtered = addresses.filter((a) => !(a.id === id && a.email.toLowerCase() === user.email.toLowerCase()));
  await writeJson(FILE, filtered);
  return NextResponse.json({ ok: true });
}
