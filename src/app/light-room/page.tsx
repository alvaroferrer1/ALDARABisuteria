import type { Metadata } from "next";
import { PRODUCTS, getProductBySlug } from "@/lib/products";
import { LightRoomViewer } from "@/components/LightRoomViewer";
import { LightRoomHero } from "@/components/LightRoomChrome";
import { money } from "@/lib/storage";

export const metadata: Metadata = {
  title: "The Light Room",
  description: "Descubre cómo cambia una pieza ALDARA bajo distintas condiciones de luz — cálida, fría, golden hour, interior, noche y suave.",
};

export default async function LightRoomPage({ searchParams }: PageProps<"/light-room">) {
  const params = await searchParams;
  const slug = typeof params.producto === "string" ? params.producto : undefined;
  const product = (slug && getProductBySlug(slug)) || PRODUCTS.find((p) => p.id === "p9") || PRODUCTS[0];

  return (
    <section className="mx-auto max-w-3xl px-4 py-24 sm:px-6">
      <LightRoomHero />

      <div className="mt-10">
        <LightRoomViewer product={product} />
      </div>

      <div className="mt-6 text-center">
        <p className="font-semibold">{product.name}</p>
        <p className="text-sm text-ink-soft">{money(product.price)}</p>
      </div>
    </section>
  );
}
