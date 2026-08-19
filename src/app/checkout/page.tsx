"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useCart, GIFT_WRAP_PRICE } from "@/context/CartContext";
import { PRODUCTS } from "@/lib/products";
import { money } from "@/lib/storage";
import { useTranslations } from "@/lib/i18n/localeStore";
import { POINTS_PER_EURO_DISCOUNT, pointsToEuros } from "@/lib/club";
import { activePaymentProvider } from "@/lib/payment";

type PaymentMethodId = "tarjeta" | "paypal" | "bizum";

interface AddressForm {
  fullName: string;
  email: string;
  street: string;
  city: string;
  postalCode: string;
  province: string;
  phone: string;
}

const EMPTY_ADDRESS: AddressForm = { fullName: "", email: "", street: "", city: "", postalCode: "", province: "", phone: "" };

/**
 * Flujo de compra en 3 pasos (Envío / Pago / Revisar pedido) con indicador
 * de progreso — calcado del mockup "05 · Flujo de compra" (p.31, panel 3
 * "Checkout"). Antes era un único formulario largo sin pasos. El selector
 * de método de pago es solo interfaz (Tarjeta/PayPal/Bizum): sigue sin
 * haber pasarela de pago real conectada, y el aviso honesto se mantiene en
 * el paso de revisión — no se simula un cobro real.
 */
