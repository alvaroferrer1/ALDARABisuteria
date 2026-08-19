"use client";

import { useEffect } from "react";
import { useTranslations } from "@/lib/i18n/localeStore";

/**
 * Sincroniza el <title> de la pestaña con el idioma elegido — límite real
 * documentado del cambio de idioma sin rutas /en /fr (ver localeStore.ts):
 * el <title> inicial lo genera el servidor sin saber el idioma guardado en
 * localStorage, así que un visitante en inglés veía la pestaña del
 * navegador en español pese a que el resto de la interfaz sí cambiaba.
 * Esto corrige lo que el usuario VE en su pestaña; no cambia el <title>
 * que indexan buscadores/redes (ese sigue siendo el server-rendered, en
 * español, correcto para SEO ya que el sitio es primariamente hispano).
 */
export function DocumentTitleSync() {
  const { locale, t } = useTranslations();

  useEffect(() => {
    if (locale === "es") return; // el <title> del servidor ya está en español
    document.title = `${t.home.title1} ${t.home.title2} | ALDARA`;
  }, [locale, t]);

  return null;
}
