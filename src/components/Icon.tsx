/**
 * Sistema de iconos centralizado (Bloque 0, ref. 0.5) — antes cada
 * componente definía su propio `<svg><path d="..."/></svg>` ad-hoc,
 * coherentes en estilo pero sin una fuente única. Este registro centraliza
 * los iconos de "chrome" que aparecen en todas las páginas (header, footer,
 * wishlist, chat) bajo un mismo componente con tokens fijos: `viewBox`
 * 24x24, `stroke-width` 1.5-2 según trazo, `currentColor` para heredar
 * color de texto/tema (light/dark ya resuelto por CSS, sin lógica extra
 * aquí), y tamaño vía prop `size`. Los iconos decorativos muy específicos
 * de una sola composición (p.ej. los símbolos de categoría del mega menú,
 * los iconos generativos de producto) siguen viviendo junto a su
 * componente porque son ilustrativos, no de interfaz — este registro cubre
 * los de INTERFAZ reutilizados en todo el sitio.
 */
export type IconName = "search" | "heart" | "heart-filled" | "cart" | "close" | "whatsapp" | "instagram" | "check";

const PATHS: Record<IconName, { path: string; fill?: "currentColor" | "none"; strokeWidth?: number; strokeless?: boolean }> = {
  search: { path: "M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14Zm10 17-5.6-5.6", fill: "none", strokeWidth: 2 },
  heart: {
    path: "M12 21s-7.5-4.6-10-9.3C.4 8.3 2.1 5 5.6 5c2 0 3.4 1 4.4 2.4C11 6 12.4 5 14.4 5c3.5 0 5.2 3.3 3.6 6.7C19.5 16.4 12 21 12 21Z",
    fill: "none",
    strokeWidth: 1.5,
  },
  "heart-filled": {
    path: "M12 21s-7.5-4.6-10-9.3C.4 8.3 2.1 5 5.6 5c2 0 3.4 1 4.4 2.4C11 6 12.4 5 14.4 5c3.5 0 5.2 3.3 3.6 6.7C19.5 16.4 12 21 12 21Z",
    fill: "currentColor",
    strokeless: true,
  },
  cart: {
    path: "M7 4h-2l-1 2v1h2l3.6 7.59-1.35 2.44c-.16.28-.25.61-.25.97 0 1.1.9 2 2 2h12v-2h-11.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1h-14.19l-.94-2z",
    fill: "currentColor",
    strokeless: true,
  },
  close: { path: "M6 6l12 12M18 6 6 18", fill: "none", strokeWidth: 2 },
  check: { path: "M5 12.5 9.5 17 19 7", fill: "none", strokeWidth: 2 },
  whatsapp: {
    path: "M20.5 3.5a11.8 11.8 0 0 0-16.7 16.6L2 22l2-1.7A11.8 11.8 0 1 0 20.5 3.5ZM12 20.2a8.2 8.2 0 0 1-4.2-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8.3 8.3 0 1 1 12 20.2Zm4.5-6.2c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1s-.6.8-.8 1c-.1.2-.3.2-.5.1a6.6 6.6 0 0 1-3.3-2.9c-.2-.4.2-.4.6-1.2.1-.1 0-.3 0-.4l-.7-1.6c-.2-.4-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2c0 1.3 1 2.6 1.1 2.8.1.2 2 3 4.8 4.2.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2-.1-.1-.2-.2-.4-.3Z",
    fill: "currentColor",
    strokeless: true,
  },
  instagram: {
    path: "M12 2c2.7 0 3.06.01 4.12.06 1.06.05 1.79.22 2.43.47.66.26 1.22.6 1.77 1.15.55.55.9 1.11 1.15 1.77.25.64.42 1.37.47 2.43.05 1.06.06 1.42.06 4.12s-.01 3.06-.06 4.12c-.05 1.06-.22 1.79-.47 2.43a4.9 4.9 0 0 1-1.15 1.77 4.9 4.9 0 0 1-1.77 1.15c-.64.25-1.37.42-2.43.47-1.06.05-1.42.06-4.12.06s-3.06-.01-4.12-.06c-1.06-.05-1.79-.22-2.43-.47a4.9 4.9 0 0 1-1.77-1.15 4.9 4.9 0 0 1-1.15-1.77c-.25-.64-.42-1.37-.47-2.43C2.01 15.06 2 14.7 2 12s.01-3.06.06-4.12c.05-1.06.22-1.79.47-2.43.26-.66.6-1.22 1.15-1.77a4.9 4.9 0 0 1 1.77-1.15c.64-.25 1.37-.42 2.43-.47C8.94 2.01 9.3 2 12 2Zm0 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10Zm0 8.2a3.2 3.2 0 1 1 0-6.4 3.2 3.2 0 0 1 0 6.4Zm5.2-8.4a1.2 1.2 0 1 0 0-2.4 1.2 1.2 0 0 0 0 2.4Z",
    fill: "currentColor",
    strokeless: true,
  },
};

export function Icon({
  name,
  size = 18,
  className = "",
  filled,
}: {
  name: IconName;
  size?: number;
  className?: string;
  /** Fuerza relleno/contorno (p.ej. corazón de wishlist activo/inactivo) sin necesitar un nombre distinto. */
  filled?: boolean;
}) {
  const spec = PATHS[name];
  const isFilled = filled ?? spec.fill === "currentColor";
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} aria-hidden="true">
      <path
        d={spec.path}
        fill={isFilled ? "currentColor" : "none"}
        stroke={spec.strokeless ? "none" : "currentColor"}
        strokeWidth={spec.strokeWidth ?? 1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
