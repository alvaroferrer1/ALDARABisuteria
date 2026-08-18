"use client";

import { useTranslations } from "@/lib/i18n/localeStore";

export function ExposicionesBadge() {
  const { t } = useTranslations();
  return (
    <span className="absolute left-4 top-4 rounded-full bg-black/50 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-white sm:left-8 sm:top-8">
      {t.bloque8.exposicionesBadge}
    </span>
  );
}
