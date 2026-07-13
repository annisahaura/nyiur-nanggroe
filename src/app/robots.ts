import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://nyiurnanggroe.id";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/akun/",
        "/mitra/",
        "/admin/",
        "/checkout/",
        "/keranjang/",
        "/pesanan/",
        "/wishlist/",
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
