import type { Metadata } from "next";
import { HelpContent } from "@/components/HelpContent";

export const metadata: Metadata = {
  title: "Centro de ayuda",
  description: "Todo lo que necesitas sobre pedidos, envíos, devoluciones, producto y tu cuenta, en un solo sitio.",
};

export default function HelpPage() {
  return <HelpContent />;
}
