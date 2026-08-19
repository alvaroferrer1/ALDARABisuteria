import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // No revela la versión de Next en la cabecera X-Powered-By (higiene de
  // seguridad y unos bytes menos por respuesta).
  poweredByHeader: false,

  // Cabeceras de seguridad — antes no había ninguna configurada, gap real
  // detectado en la revisión de ciberseguridad. No usan servicios de
  // terceros ni cambian nada visual, solo endurecen cómo el navegador trata
  // la respuesta.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          // El sitio no se embebe en iframes ajenos — evita clickjacking.
          { key: "X-Frame-Options", value: "DENY" },
          // El navegador no debe "adivinar" el tipo de un archivo distinto
          // al declarado (mitiga ataques de MIME-sniffing).
          { key: "X-Content-Type-Options", value: "nosniff" },
          // No se manda la URL completa de origen a sitios externos al
          // seguir un enlace saliente, solo el origen.
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // Desactiva APIs sensibles del navegador que este sitio no usa.
          { key: "Permissions-Policy", value: "camera=(self), microphone=(), geolocation=(), payment=()" },
          // CSP ajustada a lo que el sitio realmente carga: todo self-hosted
          // (fuentes vía next/font, sin CDN externo, sin analítica de
          // terceros). 'unsafe-inline' en script/style es necesario porque
          // el sitio usa <script> de inicialización de tema + JSON-LD y
          // estilos inline dinámicos (color de colección/producto) en
          // decenas de componentes — migrar a nonces sería un cambio mucho
          // más invasivo sin beneficio real para una demo de un solo origen.
          {
            key: "Content-Security-Policy",
            value:
              "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self' data:; connect-src 'self'; media-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
