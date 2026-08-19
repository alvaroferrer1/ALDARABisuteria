import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { readJson, writeJson } from "@/lib/localDb";
import { getProductById } from "@/lib/products";
import { checkRateLimit, ipKeyFrom, rateLimitedResponse } from "@/lib/rateLimit";

const FILE = "back-in-stock-requests.json";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const LIMIT = 15;
const WINDOW_MS = 10 * 60 * 1000;

export interface BackInStockRequest {
  id: string;
  productId: string;
  email: string;
  createdAt: string;
  /** Se rellena cuando el mecanismo de restock ya envió el aviso real — ver /api/admin/restock. */
  notifiedAt?: string;
}

export async function POST(request: Request) {
  const { allowed, retryAfterMs } = checkRateLimit(`back-in-stock:${ipKeyFrom(request)}`, LIMIT, WINDOW_MS);
  if (!allowed) return rateLimitedResponse(retryAfterMs);

  let body: { productId?: string; email?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Cuerpo inválido." }, { status: 400 });
  }
  const productId = (body.productId || "").trim();
  const email = (body.email || "").trim();

  const product = getProductById(productId);
  if (!product) return NextResponse.json({ error: "Producto no encontrado." }, { status: 404 });
  if (!EMAIL_RE.test(email)) return NextResponse.json({ error: "Escribe un email válido." }, { status: 400 });

  const requests = await readJson<BackInStockRequest[]>(FILE, []);
  const already = requests.some((r) => r.productId === productId && r.email.toLowerCase() === email.toLowerCase());
  if (!already) {
    requests.push({ id: randomUUID(), productId, email, createdAt: new Date().toISOString() });
    await writeJson(FILE, requests);
  }
  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request) {
  const url = new URL(request.url);
  const id = url.searchParams.get("id");
  const email = url.searchParams.get("email");
  if (!id || !email) return NextResponse.json({ error: "Faltan datos." }, { status: 400 });

  const requests = await readJson<BackInStockRequest[]>(FILE, []);
  const filtered = requests.filter((r) => !(r.id === id && r.email.toLowerCase() === email.toLowerCase()));
  await writeJson(FILE, filtered);
  return NextResponse.json({ ok: true });
}
