import { NextResponse } from "next/server";
import { readJson, writeJson } from "@/lib/localDb";
import { createToken, type GiftStory } from "@/lib/giftStory";
import { checkRateLimit, ipKeyFrom, rateLimitedResponse } from "@/lib/rateLimit";

const FILE = "gift-stories.json";
const LIMIT = 10;
const WINDOW_MS = 10 * 60 * 1000;

export async function POST(request: Request) {
  const { allowed, retryAfterMs } = checkRateLimit(`gift-story:${ipKeyFrom(request)}`, LIMIT, WINDOW_MS);
  if (!allowed) return rateLimitedResponse(retryAfterMs);

  const body = await request.json().catch(() => null);
  const message = typeof body?.message === "string" ? body.message.trim() : "";
  const occasion = typeof body?.occasion === "string" ? body.occasion.trim() : "";

  if (!message || message.length > 600 || !occasion) {
    return NextResponse.json({ error: "Escribe un mensaje (máx. 600 caracteres) y una ocasión." }, { status: 400 });
  }

  const stories = await readJson<GiftStory[]>(FILE, []);
  const story: GiftStory = {
    token: createToken(),
    recipientName: typeof body?.recipientName === "string" ? body.recipientName.trim().slice(0, 60) : undefined,
    message,
    occasion,
    place: typeof body?.place === "string" ? body.place.trim().slice(0, 80) : undefined,
    date: typeof body?.date === "string" ? body.date.trim().slice(0, 40) : undefined,
    productName: typeof body?.productName === "string" ? body.productName.trim().slice(0, 120) : undefined,
    createdAt: new Date().toISOString(),
  };
  stories.push(story);
  await writeJson(FILE, stories);

  return NextResponse.json({ token: story.token });
}

export async function DELETE(request: Request) {
  const body = await request.json().catch(() => null);
  const token = typeof body?.token === "string" ? body.token : "";
  if (!token) return NextResponse.json({ error: "Falta el token." }, { status: 400 });

  const stories = await readJson<GiftStory[]>(FILE, []);
  const next = stories.filter((s) => s.token !== token);
  await writeJson(FILE, next);
  return NextResponse.json({ ok: true });
}
