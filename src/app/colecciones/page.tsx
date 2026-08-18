import type { Metadata } from "next";
import { getAllCollections } from "@/lib/collections";
import { ColeccionesContent } from "@/components/ColeccionesContent";

export const metadata: Metadata = {
  title: "Colecciones",
  description:
    "Descubre las colecciones ALDARA: Raíces, Lunar, Origen, Alma, Tierra y Luz. Cada una con su propia identidad, dentro del mismo universo ALDARA.",
};

export default function CollectionsIndexPage() {
  const collections = getAllCollections();
  return <ColeccionesContent collections={collections} />;
}
