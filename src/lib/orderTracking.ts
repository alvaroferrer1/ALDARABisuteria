export interface TrackingStage {
  key: "recibido" | "preparando" | "enviado" | "entregado";
  label: string;
}

export const TRACKING_STAGES: TrackingStage[] = [
  { key: "recibido", label: "Recibido" },
  { key: "preparando", label: "En preparación" },
  { key: "enviado", label: "Enviado" },
  { key: "entregado", label: "Entregado" },
];

/**
 * DEMO_SIMULATED — no hay integración real con transportista. El estado
 * mostrado se calcula de forma determinista a partir de `createdAt` (dato
 * real del pedido), no es aleatorio ni inventado por pedido, pero tampoco
 * refleja logística real. Se muestra siempre con el disclaimer explícito
 * en la UI. El campo `status` guardado en `orders.json` sigue siendo
 * siempre "recibido" (el único valor real que el sistema escribe).
 */
export function getSimulatedStageIndex(createdAt: string): number {
  const hoursSince = (Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60);
  if (hoursSince < 12) return 0; // recibido
  if (hoursSince < 36) return 1; // preparando
  if (hoursSince < 96) return 2; // enviado
  return 3; // entregado
}
