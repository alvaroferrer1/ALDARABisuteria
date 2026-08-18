import type { Metadata } from "next";
import { ARCHIVE } from "@/lib/archive";
import { ArchivoContent } from "@/components/ArchivoContent";

export const metadata: Metadata = {
  title: "Archivo",
  description: "Memoria de colecciones y campañas de ALDARA, año a año.",
};

// Archivo (Bloque 8, #92) — los años/hitos son reales (mismos que
// `/nosotros`); las campañas asociadas son DATOS DEMO explícitos (`lib/archive.ts`).
export default function ArchivoPage() {
  return <ArchivoContent years={ARCHIVE} />;
}
