"use client";

import { useState } from "react";
import type { Mood } from "@/lib/moods";
import type { Product } from "@/lib/types";
import { ProductCard } from "./ProductCard";
import { Reveal } from "./Reveal";
import { PhotoSlot } from "./PhotoSlot";

/**
 * Única interacción: elegir una sensación, no ajustar filtros. El cambio de
 * mood tiñe el fondo entero de la sección (color-mix sobre --surface) y
 * cambia la línea sensorial + la curación — nunca un checkbox de categoría.
 */
export function MoodShopClient({ moods, productsByMood }: { moods: Mood[]; productsByMood: Record<string, Product[]> }) {
  const [active, setActive] = useState(moods[0]?.slug ?? "");
  const mood = moods.find((m) => m.slug === active) ?? moods[0];
  const products = productsByMood[active] ?? [];

  return (
    <div>
      <div className="mx-auto mb-12 flex max-w-2xl flex-wrap justify-center gap-3">
        {moods.map((m) => (
          <button
            key={m.slug}
            type="button"
            onClick={() => setActive(m.slug)}
            aria-pressed={active === m.slug}
            className={`rounded-full border px-5 py-2.5 text-sm font-semibold transition-colors ${
              active === m.slug ? "border-transparent text-ivory" : "border-line text-ink-soft hover:border-ink"
            }`}
            style={active === m.slug ? { backgroundColor: m.color } : undefined}
          >
            {m.name}
          </button>
        ))}
      </div>

      {mood && (
        <div
          className="rounded-3xl px-4 py-12 transition-colors duration-500 sm:px-10"
          style={{ backgroundColor: `color-mix(in srgb, ${mood.color} 10%, var(--surface))` }}
        >
          <Reveal key={mood.slug} className="mx-auto mb-10 max-w-xl text-center">
            <div className="relative mx-auto mb-6 aspect-21/9 max-w-md overflow-hidden rounded-2xl">
              <PhotoSlot name={`mood-${mood.slug}`} alt="" fallback={<div className="absolute inset-0" style={{ backgroundColor: mood.color, opacity: 0.15 }} />} />
            </div>
            <p className="mb-2 font-display text-2xl italic" style={{ color: mood.color }}>
              {mood.sensoryLine}
            </p>
            <p className="text-ink-soft">{mood.description}</p>
          </Reveal>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((p, i) => (
              <Reveal key={p.id} delayMs={i * 80}>
                <ProductCard product={p} />
              </Reveal>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
