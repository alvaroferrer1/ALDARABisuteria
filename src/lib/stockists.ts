/**
 * Puerto Almenara es la única ubicación real confirmada de ALDARA (taller +
 * mercadillos). Las demás "próximas ubicaciones" son marcadores DEMO
 * explícitos (no direcciones reales) para poder construir la composición
 * completa del mockup (Bloque 8, #88 Tiendas/Stockists) sin inventar
 * tiendas públicas que no existen.
 */
export interface Stockist {
  city: string;
  detail: string;
  isReal: boolean;
  isDemo?: true;
}

export const STOCKISTS: Stockist[] = [
  { city: "Puerto Almenara", detail: "Taller y venta en mercadillos de artesanía locales", isReal: true },
  { city: "Próxima ubicación (demo)", detail: "Todavía sin confirmar — marcador de ejemplo para la maqueta", isReal: false, isDemo: true },
  { city: "Próxima ubicación (demo)", detail: "Todavía sin confirmar — marcador de ejemplo para la maqueta", isReal: false, isDemo: true },
];
