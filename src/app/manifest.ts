import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ALDARA — Bisutería que une culturas",
    short_name: "ALDARA",
    description: "Bisutería artesanal hecha a mano en Puerto Almenara, con raíces en Venezuela y Colombia.",
    start_url: "/",
    display: "standalone",
    background_color: "#faf5ec",
    theme_color: "#241c15",
    icons: [
      { src: "/favicon.ico", sizes: "any", type: "image/x-icon" },
      { src: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
