/**
 * DEMO / FIXTURE — Archivo ALDARA (Bloque 8, #92). Los años y el hito
 * principal de cada año son reales (mismos hechos que "Nuestra historia",
 * `/nosotros`); las "campañas"/"editoriales" asociadas son contenido demo
 * marcado como tal, ya que no existe todavía un archivo de campañas real.
 */
export interface ArchiveYear {
  year: string;
  milestone: string;
  campaigns: Array<{ title: string; description: string; productIds: string[]; isDemo: true }>;
}

export const ARCHIVE: ArchiveYear[] = [
  {
    year: "2023",
    milestone: "La primera pulsera — el inicio de ALDARA",
    campaigns: [
      { title: "Campaña demo: Primeras piezas", description: "Las primeras pulseras VZLA, hechas en la mesa de la cocina.", productIds: ["p4"], isDemo: true },
    ],
  },
  {
    year: "2024",
    milestone: "Primer mercadillo de artesanía en Puerto Almenara",
    campaigns: [
      { title: "Campaña demo: Feria de Puerto Almenara", description: "Editorial demo del primer puesto físico de ALDARA.", productIds: ["p1", "p12"], isDemo: true },
    ],
  },
  {
    year: "2025",
    milestone: "Nace @aldara.bisuteria en redes",
    campaigns: [
      { title: "Campaña demo: Raíces", description: "Editorial demo centrada en la colección Raíces.", productIds: ["p1", "p4"], isDemo: true },
      { title: "Campaña demo: Lunar", description: "Editorial demo de la colección Lunar, piedras y noches de lago.", productIds: ["p2", "p3"], isDemo: true },
    ],
  },
  {
    year: "2026",
    milestone: "Lanzamiento de la tienda online",
    campaigns: [
      { title: "Campaña demo: Nueva etapa", description: "Editorial demo del lanzamiento digital de ALDARA.", productIds: ["p9", "p7"], isDemo: true },
    ],
  },
];
