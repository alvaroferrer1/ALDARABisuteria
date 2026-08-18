"use client";

import Link from "next/link";
import { useTranslations } from "@/lib/i18n/localeStore";
import { money } from "@/lib/storage";

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

  return (
    <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
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

      <h2 className="mt-12 mb-4 text-sm font-semibold uppercase tracking-wide text-ink-soft">{m.clubLevelsTitle}</h2>
      <ul className="flex flex-col gap-3">
        {TIERS.map((tr) => (
          <li key={tr.name} className="flex items-center justify-between rounded-xl border border-line px-5 py-4">
            <div>
              <p className="font-semibold">{tr.name}</p>
              <p className="text-sm text-ink-soft">{m[tr.perkKey]}</p>
            </div>
            <span className="text-sm text-ink-soft">
              {m.clubFrom} {tr.min} {m.clubPts}
            </span>
          </li>
        ))}
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
