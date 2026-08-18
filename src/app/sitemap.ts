import type { MetadataRoute } from "next";
import { getAllProducts } from "@/lib/products";
import { getAllCollections } from "@/lib/collections";
import { getAllLooks } from "@/lib/looks";
import { getAllPosts } from "@/lib/journal";
import { getAllEdits } from "@/lib/edits";

const BASE_URL = "https://www.aldara.store";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE_URL}/shop`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/colecciones`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/regalos`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/nosotros`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/materiales`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/cuidados`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/faq`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/contacto`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/lookbook`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/journal`, changeFrequency: "weekly", priority: 0.6 },
    { url: `${BASE_URL}/club`, changeFrequency: "monthly", priority: 0.4 },
    { url: `${BASE_URL}/drops`, changeFrequency: "weekly", priority: 0.5 },
    { url: `${BASE_URL}/help`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/style-lab/ear-stack`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/atelier`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/edit`, changeFrequency: "weekly", priority: 0.6 },
    { url: `${BASE_URL}/mood-shop`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/shop-the-moment`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/aftercare`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/gift-cards`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/accesibilidad`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE_URL}/concierge`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/visual-search`, changeFrequency: "monthly", priority: 0.4 },
    { url: `${BASE_URL}/charms-studio`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/personaliza`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/gift-story/create`, changeFrequency: "monthly", priority: 0.4 },
  ];

  const productRoutes: MetadataRoute.Sitemap = getAllProducts().map((p) => ({
    url: `${BASE_URL}/producto/${p.slug}`,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const collectionRoutes: MetadataRoute.Sitemap = getAllCollections().map((c) => ({
    url: `${BASE_URL}/colecciones/${c.slug}`,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const lookRoutes: MetadataRoute.Sitemap = getAllLooks().map((l) => ({
    url: `${BASE_URL}/lookbook/${l.slug}`,
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  const journalRoutes: MetadataRoute.Sitemap = getAllPosts().map((p) => ({
    url: `${BASE_URL}/journal/${p.slug}`,
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  const editRoutes: MetadataRoute.Sitemap = getAllEdits().map((e) => ({
    url: `${BASE_URL}/edit/${e.slug}`,
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  return [...staticRoutes, ...productRoutes, ...collectionRoutes, ...lookRoutes, ...journalRoutes, ...editRoutes];
}
