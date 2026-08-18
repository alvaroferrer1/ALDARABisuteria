import { PRODUCTS } from "./products";

/**
 * DEMO / FIXTURE — Ediciones limitadas (Bloque 8, #85). Los productos son
 * reales del catálogo; el tamaño de tirada ("XX/50") y las unidades
 * restantes son datos demo, ya que ALDARA no lleva todavía un control de
 * series numeradas real. Marcado como tal en la propia UI.
 */
export interface LimitedEdition {
  productId: string;
  editionSize: number;
  claimed: number;
  story: string;
  isDemo: true;
}

export const LIMITED_EDITIONS: LimitedEdition[] = [
  { productId: "p8", editionSize: 50, claimed: 50, story: "Cada piedra de ámbar es única — por eso esta tirada es irrepetible.", isDemo: true },
  { productId: "p6", editionSize: 40, claimed: 27, story: "El tricolor grabado a mano, pieza a pieza, en tandas pequeñas.", isDemo: true },
  { productId: "p11", editionSize: 30, claimed: 12, story: "Un charm que solo hacemos por encargo en pequeñas series.", isDemo: true },
];

export function getLimitedEditionsWithProducts() {
  return LIMITED_EDITIONS.map((le) => ({ ...le, product: PRODUCTS.find((p) => p.id === le.productId)! })).filter((le) => le.product);
}

export type LimitedEditionWithProduct = ReturnType<typeof getLimitedEditionsWithProducts>[number];
