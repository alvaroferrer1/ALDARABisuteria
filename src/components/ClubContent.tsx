"use client";

import Link from "next/link";
import { useTranslations } from "@/lib/i18n/localeStore";
import { money } from "@/lib/storage";
import { PhotoSlot } from "@/components/PhotoSlot";
import { getAllCollections } from "@/lib/collections";

interface Tier {
  name: string;
  min: number;
  perkKey: "clubTier1Perk" | "clubTier2Perk" | "clubTier3Perk";
}

const TIERS: Tier[] = [
  { name: "Raíces", min: 0, perkKey: "clubTier1Perk" },
  { name: "Lunar", min: 60, perkKey: "clubTier2Perk" },
  { name: "Luz", min: 150, perkKey: "clubTier3Perk" },
];

// Color real de cada nivel — reutiliza `collection.color` (misma identidad
// de marca que ya existe para las colecciones Raíces/Lunar/Luz) en vez de
// inventar una paleta nueva solo para el Club, para reforzar visualmente
// que los nombres de nivel no son arbitrarios.
function tierColor(name: string) {
  return getAllCollections().find((c) => c.name === name)?.color ?? "var(--terracotta)";
}

function tierFor(spent: number) {
  return [...TIERS].reverse().find((t) => spent >= t.min) ?? TIERS[0];
}

interface ClubMovementView {
  id: string;
  type: string;
  points: number;
  reason: string;
  timestamp: string;
}

export function ClubContent({
  isAuthenticated,
  spent,
  orderCount,
  points,
  movements,
}: {
  isAuthenticated: boolean;
  spent: number;
  orderCount: number;
  points: number;
  movements: ClubMovementView[];
}) {
  const { t } = useTranslations();
  const m = t.misc;
  const tier = tierFor(spent);
  const nextTier = TIERS[TIERS.findIndex((tr) => tr.name === tier.name) + 1];
  const progressPct = nextTier ? Math.min(100, Math.round((spent / nextTier.min) * 100)) : 100;

  return (
    <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <div className="relative mb-8 aspect-21/9 overflow-hidden rounded-3xl">
        <PhotoSlot name="club-hero" alt="" fallback={<div className="absolute inset-0 bg-surface-2" />} />
      </div>
      <p className="mb-3 text-xs font-bold uppercase tracking-widest text-terracotta">{m.clubEyebrow}</p>
      <h1 className="font-display text-4xl font-semibold sm:text-5xl">{m.clubTitle}</h1>
      <p className="mt-4 max-w-lg text-ink-soft">{m.clubSubtitle}</p>

      {!isAuthenticated ? (
        <div className="mt-8 rounded-2xl border border-line p-6">
          <p className="mb-3 text-sm text-ink-soft">{m.clubLoginPrompt}</p>
          <Link href="/account" className="inline-block rounded-full bg-ink px-6 py-2.5 text-sm font-semibold text-ivory">
            {m.clubLoginButton}
          </Link>
        </div>
      ) : (
        <div className="mt-8 rounded-2xl border border-line p-6">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <span className="font-display text-3xl font-semibold">
              {points} {m.clubPts}
            </span>
            <span className="rounded-full bg-surface-2 px-3 py-1 text-xs font-semibold uppercase text-ink-soft">
              {m.clubLevel} {tier.name}
            </span>
          </div>
          <p className="mt-2 text-sm text-ink-soft">
            {orderCount === 0
              ? m.clubNoOrders
              : `${m.clubCalculatedOn} ${orderCount} ${orderCount === 1 ? m.clubOrder : m.clubOrders} (${money(spent)} ${m.clubInTotal}).`}
          </p>

          {nextTier && (
            <div className="mt-4">
              <div className="mb-1.5 flex items-center justify-between text-xs text-ink-soft">
                <span>{tier.name}</span>
                <span>
                  Te faltan {money(Math.max(0, nextTier.min - spent))} para {nextTier.name}
                </span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-line" role="progressbar" aria-valuenow={progressPct} aria-valuemin={0} aria-valuemax={100}>
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{ width: `${progressPct}%`, backgroundColor: tierColor(nextTier.name) }}
                />
              </div>
            </div>
          )}

          <p className="mt-3 text-xs text-ink-soft">{m.clubRedeemHint}</p>
        </div>
      )}

      {isAuthenticated && (
        <div className="mt-6">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-ink-soft">{m.clubMovementsTitle}</h2>
          {movements.length === 0 ? (
            <p className="text-sm text-ink-soft">{m.clubMovementsEmpty}</p>
          ) : (
            <ul className="flex flex-col gap-2">
              {movements.map((mv) => (
                <li key={mv.id} className="flex items-center justify-between rounded-xl border border-line px-4 py-2.5 text-sm">
                  <span className="text-ink-soft">{mv.reason}</span>
                  <span className={`font-semibold ${mv.points >= 0 ? "text-terracotta" : "text-ink-soft"}`}>
                    {mv.points >= 0 ? "+" : ""}
                    {mv.points} {m.clubPts}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* "Cómo funciona" + ejemplo calculado — antes la página pasaba
          directamente del hero a la lista de niveles sin explicar el
          mecanismo con un caso real, gap real detectado al revisar la
          página sin sesión iniciada (donde se nota más vacía). */}
      <h2 className="mt-12 mb-4 text-sm font-semibold uppercase tracking-wide text-ink-soft">{m.clubHowTitle}</h2>
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          [m.clubHowStep1, m.clubHowStep1Sub],
          [m.clubHowStep2, m.clubHowStep2Sub],
          [m.clubHowStep3, m.clubHowStep3Sub],
        ].map(([title, sub], i) => (
          <div key={title} className="rounded-2xl border border-line p-5">
            <span className="mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-surface-2 font-display text-sm font-semibold">{i + 1}</span>
            <p className="font-semibold">{title}</p>
            <p className="mt-1 text-sm text-ink-soft">{sub}</p>
          </div>
        ))}
      </div>
      <div className="mt-4 rounded-2xl bg-surface-2 p-5 text-sm text-ink-soft">
        <span className="font-semibold text-ink">{m.clubExampleTitle}</span> {m.clubExampleText}
      </div>

      <h2 className="mt-12 mb-4 text-sm font-semibold uppercase tracking-wide text-ink-soft">{m.clubLevelsTitle}</h2>
      <ul className="flex flex-col gap-3">
        {TIERS.map((tr) => {
          const isCurrent = isAuthenticated && tr.name === tier.name;
          return (
            <li
              key={tr.name}
              className={`flex items-center justify-between rounded-xl border px-5 py-4 ${isCurrent ? "bg-surface-2" : "border-line"}`}
              style={{ borderLeftColor: tierColor(tr.name), borderLeftWidth: 3, borderColor: isCurrent ? tierColor(tr.name) : undefined }}
            >
              <div>
                <p className="flex items-center gap-2 font-semibold">
                  {tr.name}
                  {isCurrent && (
                    <span className="rounded-full px-2 py-0.5 text-[0.65rem] font-bold uppercase text-white" style={{ backgroundColor: tierColor(tr.name) }}>
                      {m.clubLevel}
                    </span>
                  )}
                </p>
                <p className="text-sm text-ink-soft">{m[tr.perkKey]}</p>
              </div>
              <span className="text-sm text-ink-soft">
                {m.clubFrom} {tr.min} {m.clubPts}
              </span>
            </li>
          );
        })}
      </ul>

      <p className="mt-8 text-xs text-ink-soft">
        {m.clubNoteBefore}{" "}
        <Link href="/faq" className="underline">
          FAQ
        </Link>
        .
      </p>
    </section>
  );
}
