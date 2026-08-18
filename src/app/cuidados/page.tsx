import type { Metadata } from "next";
import { CuidadosContent } from "@/components/CuidadosContent";

export const metadata: Metadata = {
  title: "Cuidados",
  description: "Cómo cuidar tu bisutería ALDARA para que el baño de oro, las piedras y las perlas duren mucho más tiempo.",
};

export default function CuidadosPage() {
  return <CuidadosContent />;
}
