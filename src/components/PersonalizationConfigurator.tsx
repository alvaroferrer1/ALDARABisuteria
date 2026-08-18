"use client";

import { useState } from "react";
import { PRODUCTS } from "@/lib/products";
import { useCart } from "@/context/CartContext";
import { useTranslations } from "@/lib/i18n/localeStore";
import { money } from "@/lib/storage";
import { ProductVisual } from "./ProductVisual";
import { ProductLightField, useProductPhotoAvailable } from "./ProductPlate";

/**
 * Configurador en vivo — calcado del mockup "Personalización" (p.25): tabs
 * por tipo, vista previa grande, panel derecho con grabado/materiales/charm
 * opcional y total en vivo. Antes /personaliza era solo un agregador de
 * enlaces (Charm Studio/Style Lab) sin configurador propio — gap real
 * detectado en la auditoría visual (ref. 3.3).
 *
 * Comparación directa PDF↔LIVE de esta pasada: el mockup tiene 5 tabs
 * (Iniciales/Nombres/Fechas/Símbolos/Charms), aquí había 3 — añadidas
 * "Fechas" (mismo mecanismo real de grabado que Nombres, sobre la misma
 * pieza real) y "Charms" (charm real como base + charms reales como
 * añadido, mismo catálogo que ya usa Charm Studio).
 *
 * Excepción consciente documentada (dato falso de confianza): el mockup
 * muestra 3 niveles de material (Plata/Oro vermeil/Oro macizo) con recargos
 * y un selector de "largo de cadena" — el catálogo real de ALDARA NO tiene
 * esas variantes como SKUs reales, así que añadir esos selectores sería
 * inventar opciones de producto que no existen y no se podrían cumplir. Se
 * mantiene el material real único de cada pieza, sin inventar recargos.
 */
const TYPES = [
  { key: "iniciales", label: "Iniciales", productId: "p12", placeholder: "A, M, R…" },
  { key: "nombres", label: "Nombres", productId: "p4", placeholder: "Mamá, Valentina…" },
  { key: "fechas", label: "Fechas", productId: "p4", placeholder: "13.05.2021" },
  { key: "simbolos", label: "Símbolos", productId: "p9", placeholder: "Un símbolo con significado" },
  { key: "charms", label: "Charms", productId: "p11", placeholder: "" },
] as const;

const CHARM_ADDONS = ["p10", "p11"];

export function PersonalizationConfigurator() {
  const [typeKey, setTypeKey] = useState<(typeof TYPES)[number]["key"]>("iniciales");
  const [engraving, setEngraving] = useState("");
  const [charmId, setCharmId] = useState<string | null>(null);
  const { addItem, personalizationNote, setPersonalizationNote } = useCart();
  const [justAdded, setJustAdded] = useState(false);
  const { t: i18n } = useTranslations();

  const type = TYPES.find((t) => t.key === typeKey)!;
  const product = PRODUCTS.find((p) => p.id === type.productId)!;
  const charm = charmId ? PRODUCTS.find((p) => p.id === charmId) : undefined;
  const total = product.price + (charm?.price ?? 0);
  const photoAvailable = useProductPhotoAvailable(product);

  function handleAdd() {
    addItem(product.id);
    if (charm) addItem(charm.id);
    const note = engraving.trim() ? `${type.label}: "${engraving.trim()}" en ${product.name}` : `Personalización de ${product.name}`;
    setPersonalizationNote(personalizationNote ? `${personalizationNote}; ${note}` : note);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2500);
  }

  return (
    <div className="grid gap-8 rounded-3xl border border-line p-4 sm:p-8 lg:grid-cols-[1fr_1fr_320px]">
      {/* Tabs por tipo */}
      <div className="lg:col-span-3 flex flex-wrap gap-2">
        {TYPES.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => {
              setTypeKey(t.key);
              setCharmId(null);
            }}
            className={`rounded-full border px-4 py-2 text-sm font-semibold ${
              t.key === typeKey ? "border-ink bg-ink text-ivory" : "border-line hover:border-ink"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Vista previa */}
      <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-2xl bg-surface-2 lg:col-span-2">
        <ProductLightField product={product} hue={0} />
        {!photoAvailable && (
          <div className="relative drop-shadow-[0_8px_18px_rgba(0,0,0,0.14)]">
            <ProductVisual product={product} size={190} />
          </div>
        )}
        {engraving.trim() && (
          <span className="absolute bottom-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-ink shadow">
            &ldquo;{engraving.trim()}&rdquo;
          </span>
        )}
      </div>

      {/* Panel de configuración */}
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-terracotta">Personaliza tu joya</p>
        <h3 className="mt-1 font-display text-2xl font-semibold">{product.name}</h3>
        <p className="mt-1 text-sm text-ink-soft">{product.description}</p>

        <label className="mt-5 flex flex-col gap-1.5 text-sm">
          <span className="font-medium">¿Qué quieres grabar?</span>
          <input
            value={engraving}
            onChange={(e) => setEngraving(e.target.value.slice(0, 24))}
            placeholder={type.placeholder || "A, Mamá, 13.05.2021…"}
            maxLength={24}
            className="rounded-lg border border-line bg-surface px-3.5 py-2.5"
          />
        </label>

        <div className="mt-5">
          <p className="text-sm font-medium">Material</p>
          <p className="mt-1 text-sm text-ink-soft">{product.materials}</p>
        </div>

        <div className="mt-5">
          <p className="text-sm font-medium">Añade un charm (opcional)</p>
          <div className="mt-2 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setCharmId(null)}
              className={`rounded-full border px-3.5 py-2 text-xs font-semibold ${!charmId ? "border-ink bg-ink text-ivory" : "border-line"}`}
            >
              Ninguno
            </button>
            {CHARM_ADDONS.filter((id) => id !== product.id).map((id) => {
              const c = PRODUCTS.find((p) => p.id === id)!;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setCharmId(id)}
                  className={`rounded-full border px-3.5 py-2 text-xs font-semibold ${charmId === id ? "border-ink bg-ink text-ivory" : "border-line"}`}
                >
                  {c.name} (+{money(c.price)})
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between border-t border-line pt-4">
          <span className="text-sm text-ink-soft">Total</span>
          <strong className="font-display text-xl">{money(total)}</strong>
        </div>
        <button
          type="button"
          onClick={handleAdd}
          className="mt-4 w-full rounded-full bg-ink px-6 py-3.5 font-semibold text-ivory transition-transform hover:-translate-y-0.5"
        >
          {justAdded ? i18n.common.added : i18n.common.addToCart}
        </button>
        <p className="mt-2 text-xs text-ink-soft">
          Precio real del catálogo — sin recargos inventados. Tu grabado queda registrado como nota del pedido.
        </p>
      </div>
    </div>
  );
}
