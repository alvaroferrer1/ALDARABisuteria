import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { randomUUID } from "node:crypto";
import { readJson, writeJson } from "@/lib/localDb";
import { PRODUCTS } from "@/lib/products";
import { GIFT_WRAP_PRICE } from "@/lib/giftCards";
import { readSessionCookieValue, SESSION_COOKIE_NAME } from "@/lib/auth";
import { getBalance, appendMovement } from "@/lib/clubLedger";
import { POINTS_PER_EURO_DISCOUNT, pointsToEuros } from "@/lib/club";
import { recordEvent } from "@/lib/analytics";
import { computeShippingCost } from "@/lib/shipping";
import type { DemoOrder, Address, GiftCard } from "@/lib/types";

const FILE = "orders.json";
const GIFT_CARDS_FILE = "gift-cards.json";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface OrderRequestBody {
  email: string;
  address: Address;
  lines: Array<{ productId: string; quantity: number }>;
  giftCardCode?: string;
  giftWrap?: boolean;
  giftMessage?: string;
  personalizationNote?: string;
  /** Puntos del Club que el usuario quiere canjear en este pedido (opcional). */
  redeemPoints?: number;
  /** Id de sesión de analítica local, solo si el usuario aceptó esa cookie (ver lib/trackEvent.ts). */
  analyticsSessionId?: string;
}

function isAddress(value: unknown): value is Address {
  if (typeof value !== "object" || value === null) return false;
  const a = value as Record<string, unknown>;
  return ["fullName", "street", "city", "postalCode", "province", "country", "phone"].every(
    (k) => typeof a[k] === "string" && (a[k] as string).trim().length > 0
  );
}

