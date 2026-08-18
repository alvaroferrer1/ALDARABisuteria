"use client";

import { useLocale, setLocale } from "@/lib/i18n/localeStore";
import { LOCALES, type Locale } from "@/lib/i18n/locales";

const LABELS: Record<Locale, string> = { es: "Español", en: "English", fr: "Français" };

/**
 * Selector de idioma real para "Mis preferencias" — antes la página decía
 * literalmente "Español por defecto. EN/FR próximamente" a pesar de que el
 * sitio ya tiene ES/EN/FR reales navegables (`lib/i18n`) — afirmación falsa
 * detectada y corregida en la auditoría visual (ref. 7.1).
 */
export function LanguagePreferenceSwitcher() {
  const locale = useLocale();
  return (
    <div className="flex gap-2">
      {LOCALES.map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => setLocale(l)}
          aria-current={locale === l}
          className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
            locale === l ? "bg-ink text-ivory" : "bg-surface-2 text-ink-soft hover:text-ink"
          }`}
        >
          {LABELS[l]}
        </button>
      ))}
    </div>
  );
}
