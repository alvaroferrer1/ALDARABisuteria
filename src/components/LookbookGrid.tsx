"use client";

import { useState } from "react";
import Link from "next/link";
import type { Look, LookCategory } from "@/lib/looks";
import type { Collection } from "@/lib/collections";
import { Reveal } from "./Reveal";
import { PhotoSlot } from "./PhotoSlot";

const TABS: Array<{ key: LookCategory | "todos"; label: string }> = [
  { key: "todos", label: "Todos" },
  { key: "diarios", label: "Diarios" },
  { key: "ocasion", label: "Ocasión" },
  { key: "verano", label: "Verano" },
  { key: "capas", label: "Capas" },
];

/**
 * Tabs de categoría del Lookbook — calcado del mockup (p.21, "23. LOOKBOOK":
 * Todos/Diarios/Ocasión/Verano/Capas). Antes se habían omitido porque con
 * solo 3 looks reales no parecían aportar filtrado útil — decisión revisada:
 * la fidelidad al PDF manda, así que aquí están, categorizando honestamente
 * los looks reales que existen (ver lib/looks.ts). "Capas" no tiene ningún
 * look todavía (ninguno de los 3 apila varias piezas en la misma zona) —
 * se muestra un estado vacío elegante en vez de forzar una categoría falsa
 * o esconder la pestaña.
 */
export function LookbookGrid({ looks, collections }: { looks: Look[]; collections: Collection[] }) {
  const [active, setActive] = useState<(typeof TABS)[number]["key"]>("todos");
  const filtered = active === "todos" ? looks : looks.filter((l) => l.categories.includes(active));

  return (
    <>
      <div className="mb-10 flex flex-wrap justify-center gap-2">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActive(tab.key)}
            aria-pressed={active === tab.key}
            className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
              active === tab.key ? "border-ink bg-ink text-ivory" : "border-line hover:border-ink"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-line px-6 py-16 text-center">
          <p className="font-display text-lg font-semibold">Todavía no hay looks en esta categoría</p>
          <p className="mx-auto mt-2 max-w-sm text-sm text-ink-soft">
            Estamos preparando nuevas escenas. Mientras tanto, explora el resto del Lookbook.
          </p>
          <button
            type="button"
            onClick={() => setActive("todos")}
            className="mt-5 inline-block rounded-full bg-ink px-6 py-2.5 text-sm font-semibold text-ivory"
          >
            Ver todos los looks
          </button>
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-3">
          {filtered.map((l, i) => {
            const accent = collections.find((c) => c.name === l.mood)?.color ?? "var(--terracotta)";
            return (
              <Reveal key={l.slug} delayMs={i * 100}>
                <Link
                  href={`/lookbook/${l.slug}`}
                  className="group block overflow-hidden rounded-3xl border border-line transition-transform hover:-translate-y-1.5"
                >
                  <div
                    className="relative flex aspect-3/4 items-center justify-center overflow-hidden"
                    style={{ background: `radial-gradient(120% 90% at 50% 0%, color-mix(in srgb, ${accent} 22%, var(--surface)) 0%, var(--surface-2) 75%)` }}
                  >
                    <span
                      className="motion-safe:animate-[aldara-drift_10s_ease-in-out_infinite] absolute -right-10 -top-6 h-40 w-40 rounded-full opacity-30 blur-2xl transition-opacity group-hover:opacity-50"
                      style={{ background: accent }}
                      aria-hidden="true"
                    />
                    <PhotoSlot
                      name={`lookbook-${l.slug}`}
                      alt={l.title}
                      fallback={
                        <svg viewBox="0 0 300 400" width="55%" className="relative mx-auto" aria-hidden="true">
                          <path
                            d="M150 40c-30 0-45 25-45 55 0 20 8 35 8 35s-38 20-45 60c-8 45 0 150 0 150h164s8-105 0-150c-7-40-45-60-45-60s8-15 8-35c0-30-15-55-45-55Z"
                            fill="none"
                            stroke={accent}
                            strokeWidth="1.5"
                            opacity="0.5"
                          />
                        </svg>
                      }
                    />
                  </div>
                  <div className="p-5">
                    <span className="text-xs font-bold uppercase" style={{ color: accent }}>
                      {l.mood}
                    </span>
                    <h2 className="font-display text-lg font-semibold">{l.title}</h2>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      )}
    </>
  );
}
