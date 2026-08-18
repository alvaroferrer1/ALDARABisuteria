export interface RepairStage {
  key: "recibida" | "diagnostico" | "en_taller" | "lista";
  label: string;
}

export const REPAIR_STAGES: RepairStage[] = [
  { key: "recibida", label: "Solicitud recibida" },
  { key: "diagnostico", label: "En diagnóstico" },
  { key: "en_taller", label: "En el taller" },
  { key: "lista", label: "Lista para recoger/enviar" },
];

/**
 * DEMO_SIMULATED — igual que lib/orderTracking.ts: sin integración real
 * con el taller, el estado se calcula de forma determinista a partir de
 * `requestedAt` (dato real de la solicitud), con el disclaimer siempre
 * visible en la UI. No es un estado inventado por reparación ni aleatorio.
 */
export function getSimulatedRepairStageIndex(requestedAt: string): number {
  const daysSince = (Date.now() - new Date(requestedAt).getTime()) / (1000 * 60 * 60 * 24);
  if (daysSince < 1) return 0; // recibida
  if (daysSince < 3) return 1; // diagnostico
  if (daysSince < 8) return 2; // en_taller
  return 3; // lista
}
