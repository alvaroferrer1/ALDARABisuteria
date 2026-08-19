import Link from "next/link";
import type { Metadata } from "next";
import { PRODUCTS, getProductBySlug } from "@/lib/products";
import { LightRoomViewer } from "@/components/LightRoomViewer";
import { LightRoomHero } from "@/components/LightRoomChrome";
import { AddToCartButton } from "@/components/AddToCartButton";
import { ProductPlate } from "@/components/ProductPlate";
import { money } from "@/lib/storage";

export const metadata: Metadata = {
  title: "The Light Room",
  description: "Descubre cómo cambia una pieza ALDARA bajo distintas condiciones de luz — cálida, fría, golden hour, interior, noche y suave.",
};

// Antes solo se podía cambiar de pieza tocando la URL (?producto=slug) a
// mano — sin selector visible, sin enlace a la ficha ni forma de comprar
// desde aquí, gap real: la experiencia terminaba en un callejón sin salida.
const PICKER_PRODUCTS = PRODUCTS.slice(0, 6);

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

      <div className="mt-6 flex flex-col items-center gap-3 text-center">
        <div>
          <Link href={`/producto/${product.slug}`} className="font-semibold hover:text-terracotta">
            {product.name}
          </Link>
          <p className="text-sm text-ink-soft">{money(product.price)}</p>
        </div>
        <AddToCartButton productId={product.id} productName={product.name} variant="full" />
      </div>

      <div className="mt-14">
        <p className="mb-4 text-center text-xs font-bold uppercase tracking-widest text-ink-soft">Probar con otra pieza</p>
        <div className="flex flex-wrap justify-center gap-3">
          {PICKER_PRODUCTS.map((p) => (
            <Link
              key={p.id}
              href={`/light-room?producto=${p.slug}`}
              aria-current={p.id === product.id}
              className={`flex h-16 w-16 items-center justify-center overflow-hidden rounded-xl border-2 ${
                p.id === product.id ? "border-ink" : "border-transparent hover:border-line"
              }`}
            >
              <ProductPlate product={p} className="h-full w-full" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
