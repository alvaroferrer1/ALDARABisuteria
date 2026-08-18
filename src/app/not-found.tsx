import Link from "next/link";
import { getAllProducts } from "@/lib/products";
import { ProductPlate } from "@/components/ProductPlate";
import { NewsletterInlineForm } from "@/components/NewsletterInlineForm";
import { PhotoSlot } from "@/components/PhotoSlot";

const EXPLORE_LINKS = [
  { href: "/colecciones", label: "Colecciones", icon: "M8 3h8l-1.5 6a2.5 2.5 0 1 1-5 0Z" },
  { href: "/personaliza", label: "Personalizadas", icon: "M12 4a4 4 0 0 1 4 4c0 3-4 8-4 8s-4-5-4-8a4 4 0 0 1 4-4Z" },
  { href: "/regalos", label: "Buscador de regalos", icon: "M20 12v9H4v-9M2 7h20v5H2V7Zm10-5C9 2 7 4 7 6.5S9 11 12 11s5-2 5-4.5S15 2 12 2Z" },
  { href: "/shop", label: "Buscar", icon: "M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14Zm10 17-5.6-5.6" },
  { href: "/drops", label: "Novedades", icon: "M12 2 3 7v6c0 5 4 8 9 9 5-1 9-4 9-9V7l-9-5Z" },
];

export default function NotFound() {
  // Producto de "consuelo" mostrado en el 404, calcado de la p.44 del PDF
  // (imagen de una joya real sobre fondo oscuro junto al 404). Determinista
  // (no random) para que el build sea reproducible.
  const comfortProduct = getAllProducts()[0];

  return (
    <>
      <section className="grid gap-10 border-b border-line px-4 py-16 sm:px-6 md:grid-cols-2 md:items-center md:gap-6 md:py-24">
        <div className="order-2 text-center md:order-1 md:text-left">
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-terracotta">Error 404</p>
          <h1 className="font-display text-7xl font-semibold sm:text-8xl">404</h1>
          <p className="mt-2 font-display text-xl">Esta joya no se encuentra por hoy, sigue mirando</p>
          <p className="mt-4 max-w-sm text-ink-soft md:mx-0 mx-auto">
            A veces, los caminos más bonitos no estaban planeados. Esta página no existe, pero seguro que encuentras algo que te hará sonreír.
          </p>
          <Link href="/" className="mt-8 inline-block rounded-full bg-ink px-7 py-3.5 font-semibold text-ivory hover:-translate-y-0.5 transition-transform">
            Volver al inicio →
          </Link>

          {comfortProduct && (
            <div className="mt-10 border-t border-line pt-6 md:mx-0 mx-auto max-w-xs">
              <p className="mb-3 text-xs font-bold uppercase tracking-widest text-ink-soft">Únete a la familia ALDARA</p>
              <p className="mb-3 text-sm text-ink-soft">Recibe primero las novedades y colecciones nuevas.</p>
              <NewsletterInlineForm />
            </div>
          )}
        </div>
        {comfortProduct && (
          <Link href={`/producto/${comfortProduct.slug}`} className="relative order-1 aspect-square overflow-hidden rounded-2xl md:order-2">
            <PhotoSlot name="error-404" alt="" fallback={<ProductPlate product={comfortProduct} className="aspect-square rounded-2xl" />} />
          </Link>
        )}
      </section>

      <section className="border-t border-line bg-surface-2 px-4 py-14 text-center sm:px-6">
        <p className="mb-8 font-display text-2xl font-semibold">
          Sigue explorando — hay muchas <em className="not-italic text-terracotta">historias</em> por descubrir
        </p>
        <div className="mx-auto flex max-w-3xl flex-wrap justify-center gap-x-10 gap-y-6">
          {EXPLORE_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="group flex flex-col items-center gap-2">
              <svg viewBox="0 0 24 24" width="26" height="26" className="text-terracotta" aria-hidden="true">
                <path d={link.icon} fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="text-sm font-semibold group-hover:text-terracotta">{link.label}</span>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
