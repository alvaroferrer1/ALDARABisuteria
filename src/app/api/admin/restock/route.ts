import { NextResponse } from "next/server";
import { readJson, writeJson } from "@/lib/localDb";
import { getProductById } from "@/lib/products";
import { setStockOverride } from "@/lib/stock";
import { sendEmails } from "@/lib/email";
import type { BackInStockRequest } from "@/app/api/back-in-stock/route";

const RESTOCK_SECRET = process.env.RESTOCK_ADMIN_SECRET || "aldara-demo-restock";

/**
 * Mecanismo local de restock — NO es un panel de administración: es un
 * endpoint protegido por cabecera compartida (`X-Restock-Secret`, configurable
 * por env var, con un valor demo por defecto) que simula 0 → >0 y dispara el
 * pipeline real completo: guarda el nuevo stock (`lib/stock.ts`), detecta las
 * solicitudes de "avísame" pendientes de ese producto, envía el aviso real
 * por el mismo DemoEmailProvider ya usado en recuperación de contraseña y
 * tarjetas regalo, y marca cada solicitud como notificada para no reenviar
 * dos veces. Sustituible por un backend/admin real después sin cambiar la
 * forma de las funciones que llama (`getEffectiveStock`/`setStockOverride`).
 */
export async function POST(request: Request) {
  if (request.headers.get("x-restock-secret") !== RESTOCK_SECRET) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  let body: { productId?: string; newStock?: number };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Cuerpo inválido." }, { status: 400 });
  }
  const productId = (body.productId || "").trim();
  const newStock = Number.isFinite(body.newStock) ? Number(body.newStock) : 5;

  const product = getProductById(productId);
  if (!product) return NextResponse.json({ error: "Producto no encontrado." }, { status: 404 });
  if (newStock <= 0) return NextResponse.json({ error: "newStock debe ser mayor que 0 para simular una reposición." }, { status: 400 });

  await setStockOverride(productId, newStock);

  // Detectar solicitudes pendientes (sin notificar) de ese producto.
  const requests = await readJson<BackInStockRequest[]>("back-in-stock-requests.json", []);
  const pending = requests.filter((r) => r.productId === productId && !r.notifiedAt);

  const now = new Date().toISOString();
  if (pending.length > 0) {
    await sendEmails(
      pending.map((reqItem) => ({
        to: reqItem.email,
        subject: `${product.name} ya está disponible de nuevo`,
        body: `Hola, la pieza que esperabas (${product.name}) ha vuelto a tener stock. Ya puedes comprarla en /producto/${product.slug}.`,
      })),
    );
    const updated = requests.map((r) => (r.productId === productId && !r.notifiedAt ? { ...r, notifiedAt: now } : r));
    await writeJson("back-in-stock-requests.json", updated);
  }

  return NextResponse.json({ ok: true, productId, newStock, notified: pending.length });
}
