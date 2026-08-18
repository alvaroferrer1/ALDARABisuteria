"use client";

import Link from "next/link";
import { useSavedLooks } from "@/lib/savedLooks";
import { getAllLooks } from "@/lib/looks";
import { getAllCollections } from "@/lib/collections";
import { PhotoSlot } from "./PhotoSlot";

/**
 * Conecta el Joyero Digital con los looks realmente guardados por el
 * usuario (`useSavedLooks`, localStorage — ver LookScene.tsx). No es una
 * sección decorativa: si no hay looks guardados, lo dice y enlaza a explorar.
 */
export function SavedLooksSection() {
  const { saved } = useSavedLooks();
  const looks = getAllLooks().filter((l) => saved.includes(l.slug));
  const collections = getAllCollections();

  return (
    <div>
      <h2 className="mb-4 font-semibold">Looks guardados {looks.length > 0 && `(${looks.length})`}</h2>
      {looks.length === 0 ? (
        <div className="overflow-hidden rounded-2xl bg-surface-2 text-center">
          <div className="relative aspect-21/9">
            <PhotoSlot name="looks-guardados-empty" alt="" fallback={<div className="absolute inset-0 bg-surface-3" />} />
          </div>
          <div className="p-6">
            <p className="text-sm text-ink-soft">Todavía no has guardado ningún look.</p>
            <Link href="/lookbook" className="mt-3 inline-block text-sm font-semibold text-terracotta hover:underline">
              Explorar el Lookbook →
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {looks.map((l) => {
            const accent = collections.find((c) => c.name === l.mood)?.color ?? "var(--terracotta)";
            return (
              <Link
                key={l.slug}
                href={`/lookbook/${l.slug}`}
                className="rounded-2xl border border-line p-4 hover:-translate-y-0.5 transition-transform"
                style={{ borderLeftColor: accent, borderLeftWidth: 3 }}
              >
                <p className="text-xs font-bold uppercase tracking-wide" style={{ color: accent }}>
                  {l.mood}
                </p>
                <p className="font-display text-lg font-semibold">{l.title}</p>
                <p className="mt-1 text-xs text-ink-soft">{l.hotspots.length} piezas</p>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
