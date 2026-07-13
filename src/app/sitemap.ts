import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://nyiurnanggroe.id";

  // Static routes
  const routes = [
    "",
    "/produk",
    "/edukasi",
    "/edukasi/artikel",
    "/edukasi/kuis",
    "/dampak",
    "/daftar-mitra",
    "/syarat-ketentuan",
    "/privasi",
  ];

  const staticSitemaps = routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "daily" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));

  return [...staticSitemaps];
}
