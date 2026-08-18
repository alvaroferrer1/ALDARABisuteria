import type { Metadata } from "next";
import { getAllProducts } from "@/lib/products";
import { STORE_ADDRESS } from "@/lib/whatsapp";
import { ContactContent } from "@/components/ContactContent";

export const metadata: Metadata = {
  title: "Contacto",
  description: `Contacta con ALDARA: WhatsApp, email o formulario. Tienda en ${STORE_ADDRESS}.`,
};

// Calcado de la p.37 del PDF de propuesta ("01 · Contacto"): hero con pieza,
// franja de 4 confianzas, "¿Por qué contactarnos?" + formulario + canales
// directos (WhatsApp / email / tienda física), y banner final de WhatsApp.
export default function ContactoPage() {
  const heroProduct = getAllProducts()[1];
  return <ContactContent heroProduct={heroProduct} />;
}
