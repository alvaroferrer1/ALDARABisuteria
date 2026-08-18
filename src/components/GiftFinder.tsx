"use client";

import { useState } from "react";
import Link from "next/link";
import { PRODUCTS, CATEGORY_LABELS } from "@/lib/products";
import type { ProductCategory } from "@/lib/types";
import { useCart, GIFT_WRAP_PRICE } from "@/context/CartContext";
import { useTranslations } from "@/lib/i18n/localeStore";
import { money } from "@/lib/storage";
import { ProductCard } from "./ProductCard";

/**
 * Wizard de 4 pasos calcado del mockup "Gift Finder" (p.23): ¿Para quién es?
 * (tarjetas con foto) → ¿Qué quieres expresar? → ¿Qué estilo tiene? → ¿Cuál
 * es tu presupuesto? → resultados + envoltorio/dedicatoria. Traducido de
 * verdad ES/EN/FR esta sesión (namespace `giftFinder`) — antes fijo en
 * español pese al selector de idioma (ref. 0.6).
 */
export function GiftFinder() {
  const { t } = useTranslations();
  const [step, setStep] = useState(0);
  const [personaKey, setPersonaKey] = useState("");
  const [occasionKey, setOccasionKey] = useState("");
  const [category, setCategory] = useState<ProductCategory | null>(null);
  const [budget, setBudget] = useState<number | null>(null);
  const { giftWrap, giftMessage, setGiftWrap, setGiftMessage } = useCart();

  // Bug real corregido: las 7 tarjetas de "¿Para quién es?" usaban el mismo
  // icono genérico de persona (cabeza+hombros) cambiando solo el color de
  // fondo — visualmente indistinguibles entre sí, se veían como relleno.
  // Ahora cada destinatario tiene un icono propio con significado real.
  const PERSONAS = [
    { key: "personaMe", label: t.giftFinder.personaMe, hue: "#c96b4a", icon: "sparkle" },
    { key: "personaPartner", label: t.giftFinder.personaPartner, hue: "#8a5a34", icon: "heart" },
    { key: "personaFriend", label: t.giftFinder.personaFriend, hue: "#b98a3f", icon: "star" },
    { key: "personaMom", label: t.giftFinder.personaMom, hue: "#a9663a", icon: "flower" },
    { key: "personaDaughter", label: t.giftFinder.personaDaughter, hue: "#d9ab74", icon: "ribbon" },
    { key: "personaSister", label: t.giftFinder.personaSister, hue: "#7a4526", icon: "leaves" },
    { key: "personaOther", label: t.giftFinder.personaOther, hue: "#c9905f", icon: "gift" },
  ] as const;

  const PERSONA_ICON_PATHS: Record<string, string> = {
    sparkle: "M12 3l1.8 5.4L19 10l-5.2 1.6L12 17l-1.8-5.4L5 10l5.2-1.6L12 3Z",
    heart: "M12 21s-7.5-4.6-10-9.3C.4 8.3 2.1 5 5.6 5c2 0 3.4 1 4.4 2.4C11 6 12.4 5 14.4 5c3.5 0 5.2 3.3 3.6 6.7C19.5 16.4 12 21 12 21Z",
    star: "M12 2l2.6 6.6L21 9.3l-5 4.6 1.5 6.9L12 17.3 6.5 20.8 8 13.9l-5-4.6 6.4-.7L12 2Z",
    flower: "M12 8a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0-6c1.8 0 3 1.8 2 4-1 2-2 2-2 2s-1 0-2-2c-1-2.2.2-4 2-4Zm0 20c-1.8 0-3-1.8-2-4 1-2 2-2 2-2s1 0 2 2c1 2.2-.2 4-2 4ZM2 12c0-1.8 1.8-3 4-2 2 1 2 2 2 2s0 1-2 2c-2.2 1-4-.2-4-2Zm20 0c0 1.8-1.8 3-4 2-2-1-2-2-2-2s0-1 2-2c2.2-1 4 .2 4 2Z",
    ribbon: "M12 2v9m0 0-4 11 4-2.5L16 22l-4-11Zm-5-2a3 3 0 1 0 5-3 3 3 0 0 0-5 3Zm10 0a3 3 0 1 1-5-3 3 3 0 0 1 5 3Z",
    leaves: "M4 20C4 10 10 4 20 4c0 10-6 16-16 16Zm0 0c2-6 6-10 12-12",
    gift: "M20 12v9H4v-9M2 7h20v5H2V7Zm10-5C9 2 7 4 7 6.5S9 11 12 11s5-2 5-4.5S15 2 12 2Zm0 0c3 0 5 2 5 4.5S15 11 12 11",
  };
  const OCCASIONS = [
    { key: "occasionBirthday", label: t.giftFinder.occasionBirthday },
    { key: "occasionAnniversary", label: t.giftFinder.occasionAnniversary },
    { key: "occasionJustBecause", label: t.giftFinder.occasionJustBecause },
    { key: "occasionThanks", label: t.giftFinder.occasionThanks },
    { key: "occasionCelebration", label: t.giftFinder.occasionCelebration },
  ];
  const STYLES: Array<{ label: string; category: ProductCategory; reason: string }> = [
    { label: t.giftFinder.styleDaily, category: "pendientes", reason: t.giftFinder.styleDailyReason },
    { label: t.giftFinder.styleVersatile, category: "pulseras", reason: t.giftFinder.styleVersatileReason },
    { label: t.giftFinder.styleMeaningful, category: "colgantes", reason: t.giftFinder.styleMeaningfulReason },
    { label: t.giftFinder.styleSmall, category: "charms", reason: t.giftFinder.styleSmallReason },
  ];
  const BUDGETS = [
    { label: t.giftFinder.budgetLow, max: 15 },
    { label: t.giftFinder.budgetMid, max: 25 },
    { label: t.giftFinder.budgetUnlimited, max: Infinity },
  ];
  const STEP_LABELS = [t.giftFinder.stepPersona, t.giftFinder.stepOccasion, t.giftFinder.stepStyle, t.giftFinder.stepBudget];

  const persona = PERSONAS.find((p) => p.key === personaKey)?.label ?? "";
  const occasion = OCCASIONS.find((o) => o.key === occasionKey)?.label ?? "";
  const styleReason = STYLES.find((s) => s.category === category)?.reason ?? "";
  const results =
    category !== null && budget !== null
      ? PRODUCTS.filter((p) => p.category === category && p.price <= budget)
          .sort((a, b) => a.price - b.price)
          .slice(0, 6)
      : [];

  const reset = () => {
    setStep(0);
    setPersonaKey("");
    setOccasionKey("");
    setCategory(null);
    setBudget(null);
  };

  if (step === 4) {
    return (
      <div>
        <div className="mb-8 text-center">
          <p className="text-sm text-ink-soft">
            {t.giftFinder.resultsFor} <strong>{persona.toLowerCase()}</strong>, {t.giftFinder.occasionOf}{" "}
            <strong>{occasion.toLowerCase()}</strong>, {t.giftFinder.style}{" "}
            <strong>{CATEGORY_LABELS[category!].toLowerCase()}</strong>...
          </p>
          <h2 className="mt-2 font-display text-2xl font-semibold">{t.giftFinder.weSelected}</h2>
        </div>
        {results.length === 0 ? (
          <p className="text-center text-ink-soft">{t.giftFinder.noResults}</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((p) => (
              <div key={p.id}>
                <ProductCard product={p} />
                <p className="mt-1.5 px-1 text-xs text-ink-soft">{styleReason}</p>
              </div>
            ))}
          </div>
        )}

        {/* Envoltorio de regalo + dedicatoria — calcado del mockup, wireado de
            verdad al carrito/checkout (no es decorativo): se aplica al pedido
            completo cuando lo confirmes. */}
        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          <label className="flex items-start gap-3 rounded-2xl border border-line p-5">
            <input
              type="checkbox"
              checked={giftWrap}
              onChange={(e) => setGiftWrap(e.target.checked)}
              className="mt-1 h-4 w-4 shrink-0 accent-terracotta"
            />
            <span>
              <span className="block font-semibold">{t.giftFinder.addGiftWrap}</span>
              <span className="mt-1 block text-sm text-ink-soft">
                {t.giftFinder.giftWrapNote} {money(GIFT_WRAP_PRICE)}
                {t.giftFinder.giftWrapAppliesAt}
              </span>
            </span>
          </label>
          <label className="flex flex-col gap-2 rounded-2xl border border-line p-5">
            <span className="font-semibold">{t.giftFinder.writeDedication}</span>
            <textarea
              value={giftMessage}
              onChange={(e) => setGiftMessage(e.target.value)}
              maxLength={200}
              rows={2}
              placeholder={t.giftFinder.dedicationPlaceholder}
              className="resize-none rounded-lg border border-line bg-surface px-3 py-2 text-sm"
            />
            <span className="text-right text-xs text-ink-soft">{giftMessage.length}/200</span>
          </label>
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/shop" className="rounded-full bg-ink px-6 py-3 text-sm font-semibold text-ivory">
            {t.giftFinder.viewAllJewelry}
          </Link>
          <button type="button" onClick={reset} className="rounded-full border border-line px-6 py-3 text-sm font-semibold">
            {t.giftFinder.startOver}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8 flex flex-wrap justify-center gap-2">
        {STEP_LABELS.map((label, i) => (
          <span
            key={label}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${
              i === step ? "bg-ink text-ivory" : i < step ? "text-terracotta" : "text-ink-soft"
            }`}
          >
            <span className={`flex h-5 w-5 items-center justify-center rounded-full text-[0.65rem] ${i <= step ? "bg-terracotta text-white" : "bg-surface-2"}`}>
              {i + 1}
            </span>
            <span className="hidden sm:inline">{label}</span>
          </span>
        ))}
      </div>

      {step === 0 && (
        <fieldset>
          <legend className="mb-5 text-center font-display text-xl font-semibold">{t.giftFinder.stepPersona}</legend>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
            {PERSONAS.map((p) => (
              <button
                key={p.key}
                type="button"
                onClick={() => {
                  setPersonaKey(p.key);
                  setStep(1);
                }}
                className="group flex flex-col items-center gap-2"
              >
                <span
                  className="relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-2xl border-2 border-transparent transition-colors group-hover:border-terracotta"
                  style={{ background: `radial-gradient(circle at 35% 30%, ${p.hue}55, ${p.hue}dd)` }}
                >
                  <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full opacity-40" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
                    <filter id={`persona-grain-${p.key}`}>
                      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" result="noise" />
                      <feColorMatrix in="noise" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.08 0" />
                    </filter>
                    <rect width="200" height="200" filter={`url(#persona-grain-${p.key})`} />
                  </svg>
                  <svg viewBox="0 0 24 24" width="32" className="relative text-white/90" aria-hidden="true">
                    <path
                      d={PERSONA_ICON_PATHS[p.icon]}
                      fill={p.icon === "heart" ? "currentColor" : "none"}
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <span className="text-xs font-semibold">{p.label}</span>
              </button>
            ))}
          </div>
        </fieldset>
      )}

      {step === 1 && (
        <fieldset>
          <legend className="mb-5 text-center font-display text-xl font-semibold">{t.giftFinder.stepOccasion}</legend>
          <div className="flex flex-wrap justify-center gap-2.5">
            {OCCASIONS.map((o) => (
              <button
                key={o.key}
                type="button"
                onClick={() => {
                  setOccasionKey(o.key);
                  setStep(2);
                }}
                className="rounded-full border border-line px-5 py-2.5 text-sm font-medium hover:border-ink"
              >
                {o.label}
              </button>
            ))}
          </div>
        </fieldset>
      )}

      {step === 2 && (
        <fieldset>
          <legend className="mb-5 text-center font-display text-xl font-semibold">{t.giftFinder.stepStyle}</legend>
          <div className="flex flex-col gap-2.5">
            {STYLES.map((s) => (
              <button
                key={s.category}
                type="button"
                onClick={() => {
                  setCategory(s.category);
                  setStep(3);
                }}
                className="rounded-xl border border-line px-5 py-3.5 text-left text-sm font-medium hover:border-ink"
              >
                {s.label}
              </button>
            ))}
          </div>
        </fieldset>
      )}

      {step === 3 && (
        <fieldset>
          <legend className="mb-5 text-center font-display text-xl font-semibold">{t.giftFinder.stepBudget}</legend>
          <div className="flex flex-wrap justify-center gap-2.5">
            {BUDGETS.map((b) => (
              <button
                key={b.label}
                type="button"
                onClick={() => {
                  setBudget(b.max);
                  setStep(4);
                }}
                className="rounded-full border border-line px-5 py-2.5 text-sm font-medium hover:border-ink"
              >
                {b.label}
              </button>
            ))}
          </div>
        </fieldset>
      )}
    </div>
  );
}
