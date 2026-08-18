import type { Metadata } from "next";
import { PRODUCTS } from "@/lib/products";
import { DropsContent } from "@/components/DropsContent";

export const metadata: Metadata = {
  title: "Drops",
  description: "Novedades y piezas limitadas del catálogo real de ALDARA.",
};

export default function DropsPage() {
  const news = PRODUCTS.filter((p) => p.badges?.includes("new"));
  const limited = PRODUCTS.filter((p) => p.badges?.includes("limited"));
  return <DropsContent news={news} limited={limited} />;
}
