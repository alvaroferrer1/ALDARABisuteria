import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // No revela la versión de Next en la cabecera X-Powered-By (higiene de
  // seguridad y unos bytes menos por respuesta).
  poweredByHeader: false,
};

export default nextConfig;
