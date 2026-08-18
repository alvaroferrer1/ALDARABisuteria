import { Suspense } from "react";
import type { Metadata } from "next";
import { filterProducts, SHOP_MATERIALS, type ShopMaterial } from "@/lib/products";
import type { ProductCategory } from "@/lib/types";
import { ProductCard } from "@/components/ProductCard";
import { CategoryFilters } from "@/components/CategoryFilters";
import { ShopControls } from "@/components/ShopControls";
import { ShopSidebarFilters } from "@/components/ShopSidebarFilters";
import { ShopHero, ShopBreadcrumb, ShopPurposeBanner } from "@/components/ShopHero";

const VALID_CATEGORIES: ProductCategory[] = ["pendientes", "pulseras", "colgantes", "charms"];
const VALID_SORTS = ["price-asc", "price-desc", "name"] as const;

// Copy propio por categoría — calcado en tono de los subtítulos reales de
// cada lámina de categoría del PDF (p.15-18: "lenguaje ALDARA", "significado,
// colección y estilo", "artesanía y cultura", "símbolos e historias").
// Antes /shop?categoria=X reutilizaba siempre el mismo titular genérico —
// gap real detectado en la auditoría visual (referencias 1.4-1.7).
const CATEGORY_COPY: Record<ProductCategory | "todos", { eyebrow: string; title: string; description: string }> = {
  todos: {
    eyebrow: "Catálogo",
    title: "Piezas con identidad",
    description: "Cada pieza está hecha a mano en nuestro taller de Puerto Almenara. Filtra por categoría, material, precio o busca por nombre.",
  },
  pendientes: {
    eyebrow: "Pendientes",
    title: "Detalles que te hacen brillar",
    description: "De los aros de todos los días a los que se notan al moverte — cada par con su propia historia detrás.",
  },
  colgantes: {
    eyebrow: "Colgantes",
    title: "Descubrimiento por significado",
    description: "Piezas que llevan un porqué colgado del cuello: origen, protección, un mapa de casa. Elige por lo que representan, no solo por cómo se ven.",
  },
  pulseras: {
    eyebrow: "Pulseras",
    title: "Artesanía que se lleva puesta",
    description: "Trenzadas, con cuentas o en cadena — conectadas con el mismo trabajo a mano y la misma raíz cultural que todo lo demás.",
  },
  charms: {
    eyebrow: "Charms",
    title: "Símbolos como unidad de personalización",
    description: "Cada charm es una historia pequeña. Combínalos en el Charm Studio o llévalos solos — la pieza la construyes tú.",
  },
};

export async function generateMetadata({ searchParams }: PageProps<"/shop">): Promise<Metadata> {
  const params = await searchParams;
  const categoriaRaw = typeof params.categoria === "string" ? params.categoria : "todos";
  const categoria = VALID_CATEGORIES.includes(categoriaRaw as ProductCategory) ? (categoriaRaw as ProductCategory) : "todos";
  const copy = CATEGORY_COPY[categoria];
  return { title: copy.eyebrow === "Catálogo" ? "Catálogo" : `${copy.eyebrow} — Catálogo`, description: copy.description };
}

export default async function ShopPage({ searchParams }: PageProps<"/shop">) {
  const params = await searchParams;
  const categoriaRaw = typeof params.categoria === "string" ? params.categoria : "todos";
  const categoria = VALID_CATEGORIES.includes(categoriaRaw as ProductCategory) ? (categoriaRaw as ProductCategory) : "todos";
  const search = typeof params.q === "string" ? params.q : "";
  const ordenRaw = typeof params.orden === "string" ? params.orden : "default";
  const orden = (VALID_SORTS as readonly string[]).includes(ordenRaw) ? (ordenRaw as (typeof VALID_SORTS)[number]) : "default";
  const materialsRaw = typeof params.material === "string" ? params.material.split(",") : [];
  const materials = materialsRaw.filter((m): m is ShopMaterial => (SHOP_MATERIALS as readonly string[]).includes(m));
  const maxPrice = typeof params.maxPrice === "string" ? Number(params.maxPrice) : undefined;
  const tints = typeof params.color === "string"
    ? (params.color.split(",").map(Number).filter((n): n is 0 | 1 | 2 => [0, 1, 2].includes(n)))
    : [];

  const products = filterProducts({ category: categoria, search, sort: orden, materials, maxPrice, tints });

  return (
    <>
      <ShopBreadcrumb />
      <ShopHero category={categoria} />

      <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6">
        <CategoryFilters current={categoria} query={search} />
        <Suspense>
          <ShopControls />
        </Suspense>

        <div className="grid gap-10 lg:grid-cols-[200px_1fr]">
          {/* Sidebar de filtros — calcada del mockup (p.14): Material + Precio,
              antes solo existía categoría/búsqueda/orden. En mobile se
              colapsa en un <details> para no ocupar la pantalla entera. */}
          <aside className="lg:pt-1">
            <details className="lg:hidden">
              <summary className="mb-4 cursor-pointer rounded-full border border-line px-4 py-2 text-center text-sm font-semibold">
                Más filtros
              </summary>
              <div className="mb-6">
                <Suspense>
                  <ShopSidebarFilters />
                </Suspense>
              </div>
            </details>
            <div className="hidden lg:block">
              <Suspense>
                <ShopSidebarFilters />
              </Suspense>
            </div>
          </aside>

          <div>
            {products.length === 0 ? (
              <p className="py-16 text-center text-ink-soft">No encontramos piezas con esa búsqueda. Prueba con otra palabra.</p>
            ) : (
              <div className="grid gap-7 sm:grid-cols-2 xl:grid-cols-3">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>

        <ShopPurposeBanner />
      </section>
    </>
  );
}
