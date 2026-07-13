import { createRouteClient } from "@/lib/utils/auth-helpers";
import { findProducts } from "@/lib/repositories/product.repository";
import { findArticles } from "@/lib/repositories/education.repository";

export interface RecommendationEngineResult {
  similar_products: any[];
  frequently_viewed_together: any[];
  recommended_learning: any[];
  suggested_categories: any[];
}

/**
 * Layanan Mesin Rekomendasi AI (AI Recommendation Engine)
 * Menyarankan produk, konten edukasi, dan kategori kelapa berdasarkan riwayat browsing dan kesukaan pengguna
 */
export async function getPersonalizedRecommendations(
  userId?: string,
  productId?: string,
  limit = 4
): Promise<RecommendationEngineResult> {
  const supabase = await createRouteClient();

  // Preferensi bawaan jika pengguna belum login
  let preferredCategories: string[] = [];

  if (userId) {
    // 1. Dapatkan kategori produk kelapa yang sering dibeli atau dilihat oleh pengguna dari statistik/history
    const { data: profile } = await supabase
      .from("profiles")
      .select("id")
      .eq("user_id", userId)
      .single();

    if (profile) {
      // Dapatkan data wishlist untuk melihat pola kategori produk
      const { data: wishlist } = await supabase
        .from("wishlists")
        .select("product:products(category_id, categories(slug))")
        .eq("user_id", profile.id)
        .limit(5);

      if (wishlist && wishlist.length > 0) {
        preferredCategories = wishlist
          .map((w: any) => w.product?.categories?.slug)
          .filter(Boolean);
      }
    }
  }

  // Fallback kategori jika kosong
  if (preferredCategories.length === 0) {
    preferredCategories = ["minyak-kelapa", "arang-briket", "sabut-cocofiber"];
  }

  // 2. Fetch produk sejenis (Similar Products) jika productId disediakan
  let similarProducts: any[] = [];
  if (productId) {
    const { data: sourceProduct } = await supabase
      .from("products")
      .select("category_id, categories(slug)")
      .eq("id", productId)
      .single() as any;

    if (sourceProduct) {
      const { data: matching } = await findProducts({
        category: Array.isArray(sourceProduct.categories) 
          ? sourceProduct.categories[0]?.slug 
          : sourceProduct.categories?.slug,
        page: 1,
        per_page: limit + 1,
        sort: "newest"
      });

      // Filter agar tidak merekomendasikan produk itu sendiri
      similarProducts = (matching ?? []).filter((p) => p.id !== productId).slice(0, limit);
    }
  }

  // Jika tidak ada produk pembanding, gunakan produk berperingkat tertinggi dari kategori kesukaan
  if (similarProducts.length === 0) {
    const { data: matching } = await findProducts({
      category: preferredCategories[0],
      page: 1,
      per_page: limit,
      sort: "rating" as any,
    });
    similarProducts = matching ?? [];
  }

  // 3. Sering Dilihat Bersama (Frequently Viewed Together)
  // Ambil produk acak berperingkat tinggi atau terpopuler dari kategori aktif lainnya
  const { data: popular } = await findProducts({
    page: 1,
    per_page: limit,
    sort: "popular" as any,
  });

  // 4. Rekomendasi Edukasi (Recommended Learning Materials)
  // Tampilkan artikel edukasi tentang kelapa yang paling relevan dengan minat produk belanja
  const articleCategoryMap: Record<string, string> = {
    "minyak-kelapa": "coconut_products",
    "sabut-cocofiber": "farming_tips",
    "arang-briket": "circular_economy",
  };

  const eduCategory = articleCategoryMap[preferredCategories[0]] || "coconut_products";
  const { data: articles } = await findArticles({
    category: eduCategory as any,
    page: 1,
    per_page: limit,
  });

  // 5. Rekomendasi Kategori Kelapa
  const { data: categories } = await supabase
    .from("categories")
    .select("id, name, slug, icon, product_count")
    .eq("is_active", true)
    .order("product_count", { ascending: false })
    .limit(limit);

  return {
    similar_products: similarProducts,
    frequently_viewed_together: popular ?? [],
    recommended_learning: articles ?? [],
    suggested_categories: categories ?? [],
  };
}
