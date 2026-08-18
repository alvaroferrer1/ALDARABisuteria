"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { GIFT_CARD_AMOUNTS } from "@/lib/giftCards";
import { money } from "@/lib/storage";
import { useTranslations } from "@/lib/i18n/localeStore";
import { GiftCardVisual } from "@/components/GiftCardVisual";
import { PhotoSlot } from "@/components/PhotoSlot";

/**
 * DEMO: crea un código y saldo reales (persistidos en gift-cards.json),
 * sin pasarela de pago conectada — mismo criterio que el checkout normal.
 * El saldo SÍ se descuenta de verdad al canjear (ver /api/orders).
 */
export default function GiftCardsPage() {
  const { t } = useTranslations();
  const m = t.misc;
  const [amount, setAmount] = useState<number>(GIFT_CARD_AMOUNTS[1]);
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [error, setError] = useState("");
  const [card, setCard] = useState<{ code: string; amount: number; recipientEmail?: string; recipientName?: string } | null>(null);
  // Guarda de doble-submit: además del botón deshabilitado durante "loading"
  // (que ya cubre el caso normal), este ref evita una segunda petición real
  // si el evento de submit se disparase dos veces antes de que React
  // re-renderice con el nuevo estado (doble clic muy rápido, doble tap táctil).
  const submittingRef = useRef(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submittingRef.current) return;
    submittingRef.current = true;
    const formEl = e.currentTarget;
    setStatus("loading");
    setError("");
    const form = new FormData(formEl);
    const recipientEmail = String(form.get("recipientEmail") || "").trim();
    const recipientName = String(form.get("recipientName") || "").trim();
    const payload = {
      amount,
      buyerEmail: form.get("buyerEmail"),
      recipientName: form.get("recipientName"),
      recipientEmail,
      message: form.get("message"),
    };
    try {
      const res = await fetch("/api/gift-cards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "No se pudo crear la tarjeta regalo.");
      setCard({ code: data.card.code, amount: data.card.amount, recipientEmail: data.emailedToRecipient ? recipientEmail : undefined, recipientName: recipientName || undefined });
      setStatus("ok");
      formEl.reset();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Error inesperado.");
    } finally {
      submittingRef.current = false;
    }
  }

  if (card) {
    return (
      <section className="mx-auto max-w-lg px-4 py-24 text-center sm:px-6">
        <span className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gold-light text-2xl">✓</span>
        <h1 className="font-display text-3xl font-semibold">{m.giftCardsReadyTitle}</h1>
        <p className="mt-3 text-ink-soft">{m.giftCardsReadyText}</p>
        <div className="mt-8">
          <GiftCardVisual code={card.code} amount={card.amount} recipientName={card.recipientName} />
          <p className="mt-3 text-sm text-ink-soft">
            {money(card.amount)} {m.giftCardsBalance}
          </p>
        </div>
        {card.recipientEmail && (
          <p className="mt-4 text-sm text-terracotta">
            {m.giftCardsEmailedRecipient} {card.recipientEmail}
          </p>
        )}
        <Link href="/shop" className="mt-8 inline-block rounded-full bg-ink px-6 py-3.5 font-semibold text-ivory">
          {m.giftCardsGoToCatalog}
        </Link>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-lg px-4 py-16 sm:px-6">
      <div className="relative mb-8 aspect-4/3 overflow-hidden rounded-3xl">
        <PhotoSlot name="gift-card-hero" alt="" fallback={<div className="absolute inset-0 bg-surface-2" />} />
      </div>
      <p className="mb-2 text-xs font-bold uppercase tracking-widest text-terracotta">{m.giftCardsEyebrow}</p>
      <h1 className="mb-2 font-display text-3xl font-semibold sm:text-4xl">{m.giftCardsTitle}</h1>
      <p className="mb-8 text-ink-soft">{m.giftCardsSubtitle}</p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div>
          <p className="mb-2 text-sm font-medium text-ink-soft">{m.giftCardsAmount}</p>
          <div className="flex gap-3">
            {GIFT_CARD_AMOUNTS.map((a) => (
              <button
                key={a}
                type="button"
                onClick={() => setAmount(a)}
                aria-pressed={amount === a}
                className={`flex-1 rounded-xl border py-3 font-semibold ${amount === a ? "border-ink bg-ink text-ivory" : "border-line"}`}
              >
                {money(a)}
              </button>
            ))}
          </div>
        </div>
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-ink-soft">{m.giftCardsYourEmail}</span>
          <input name="buyerEmail" type="email" required maxLength={120} className="rounded-lg border border-line bg-surface px-3.5 py-2.5" />
        </label>
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-ink-soft">{m.giftCardsRecipientName}</span>
          <input name="recipientName" maxLength={60} placeholder="María" className="rounded-lg border border-line bg-surface px-3.5 py-2.5" />
        </label>
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-ink-soft">{m.giftCardsRecipientEmail}</span>
          <input name="recipientEmail" type="email" maxLength={120} className="rounded-lg border border-line bg-surface px-3.5 py-2.5" />
        </label>
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-ink-soft">{m.giftCardsMessage}</span>
          <textarea name="message" rows={3} maxLength={300} className="rounded-lg border border-line bg-surface px-3.5 py-2.5" />
        </label>
        {status === "error" && <p className="text-sm font-semibold text-red-600">{error}</p>}
        <button type="submit" disabled={status === "loading"} className="rounded-full bg-ink px-6 py-3.5 font-semibold text-ivory disabled:opacity-50">
          {status === "loading" ? m.giftCardsCreating : `${m.giftCardsBuyButton} ${money(amount)}`}
        </button>
      </form>
    </section>
  );
}
