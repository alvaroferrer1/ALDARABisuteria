"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { useSearchOverlayOpen, closeSearch } from "@/lib/searchOverlayStore";
import { searchSite } from "@/lib/searchIndex";
import { useTranslations } from "@/lib/i18n/localeStore";
import { searchHistoryStore, recordSearch, clearSearchHistory } from "@/lib/searchHistoryStore";
import { PhotoSlot } from "@/components/PhotoSlot";

const TYPE_COLOR: Record<string, string> = {
  producto: "var(--gold)",
  colección: "var(--terracotta)",
  journal: "var(--blue)",
  "the edit": "var(--gold-light)",
};

/**
 * Buscador global real: filtra en memoria contra el catálogo y el
 * contenido editorial (ver lib/searchIndex.ts), con navegación por teclado
 * (flechas + Enter + Escape) y overlay a pantalla completa en mobile.
 *
 * El wrapper solo monta `SearchOverlayPanel` cuando `open` es true — así el
 * estado local (query/activeIndex) parte siempre limpio en cada apertura
 * por el propio ciclo de montaje de React, sin necesitar un efecto que
 * llame a setState para "resetear" (evita el anti-patrón set-state-in-effect).
 */
export function SearchOverlay() {
  const open = useSearchOverlayOpen();
  if (!open) return null;
  return <SearchOverlayPanel />;
}

function SearchOverlayPanel() {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { t } = useTranslations();
  const history = useSyncExternalStore(searchHistoryStore.subscribe, searchHistoryStore.getSnapshot, searchHistoryStore.getServerSnapshot);

  const results = useMemo(() => searchSite(query), [query]);

  function goTo(href: string, savedQuery: string) {
    recordSearch(savedQuery);
    closeSearch();
    router.push(href);
  }

  useEffect(() => {
    // Foco inicial — efecto legítimo (sincroniza con el DOM, no hace
    // setState de React), no cae bajo la regla set-state-in-effect.
    const t = window.setTimeout(() => inputRef.current?.focus(), 30);
    return () => window.clearTimeout(t);
  }, []);

  function handleQueryChange(value: string) {
    setQuery(value);
    setActiveIndex(0);
  }

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        closeSearch();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, results.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter") {
        const target = results[activeIndex];
        if (target) goTo(target.href, query);
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [results, activeIndex, router, query]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black/50 backdrop-blur-sm sm:items-center sm:justify-center sm:p-6" role="dialog" aria-modal="true" aria-label="Buscar en ALDARA">
      <button type="button" aria-label="Cerrar búsqueda" className="absolute inset-0" onClick={closeSearch} />
      <div className="relative z-10 flex h-full w-full flex-col overflow-hidden bg-surface sm:h-auto sm:max-h-[80vh] sm:max-w-xl sm:rounded-2xl sm:shadow-2xl">
        <div className="flex items-center gap-3 border-b border-line p-4">
          <svg viewBox="0 0 24 24" width="20" className="shrink-0 text-ink-soft" aria-hidden="true">
            <path d="M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14Zm10 17-5.6-5.6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            placeholder={t.search.placeholder}
            className="flex-1 bg-transparent text-base outline-none placeholder:text-ink-soft"
            aria-label={t.header.search}
          />
          <button type="button" onClick={closeSearch} className="shrink-0 text-sm text-ink-soft hover:text-terracotta">
            {t.common.close}
          </button>
        </div>

        {/* Anuncio para lectores de pantalla del número de resultados tras
            cada búsqueda — antes solo había confirmación visual. */}
        <p className="sr-only" role="status" aria-live="polite">
          {query.trim() !== "" && `${results.length} ${results.length === 1 ? "resultado" : "resultados"} para "${query}"`}
        </p>

        <div className="flex-1 overflow-y-auto p-2">
          {query.trim() === "" ? (
            history.length > 0 ? (
              <div className="p-3">
                <div className="mb-1 flex items-center justify-between px-1">
                  <p className="text-xs font-semibold uppercase tracking-wide text-ink-soft">Búsquedas recientes</p>
                  <button type="button" onClick={clearSearchHistory} className="text-xs font-semibold text-terracotta hover:underline">
                    Borrar historial
                  </button>
                </div>
                <ul>
                  {history.map((q) => (
                    <li key={q}>
                      <button type="button" onClick={() => handleQueryChange(q)} className="flex w-full items-center gap-2 rounded-xl p-2.5 text-left text-sm hover:bg-surface-2">
                        <svg viewBox="0 0 24 24" width="15" className="shrink-0 text-ink-soft" aria-hidden="true">
                          <path d="M12 6v6l4 2M12 21a9 9 0 1 1 9-9" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                        {q}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="p-6 text-center text-sm text-ink-soft">{t.search.empty}</p>
            )
          ) : results.length === 0 ? (
            <div className="p-6 text-center">
              <div className="relative mx-auto mb-4 aspect-video max-w-56 overflow-hidden rounded-2xl">
                <PhotoSlot name="busqueda-vacia" alt="" fallback={<div className="absolute inset-0 bg-surface-2" />} />
              </div>
              <p className="text-sm text-ink-soft">{t.search.noResults}</p>
            </div>
          ) : (
            <ul>
              {results.map((r, i) => (
                <li key={r.href}>
                  <a
                    href={r.href}
                    onClick={(e) => {
                      e.preventDefault();
                      goTo(r.href, query);
                    }}
                    onMouseEnter={() => setActiveIndex(i)}
                    className={`flex items-center gap-3 rounded-xl p-3 ${i === activeIndex ? "bg-surface-2" : ""}`}
                  >
                    <span
                      className="shrink-0 rounded-full px-2 py-0.5 text-[0.65rem] font-bold uppercase tracking-wide text-white"
                      style={{ backgroundColor: TYPE_COLOR[r.type] ?? "var(--terracotta)" }}
                    >
                      {r.type}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-medium">{r.title}</span>
                      <span className="block truncate text-xs text-ink-soft">{r.subtitle}</span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
