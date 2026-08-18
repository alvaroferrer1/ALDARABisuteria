import type { Metadata } from "next";
import { CharmStudioBuilder } from "@/components/CharmStudioBuilder";
import { CharmStudioHero } from "@/components/CharmStudioHero";

export const metadata: Metadata = {
  title: "Charms Studio",
  description: "Elige una cadena base real y arrastra hasta 4 charms del catálogo ALDARA para componer tu pieza.",
};

export default function CharmsStudioPage() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <CharmStudioHero />
      <CharmStudioBuilder />
    </section>
  );
}
