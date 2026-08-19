import { NextResponse } from "next/server";
import { readJson, writeJson } from "@/lib/localDb";
import { generateGiftCardCode, GIFT_CARD_AMOUNTS } from "@/lib/giftCards";
import { sendEmail } from "@/lib/email";
import { checkRateLimit, ipKeyFrom, rateLimitedResponse } from "@/lib/rateLimit";
import type { GiftCard } from "@/lib/types";

const FILE = "gift-cards.json";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CREATE_LIMIT = 6;
const CREATE_WINDOW_MS = 15 * 60 * 1000;
// Límite más estricto en la consulta por código: es la ruta que un script
// usaría para probar códigos al azar y encontrar uno con saldo real.
const LOOKUP_LIMIT = 15;
const LOOKUP_WINDOW_MS = 5 * 60 * 1000;

/**
 * Compra de tarjeta regalo — DEMO: crea un código real y un saldo real
 * persistido, pero sin pasarela de pago conectada (igual que /api/orders).
 * El saldo SÍ se descuenta de verdad al canjear en checkout (ver
 * /api/orders POST), no es solo decorativo.
 */
export async function POST(request: Request) {
  const { allowed, retryAfterMs } = checkRateLimit(`gift-cards:create:${ipKeyFrom(request)}`, CREATE_LIMIT, CREATE_WINDOW_MS);
  if (!allowed) return rateLimitedResponse(retryAfterMs);

  let body: { amount?: number; buyerEmail?: string; recipientName?: string; recipientEmail?: string; message?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Cuerpo inválido." }, { status: 400 });
  }
  const amount = Number(body.amount);
  const buyerEmail = (body.buyerEmail || "").trim();

  if (!(GIFT_CARD_AMOUNTS as readonly number[]).includes(amount)) {
    return NextResponse.json({ error: "Importe no válido." }, { status: 400 });
  }
  if (!EMAIL_RE.test(buyerEmail)) return NextResponse.json({ error: "Escribe un email válido." }, { status: 400 });

  const card: GiftCard = {
    code: generateGiftCardCode(),
    amount,
    balance: amount,
    recipientName: body.recipientName?.trim().slice(0, 60) || undefined,
    recipientEmail: body.recipientEmail?.trim().slice(0, 120) || undefined,
    message: body.message?.trim().slice(0, 300) || undefined,
    buyerEmail,
    createdAt: new Date().toISOString(),
  };

  const cards = await readJson<GiftCard[]>(FILE, []);
  cards.push(card);
  await writeJson(FILE, cards);

  // Envío real al destinatario si se indicó un email — mismo DemoEmailProvider
  // ya usado en recuperación de contraseña (registra el "email" en
  // data/demo-emails.json en vez de mandarlo de verdad). Si no hay
  // `recipientEmail`, se mantiene el flujo actual: el comprador comparte el
  // código él mismo. Nunca se expone el código de OTRA tarjeta — solo el que
  // se acaba de crear en esta misma petición.
  if (card.recipientEmail) {
    await sendEmail({
      to: card.recipientEmail,
      subject: "Te han enviado una tarjeta regalo ALDARA",
      body: `${card.recipientName ? `Hola ${card.recipientName}, ` : "Hola, "}te han regalado una tarjeta ALDARA de ${card.amount}€.\nCódigo: ${card.code}\n${card.message ? `Mensaje: ${card.message}` : ""}`,
    });
  }

  return NextResponse.json({ ok: true, card, emailedToRecipient: Boolean(card.recipientEmail) });
}

/** Consultar saldo de un código real — GET /api/gift-cards?code=ALDR-XXXX-XXXX */
export async function GET(request: Request) {
  const { allowed, retryAfterMs } = checkRateLimit(`gift-cards:lookup:${ipKeyFrom(request)}`, LOOKUP_LIMIT, LOOKUP_WINDOW_MS);
  if (!allowed) return rateLimitedResponse(retryAfterMs);

  const code = new URL(request.url).searchParams.get("code")?.trim().toUpperCase();
  if (!code) return NextResponse.json({ error: "Falta el código." }, { status: 400 });

  const cards = await readJson<GiftCard[]>(FILE, []);
  const card = cards.find((c) => c.code === code);
  if (!card) return NextResponse.json({ error: "No encontramos esa tarjeta regalo." }, { status: 404 });

  return NextResponse.json({ card: { code: card.code, balance: card.balance, amount: card.amount } });
}
