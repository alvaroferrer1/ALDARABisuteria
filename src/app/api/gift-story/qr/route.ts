import { NextResponse } from "next/server";
import QRCode from "qrcode";

/**
 * Genera un QR SVG real (librería `qrcode`, mantenida, sin llamadas a
 * servicios externos) que codifica una URL propia del sitio. Solo acepta
 * URLs que apunten a rutas concretas y conocidas (historia de regalo o
 * pasaporte digital de una pieza) de este mismo origen, para no convertir
 * el endpoint en un generador de QR genérico.
 */
const ALLOWED_PATH_PATTERNS = [/^\/gift-story\/[A-Za-z0-9_-]+$/, /^\/account\/passports\/[A-Za-z0-9_-]+$/];

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const target = searchParams.get("url") || "";

  let parsed: URL;
  try {
    parsed = new URL(target);
  } catch {
    return NextResponse.json({ error: "URL inválida." }, { status: 400 });
  }

  const sameOrigin = parsed.origin === origin;
  const isAllowedPath = ALLOWED_PATH_PATTERNS.some((re) => re.test(parsed.pathname));
  if (!sameOrigin || !isAllowedPath) {
    return NextResponse.json({ error: "Solo se generan QR para rutas conocidas de este sitio." }, { status: 400 });
  }

  const svg = await QRCode.toString(parsed.toString(), {
    type: "svg",
    margin: 1,
    color: { dark: "#161009", light: "#00000000" },
  });

  return new NextResponse(svg, {
    headers: { "Content-Type": "image/svg+xml", "Cache-Control": "no-store" },
  });
}
