import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Nyiur Nanggroe — Circular Economy Kelapa",
    short_name: "Nyiur Nanggroe",
    description: "Marketplace AI dan Edukasi untuk Ekonomi Sirkular Kelapa Aceh",
    start_url: "/",
    display: "standalone",
    background_color: "#FAF7F0",
    theme_color: "#6B7C3D",
    icons: [
      {
        src: "/favicon-32x32.png",
        sizes: "32x32",
        type: "image/png",
      },
      {
        src: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