export async function POST(request: Request) {
  let body: Partial<OrderRequestBody>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Cuerpo de la petición inválido." }, { status: 400 });
  }

  const email = typeof body.email === "string" ? body.email : "";
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Email inválido." }, { status: 400 });
  }
  if (!isAddress(body.address)) {
    return NextResponse.json({ error: "Dirección incompleta." }, { status: 400 });
  }
  if (!Array.isArray(body.lines) || body.lines.length === 0) {
    return NextResponse.json({ error: "La cesta está vacía." }, { status: 400 });
  }

  const items: DemoOrder["items"] = [];
  let total = 0;
  for (const line of body.lines) {
    if (!line || typeof line.productId !== "string" || !Number.isFinite(line.quantity) || line.quantity <= 0) continue;
    const product = PRODUCTS.find((p) => p.id === line.productId);
    if (!product) continue;
    const quantity = Math.min(Math.floor(line.quantity), 20);
    items.push({ productId: product.id, name: product.name, quantity, price: product.price });
    total += product.price * quantity;
  }
  if (items.length === 0) {
    return NextResponse.json({ error: "Ningún producto válido en el pedido." }, { status: 400 });
  }

  // Envío real, calculado en el servidor a partir del subtotal de producto
  // (nunca de un importe que mande el cliente) — antes no se cobraba nunca,
  // pese a que el carrito y el checkout prometían un cargo por debajo del
  // umbral. Ver lib/shipping.ts.
  const shippingCost = computeShippingCost(total);
  total += shippingCost;

  const giftWrap = body.giftWrap === true;
  if (giftWrap) total += GIFT_WRAP_PRICE;
  const giftMessage = typeof body.giftMessage === "string" ? body.giftMessage.trim().slice(0, 200) : "";
  const personalizationNote = typeof body.personalizationNote === "string" ? body.personalizationNote.trim().slice(0, 200) : "";

  // Canje real de tarjeta regalo: valida el código, descuenta del saldo
  // guardado de verdad (no es un descuento decorativo) y reduce el total.
  let giftCardCode: string | undefined;
  let giftCardApplied = 0;
  const rawCode = typeof body.giftCardCode === "string" ? body.giftCardCode.trim().toUpperCase() : "";
  let cards: GiftCard[] = [];
  let cardIndex = -1;
  if (rawCode) {
    cards = await readJson<GiftCard[]>(GIFT_CARDS_FILE, []);
    cardIndex = cards.findIndex((c) => c.code === rawCode);
    if (cardIndex === -1) {
      return NextResponse.json({ error: "El código de tarjeta regalo no es válido." }, { status: 400 });
    }
    if (cards[cardIndex].balance <= 0) {
      return NextResponse.json({ error: "Esa tarjeta regalo ya no tiene saldo." }, { status: 400 });
    }
    giftCardApplied = Math.min(cards[cardIndex].balance, total);
    giftCardCode = rawCode;
  }

  // Identidad SIEMPRE resuelta desde la sesión firmada — nunca desde
  // `body.email` para lo que toca al Club. Evita que un checkout de invitado
  // (o uno con un email distinto al de la cuenta) infle o canjee puntos de
  // otra persona; el mismo criterio de seguridad que el resto de endpoints
  // ya auditados esta sesión (pedidos, reparaciones, exportación de datos).
  const cookieStore = await cookies();
  const session = readSessionCookieValue(cookieStore.get(SESSION_COOKIE_NAME)?.value);
  const sessionOwnsThisCheckout = !!session && session.email.toLowerCase() === email.toLowerCase();

  // Canje real de puntos del Club — ledger, no una resta directa sobre el
  // total. Se valida el saldo real (suma de movimientos) justo antes de
  // escribir, se limita a lo que hace falta para no dejar el pedido en
  // negativo, y el canje solo se registra si el pedido se confirma de
  // verdad (todo en la misma petición: no hay un paso de "reservar puntos"
  // separado que pueda quedar a medias).
  const subtotalAfterGiftCard = Math.max(0, total - giftCardApplied);
  let pointsRedeemed = 0;
  let pointsDiscount = 0;
  const requestedPoints = Number.isFinite(body.redeemPoints) ? Math.max(0, Math.floor(body.redeemPoints!)) : 0;
  if (requestedPoints > 0) {
    if (!sessionOwnsThisCheckout) {
      return NextResponse.json({ error: "Inicia sesión con la cuenta del pedido para canjear puntos." }, { status: 401 });
    }
    const balance = await getBalance(session!.email);
    if (requestedPoints > balance) {
      return NextResponse.json({ error: "No tienes suficientes puntos para ese canje." }, { status: 400 });
    }
    const maxUsefulPoints = Math.floor(subtotalAfterGiftCard * POINTS_PER_EURO_DISCOUNT);
    pointsRedeemed = Math.min(requestedPoints, maxUsefulPoints);
    pointsDiscount = pointsToEuros(pointsRedeemed);
  }

  const order: DemoOrder = {
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    items,
    total: Math.max(0, subtotalAfterGiftCard - pointsDiscount),
    shippingCost,
    address: body.address,
    email,
    status: "recibido",
    ...(giftCardCode ? { giftCardCode, giftCardApplied } : {}),
    ...(giftWrap ? { giftWrap } : {}),
    ...(giftMessage ? { giftMessage } : {}),
    ...(personalizationNote ? { personalizationNote } : {}),
    ...(pointsRedeemed > 0 ? { pointsRedeemed, pointsDiscount } : {}),
  };

  const orders = await readJson<DemoOrder[]>(FILE, []);
  orders.push(order);
  await writeJson(FILE, orders);

  const analyticsSessionId = typeof body.analyticsSessionId === "string" && /^[a-zA-Z0-9-]{8,64}$/.test(body.analyticsSessionId) ? body.analyticsSessionId : undefined;
  if (analyticsSessionId) {
    await recordEvent({ type: "purchase", path: "/checkout", sessionId: analyticsSessionId, ts: order.createdAt, meta: { total: order.total, items: items.length } });
  }

  if (giftCardCode && cardIndex !== -1) {
    cards[cardIndex] = { ...cards[cardIndex], balance: cards[cardIndex].balance - giftCardApplied };
    await writeJson(GIFT_CARDS_FILE, cards);
  }

  if (pointsRedeemed > 0 && session) {
    await appendMovement({
      user: session.email,
      type: "redeem",
      points: -pointsRedeemed,
      reason: `Canje en pedido ${order.id}`,
      orderId: order.id,
    });
  }

  // Puntos ganados por este pedido — solo si el email del pedido es
  // realmente el de la sesión autenticada (si no, no se puede atribuir el
  // gasto a una cuenta real, y no se inventa un saldo para nadie).
  if (sessionOwnsThisCheckout) {
    const earned = Math.floor(order.total);
    if (earned > 0) {
      await appendMovement({
        user: session!.email,
        type: "earn",
        points: earned,
        reason: `Pedido ${order.id}`,
        orderId: order.id,
      });
    }
  }

  return NextResponse.json({ ok: true, order });
}

/**
 * Solo devuelve UN pedido, y solo si coinciden id + email exactos (lookup
 * de seguimiento estilo "invitado", como cualquier ecommerce real). Nunca
 * se expone la lista completa de pedidos sin autenticar — antes este
 * endpoint devolvía TODOS los pedidos (con direcciones y emails de todos
 * los clientes) a cualquiera que hiciera GET /api/orders sin parámetros;
 * corregido.
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const id = url.searchParams.get("id");
  const email = url.searchParams.get("email");
  if (!id || !email) {
    return NextResponse.json({ error: "Indica el número de pedido y el email con el que lo hiciste." }, { status: 400 });
  }
  const orders = await readJson<DemoOrder[]>(FILE, []);
  const order = orders.find((o) => o.id === id && o.email.toLowerCase() === email.toLowerCase());
  if (!order) return NextResponse.json({ error: "No encontramos un pedido con esos datos." }, { status: 404 });
  return NextResponse.json({ order });
}
