import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/account", "/cart", "/checkout", "/api/"] },
    ],
    sitemap: "https://www.aldara.store/sitemap.xml",
  };
}
