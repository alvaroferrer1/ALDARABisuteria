"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useTranslations } from "@/lib/i18n/localeStore";

export interface FaqGroup {
  title: string;
  items: Array<{ q: string; a: string }>;
}

// "Explora por categorías" — calcado del mockup de FAQ (p.37, panel
// "02-FAQ/Ayuda": 6 iconos Pedidos y pagos/Envíos/Devoluciones/Productos/
// Cuidados/Reparaciones). Antes la página iba directa del buscador a las
// preguntas, sin esta fila — gap real detectado en comparación directa
// PDF↔LIVE. 3 categorías anclan a un grupo real de esta misma página;
// Devoluciones/Cuidados/Reparaciones enlazan a su página real en vez de
// duplicar contenido que ya vive en /aftercare, /cuidados, /reparaciones.
const CATEGORY_ICONS: Array<{ label: string; path: string; href: string }> = [
  { label: "Pedidos y pagos", path: "M3 10h18M6 15h4M3 6h18v12H3V6Z", href: "#group-pedidos-y-pagos" },
  { label: "Envíos", path: "M2 7h20v5H2V7Zm0 5h13v5H2v-5Zm13 0h2l3 3v2h-5v-5Z", href: "#group-envios" },
  { label: "Devoluciones", path: "M4 4h16v4H4V4Zm0 8h16v8H4v-8Zm4 3h4", href: "/aftercare" },
  { label: "Productos", path: "M12 21s-7.5-4.6-10-9.3C.4 8.3 2.1 5 5.6 5c2 0 3.4 1 4.4 2.4C11 6 12.4 5 14.4 5c3.5 0 5.2 3.3 3.6 6.7C19.5 16.4 12 21 12 21Z", href: "#group-producto-y-materiales" },
  { label: "Cuidados", path: "M12 2c4 5 7 8.5 7 12a7 7 0 1 1-14 0c0-3.5 3-7 7-12Z", href: "/cuidados" },
  { label: "Reparaciones", path: "M14 4l6 6-8 8H6v-6l8-8Z", href: "/reparaciones" },
];

function slugifyGroupTitle(title: string) {
  return `group-${title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")}`;
}

export function FaqList({ groups }: { groups: FaqGroup[] }) {
  const { t } = useTranslations();
  const [query, setQuery] = useState("");
  // Voto "¿te ha sido útil?" por pregunta — señal barata de qué contenido
  // falta (POST_AUDIT_IMPROVEMENTS.md, bloque Y). Solo estado de sesión, no
  // hace falta persistirlo para que sea una señal real.
  const [voted, setVoted] = useState<Record<string, "yes" | "no">>({});

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return groups;
    return groups
      .map((g) => ({ ...g, items: g.items.filter((i) => i.q.toLowerCase().includes(q) || i.a.toLowerCase().includes(q)) }))
      .filter((g) => g.items.length > 0);
  }, [groups, query]);

  return (
    <div>
      <div className="mx-auto mb-8 grid max-w-xl grid-cols-3 gap-3 sm:grid-cols-6">
        {CATEGORY_ICONS.map((cat) => (
          <Link
            key={cat.label}
            href={cat.href}
            className="flex flex-col items-center gap-1.5 rounded-xl border border-line px-2 py-3 text-center hover:border-ink"
          >
            <svg viewBox="0 0 24 24" width="20" className="text-terracotta" aria-hidden="true">
              <path d={cat.path} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="text-[0.7rem] font-semibold leading-tight">{cat.label}</span>
          </Link>
        ))}
      </div>

      <div className="mx-auto mb-10 flex max-w-md items-center gap-2 rounded-full border border-line bg-surface px-4 py-2.5">
        <svg viewBox="0 0 24 24" width="16" aria-hidden="true">
          <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="2" />
          <path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t.faq.searchPlaceholder}
          aria-label={t.faq.searchPlaceholder}
          maxLength={60}
          className="w-full border-none bg-transparent text-sm outline-none"
        />
      </div>

      {filtered.length === 0 ? (
        <p className="text-center text-ink-soft">{t.faq.noResults}</p>
      ) : (
        filtered.map((group) => (
          <div key={group.title} className="mb-10">
            <h2 id={slugifyGroupTitle(group.title)} className="mb-4 scroll-mt-24 font-display text-xl font-semibold">
              {group.title}
            </h2>
            <div className="flex flex-col gap-3">
              {group.items.map((item) => (
                <details key={item.q} className="group rounded-xl border border-line bg-surface px-5 open:pb-1">
                  <summary className="flex cursor-pointer list-none items-center justify-between py-4 font-semibold">
                    {item.q}
                    <span className="text-terracotta transition-transform group-open:rotate-45">+</span>
                  </summary>
                  <p className="pb-3 text-sm text-ink-soft">{item.a}</p>
                  <div className="flex items-center gap-2 pb-4 text-xs text-ink-soft">
                    {voted[item.q] ? (
                      <span>Gracias por tu respuesta.</span>
                    ) : (
                      <>
                        <span>¿Te ha sido útil?</span>
                        <button type="button" onClick={() => setVoted((v) => ({ ...v, [item.q]: "yes" }))} className="rounded-full border border-line px-2.5 py-1 font-semibold hover:border-terracotta">
                          Sí
                        </button>
                        <button type="button" onClick={() => setVoted((v) => ({ ...v, [item.q]: "no" }))} className="rounded-full border border-line px-2.5 py-1 font-semibold hover:border-terracotta">
                          No
                        </button>
                      </>
                    )}
                  </div>
                </details>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