export default function CheckoutPage() {
  const { t } = useTranslations();
  const STEPS = [t.checkout.stepShipping, t.checkout.stepPayment, t.checkout.stepReview];
  const PAYMENT_METHODS = [
    { id: "tarjeta" as const, label: t.checkout.paymentCard },
    { id: "paypal" as const, label: t.checkout.paymentPaypal },
    { id: "bizum" as const, label: t.checkout.paymentBizum },
  ];
  const { lines, totalPrice, clear, giftWrap, giftMessage, setGiftWrap, setGiftMessage, personalizationNote } = useCart();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [address, setAddress] = useState<AddressForm>(EMPTY_ADDRESS);
  const [payment, setPayment] = useState<PaymentMethodId>("tarjeta");
  const [cardNumber, setCardNumber] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [paymentFailed, setPaymentFailed] = useState(false);
  const [giftCardCode, setGiftCardCode] = useState("");
  const [giftCardStatus, setGiftCardStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [giftCardBalance, setGiftCardBalance] = useState<number | null>(null);
  const [giftCardError, setGiftCardError] = useState("");
  const [pointsBalance, setPointsBalance] = useState<number | null>(null);
  const [usePoints, setUsePoints] = useState(false);

  // Saldo real de puntos — solo se muestra si hay sesión (401 = no
  // autenticado, se oculta la opción sin mostrar error, igual que el resto
  // de piezas "solo si has iniciado sesión" del sitio).
  useEffect(() => {
    fetch("/api/club/balance")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setPointsBalance(data?.balance ?? null))
      .catch(() => setPointsBalance(null));
  }, []);

  async function applyGiftCard() {
    if (!giftCardCode.trim()) return;
    setGiftCardStatus("loading");
    setGiftCardError("");
    try {
      const res = await fetch(`/api/gift-cards?code=${encodeURIComponent(giftCardCode.trim())}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Código no válido.");
      setGiftCardBalance(data.card.balance);
      setGiftCardStatus("ok");
    } catch (err) {
      setGiftCardStatus("error");
      setGiftCardBalance(null);
      setGiftCardError(err instanceof Error ? err.message : "Error inesperado.");
    }
  }

  const subtotalWithWrap = totalPrice + (giftWrap ? GIFT_WRAP_PRICE : 0);
  const giftCardDiscount = giftCardStatus === "ok" && giftCardBalance !== null ? Math.min(giftCardBalance, subtotalWithWrap) : 0;
  const afterGiftCard = Math.max(0, subtotalWithWrap - giftCardDiscount);
  const maxUsefulPoints = Math.floor(afterGiftCard * POINTS_PER_EURO_DISCOUNT);
  const pointsToRedeem = usePoints && pointsBalance ? Math.min(pointsBalance, maxUsefulPoints) : 0;
  const pointsDiscount = pointsToEuros(pointsToRedeem);
  const finalTotal = Math.max(0, afterGiftCard - pointsDiscount);

  const addressValid = Object.values(address).every((v) => v.trim().length > 0);

  async function confirmOrder() {
    setError("");
    setPaymentFailed(false);

    // Pasa por el mismo `PaymentProvider` que se sustituirá por una pasarela
    // real (ver lib/payment.ts) — hoy es una simulación honesta (tarjeta
    // terminada en "0002" = rechazo, convención habitual de tarjetas de
    // prueba), pero el checkout ya no conoce esa regla directamente.
    const paymentResult = await activePaymentProvider.charge({ method: payment, cardNumber, amount: finalTotal });
    if (!paymentResult.ok) {
      setPaymentFailed(true);
      return;
    }

    setSubmitting(true);
    const body = {
      email: address.email,
      address: {
        fullName: address.fullName,
        street: address.street,
        city: address.city,
        postalCode: address.postalCode,
        province: address.province,
        country: "España",
        phone: address.phone,
      },
      lines,
      ...(giftCardStatus === "ok" ? { giftCardCode: giftCardCode.trim() } : {}),
      ...(pointsToRedeem > 0 ? { redeemPoints: pointsToRedeem } : {}),
      ...(giftWrap ? { giftWrap: true } : {}),
      ...(giftMessage.trim() ? { giftMessage: giftMessage.trim() } : {}),
      ...(personalizationNote.trim() ? { personalizationNote: personalizationNote.trim() } : {}),
    };
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "No se pudo confirmar el pedido.");
      clear();
      router.push(`/checkout/success?id=${data.order.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ha ocurrido un error.");
      setSubmitting(false);
    }
  }

  if (lines.length === 0) {
    return (
      <section className="mx-auto max-w-lg px-4 py-24 text-center sm:px-6">
        <h1 className="font-display text-2xl font-semibold">{t.checkout.emptyCartTitle}</h1>
        <Link href="/shop" className="mt-5 inline-block rounded-full bg-ink px-6 py-3 font-semibold text-ivory">
          {t.checkout.goToCatalog}
        </Link>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <h1 className="font-display text-3xl font-semibold">{t.checkout.title}</h1>

      {/* Indicador de pasos */}
      <div className="mt-6 flex items-center gap-3">
        {STEPS.map((label, i) => (
          <div key={label} className="flex items-center gap-3">
            <span className={`flex items-center gap-2 text-sm font-semibold ${i === step ? "text-ink" : i < step ? "text-terracotta" : "text-ink-soft"}`}>
              <span
                className={`flex h-6 w-6 items-center justify-center rounded-full text-xs ${
                  i <= step ? "bg-ink text-ivory" : "bg-surface-2"
                }`}
              >
                {i < step ? "✓" : i + 1}
              </span>
              <span className="hidden sm:inline">{label}</span>
            </span>
            {i < STEPS.length - 1 && <span className="h-px w-6 bg-line sm:w-10" />}
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-10 md:grid-cols-[1fr_320px]">
        <div className="flex flex-col gap-4">
          {step === 0 && (
            <>
              <h2 className="font-semibold">{t.checkout.shippingDataTitle}</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label={t.checkout.fullName} value={address.fullName} onChange={(v) => setAddress((a) => ({ ...a, fullName: v }))} />
                <Field label={t.checkout.email} type="email" value={address.email} onChange={(v) => setAddress((a) => ({ ...a, email: v }))} />
              </div>
              <Field label={t.checkout.address} value={address.street} onChange={(v) => setAddress((a) => ({ ...a, street: v }))} />
              <div className="grid gap-4 sm:grid-cols-3">
                <Field label={t.checkout.city} value={address.city} onChange={(v) => setAddress((a) => ({ ...a, city: v }))} />
                <Field label={t.checkout.postalCode} value={address.postalCode} onChange={(v) => setAddress((a) => ({ ...a, postalCode: v }))} />
                <Field label={t.checkout.province} value={address.province} onChange={(v) => setAddress((a) => ({ ...a, province: v }))} />
              </div>
              <Field label={t.checkout.phone} type="tel" value={address.phone} onChange={(v) => setAddress((a) => ({ ...a, phone: v }))} />
              <button
                type="button"
                disabled={!addressValid}
                onClick={() => setStep(1)}
                className="mt-2 rounded-full bg-ink px-6 py-3.5 font-semibold text-ivory transition-transform hover:-translate-y-0.5 disabled:opacity-40"
              >
                {t.checkout.continueToPayment}
              </button>
            </>
          )}

          {step === 1 && (
            <>
              <div className="flex items-center justify-between">
                <h2 className="font-semibold">{t.checkout.paymentMethodTitle}</h2>
                {/* Refuerzo de confianza estándar de ecommerce — texto, no
                    logotipos exactos de marcas registradas (evita reproducir
                    de forma imprecisa un logo de terceros). */}
                <div className="flex gap-1.5" aria-hidden="true">
                  {["VISA", "Mastercard", "Bizum"].map((brand) => (
                    <span key={brand} className="rounded border border-line px-1.5 py-0.5 text-[0.6rem] font-bold uppercase tracking-wide text-ink-soft">
                      {brand}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-2.5">
                {PAYMENT_METHODS.map((m) => (
                  <label
                    key={m.id}
                    className={`flex items-center gap-3 rounded-xl border px-4 py-3.5 text-sm font-medium ${
                      payment === m.id ? "border-ink" : "border-line"
                    }`}
                  >
                    <input type="radio" name="payment" checked={payment === m.id} onChange={() => setPayment(m.id)} className="accent-terracotta" />
                    {m.label}
                  </label>
                ))}
              </div>

              {payment === "tarjeta" && (
                <label className="flex flex-col gap-1.5 text-sm">
                  <span className="font-medium text-ink-soft">{t.checkout.cardNumber}</span>
                  <input
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value.replace(/[^0-9 ]/g, "").slice(0, 24))}
                    inputMode="numeric"
                    placeholder="4242 4242 4242 4242"
                    className="rounded-lg border border-line bg-surface px-3.5 py-2.5"
                  />
                  <span className="text-xs text-ink-soft">{t.checkout.cardNumberHint}</span>
                </label>
              )}

              <div className="mt-4 rounded-xl border border-line p-4">
                <p className="mb-3 text-sm font-semibold">{t.checkout.isGift}</p>
                <label className="flex items-start gap-2.5 text-sm">
                  <input
                    type="checkbox"
                    checked={giftWrap}
                    onChange={(e) => setGiftWrap(e.target.checked)}
                    className="mt-0.5 h-4 w-4 shrink-0 accent-terracotta"
                  />
                  <span>
                    <span className="font-medium">{t.checkout.giftWrap}</span>
                    <span className="block text-ink-soft">
                      {t.checkout.giftWrapSub} {money(GIFT_WRAP_PRICE)}
                    </span>
                  </span>
                </label>
                <label className="mt-3 flex flex-col gap-1.5 text-sm">
                  <span className="font-medium text-ink-soft">{t.checkout.dedication}</span>
                  <textarea
                    value={giftMessage}
                    onChange={(e) => setGiftMessage(e.target.value)}
                    maxLength={200}
                    rows={2}
                    placeholder={t.checkout.dedicationPlaceholder}
                    className="resize-none rounded-lg border border-line bg-surface px-3 py-2 text-sm"
                  />
                </label>
              </div>

              <div className="mt-2 flex gap-3">
                <button type="button" onClick={() => setStep(0)} className="rounded-full border border-line px-6 py-3.5 font-semibold">
                  {t.checkout.back}
                </button>
                <button type="button" onClick={() => setStep(2)} className="rounded-full bg-ink px-6 py-3.5 font-semibold text-ivory">
                  {t.checkout.reviewOrder}
                </button>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <h2 className="font-semibold">{t.checkout.reviewTitle}</h2>
              <div className="rounded-xl border border-line p-4 text-sm">
                <p className="font-semibold">{address.fullName}</p>
                <p className="text-ink-soft">
                  {address.street}, {address.postalCode} {address.city} ({address.province})
                </p>
                <p className="text-ink-soft">{address.email} · {address.phone}</p>
                <p className="mt-2 text-ink-soft">
                  {t.checkout.paymentLabel} <strong className="text-ink">{PAYMENT_METHODS.find((m) => m.id === payment)?.label}</strong>
                </p>
              </div>
              <p className="rounded-xl bg-surface-2 px-4 py-3 text-sm text-ink-soft">{t.checkout.demoNotice}</p>

              {paymentFailed && (
                <div role="alert" className="rounded-xl border border-red-300 bg-red-50 p-4">
                  <p className="font-semibold text-red-700">{t.checkout.paymentFailedTitle}</p>
                  <p className="mt-1 text-sm text-red-700">{t.checkout.paymentFailedBody}</p>
                  <div className="mt-3 flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setPaymentFailed(false);
                        confirmOrder();
                      }}
                      className="rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-ivory"
                    >
                      {t.checkout.retryPayment}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setPaymentFailed(false);
                        setCardNumber("");
                        setStep(1);
                      }}
                      className="rounded-full border border-line px-5 py-2.5 text-sm font-semibold"
                    >
                      {t.checkout.changePaymentMethod}
                    </button>
                  </div>
                </div>
              )}

              {error && <p className="text-sm font-semibold text-red-600">{error}</p>}

              <div className="flex gap-3">
                <button type="button" onClick={() => setStep(1)} className="rounded-full border border-line px-6 py-3.5 font-semibold">
                  {t.checkout.back}
                </button>
                <button
                  type="button"
                  onClick={confirmOrder}
                  disabled={submitting}
                  className="rounded-full bg-ink px-6 py-3.5 font-semibold text-ivory transition-transform hover:-translate-y-0.5 disabled:opacity-50"
                >
                  {submitting ? t.checkout.confirming : t.checkout.confirmOrder}
                </button>
              </div>
            </>
          )}
        </div>

        <aside className="h-fit rounded-2xl bg-surface-2 p-6">
          <h2 className="mb-4 font-semibold">{t.checkout.orderSummary}</h2>
          <ul className="flex flex-col gap-2 text-sm">
            {lines.map((line) => {
              const product = PRODUCTS.find((p) => p.id === line.productId);
              if (!product) return null;
              return (
                <li key={line.productId} className="flex justify-between">
                  <span>
                    {line.quantity}x {product.name}
                  </span>
                  <span>{money(product.price * line.quantity)}</span>
                </li>
              );
            })}
          </ul>

          <div className="mt-4 border-t border-line pt-4">
            <p className="mb-2 text-sm font-medium text-ink-soft">{t.checkout.haveGiftCard}</p>
            <div className="flex gap-2">
              <input
                value={giftCardCode}
                onChange={(e) => {
                  setGiftCardCode(e.target.value);
                  setGiftCardStatus("idle");
                }}
                placeholder="ALDR-XXXX-XXXX"
                className="min-w-0 flex-1 rounded-lg border border-line bg-surface px-3 py-2 text-sm uppercase"
              />
              <button
                type="button"
                onClick={applyGiftCard}
                disabled={giftCardStatus === "loading"}
                className="shrink-0 rounded-lg border border-line px-3 py-2 text-sm font-semibold hover:border-ink disabled:opacity-50"
              >
                {t.checkout.apply}
              </button>
            </div>
            {giftCardStatus === "ok" && (
              <p className="mt-2 text-sm font-semibold text-terracotta">
                {t.checkout.availableBalance} {money(giftCardBalance ?? 0)}
              </p>
            )}
            {giftCardStatus === "error" && <p className="mt-2 text-sm font-semibold text-red-600">{giftCardError}</p>}
          </div>

          {pointsBalance !== null && pointsBalance > 0 && (
            <label className="mt-4 flex items-start gap-2.5 border-t border-line pt-4 text-sm">
              <input
                type="checkbox"
                checked={usePoints}
                onChange={(e) => setUsePoints(e.target.checked)}
                className="mt-0.5 h-4 w-4 shrink-0 accent-terracotta"
              />
              <span>
                <span className="font-medium">{t.checkout.usePoints}</span>
                <span className="block text-ink-soft">
                  {pointsBalance} pts {t.checkout.pointsAvailable}
                </span>
              </span>
            </label>
          )}

          {giftWrap && (
            <div className="mt-3 flex justify-between text-sm">
              <span>{t.checkout.giftWrapLine}</span>
              <span>{money(GIFT_WRAP_PRICE)}</span>
            </div>
          )}
          {personalizationNote.trim() && (
            <p className="mt-3 rounded-lg bg-surface px-3 py-2 text-xs text-ink-soft">
              <strong className="font-semibold text-ink">{t.checkout.personalization}</strong> {personalizationNote}
            </p>
          )}
          {giftCardDiscount > 0 && (
            <div className="mt-3 flex justify-between text-sm text-terracotta">
              <span>{t.checkout.giftCardApplied}</span>
              <span>−{money(giftCardDiscount)}</span>
            </div>
          )}
          {pointsToRedeem > 0 && (
            <div className="mt-3 flex justify-between text-sm text-terracotta">
              <span>
                {t.checkout.pointsApplied} ({pointsToRedeem} pts)
              </span>
              <span>−{money(pointsDiscount)}</span>
            </div>
          )}
          <div className="mt-2 flex justify-between border-t border-line pt-4 text-lg">
            <span>{t.checkout.total}</span>
            <strong>{money(finalTotal)}</strong>
          </div>
        </aside>
      </div>
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <label className="flex flex-col gap-1.5 text-sm">
      <span className="font-medium text-ink-soft">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        type={type}
        required
        maxLength={120}
        className="rounded-lg border border-line bg-surface px-3.5 py-2.5"
      />
    </label>
  );
}
