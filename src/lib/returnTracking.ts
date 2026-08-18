export interface ReturnStage {
  key: "solicitada" | "revision" | "aprobada" | "reembolsada";
  label: string;
}

export const RETURN_STAGES: ReturnStage[] = [
  { key: "solicitada", label: "Solicitud recibida" },
  { key: "revision", label: "En revisión" },
  { key: "aprobada", label: "Devolución aprobada" },
  { key: "reembolsada", label: "Reembolso procesado" },
];

/**
 * DEMO_SIMULATED — mismo patrón que lib/orderTracking.ts y
 * lib/repairTracking.ts: sin integración real con el proceso de logística
 * inversa, el estado se calcula de forma determinista a partir de
 * `requestedAt` (dato real de la solicitud), con el disclaimer siempre
 * visible en la UI.
 */
export function getSimulatedReturnStageIndex(requestedAt: string): number {
  const daysSince = (Date.now() - new Date(requestedAt).getTime()) / (1000 * 60 * 60 * 24);
  if (daysSince < 1) return 0; // solicitada
  if (daysSince < 3) return 1; // revision
  if (daysSince < 6) return 2; // aprobada
  return 3; // reembolsada
}
