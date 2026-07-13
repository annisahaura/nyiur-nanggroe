import {
  findProducts,
  findProductBySlug,
  findProductsByStore,
  createProduct,
  updateProduct,
  softDeleteProduct,
  getProductOwnerStoreId,
} from "@/lib/repositories/product.repository";
import { createRouteClient } from "@/lib/utils/auth-helpers";
import type { ProductFilterInput, CreateProductInput, UpdateProductInput } from "@/lib/validators/product.schema";

export { findProducts as searchProducts, findProductsByStore };

export async function getProductDetail(slug: string) {
  const product = await findProductBySlug(slug);
  if (!product) return null;

  // Fetch reviews alongside
  const supabase = await createRouteClient();
  const { data: reviews } = await supabase
    .from("reviews")
    .select(`
      id, rating, comment, is_verified_purchase, helpful_count, created_at,
      review_images(url),
      profile:profiles(full_name, avatar_url)
    `)
    .eq("product_id", product.id)
    .order("created_at", { ascending: false })
    .limit(10);

  return { ...product, reviews: reviews ?? [] };
}

export async function createSellerProduct(sellerId: string, storeId: string, input: CreateProductInput) {
  // Verify seller owns the store
  const supabase = await createRouteClient();
  const { data: store } = await supabase
    .from("seller_profiles")
    .select("id")
    .eq("id", storeId)
    .eq("owner_id", sellerId)
    .single();

  if (!store) throw new Error("STORE_NOT_FOUND");

  return createProduct(storeId, input);
}

export async function updateSellerProduct(
  productId: string,
  profileId: string,
  input: UpdateProductInput
) {
  const storeId = await getProductOwnerStoreId(productId);
  if (!storeId) throw new Error("PRODUCT_NOT_FOUND");

  // Verify ownership
  const supabase = await createRouteClient();
  const { data: store } = await supabase
    .from("seller_profiles")
    .select("id")
    .eq("id", storeId)
    .eq("owner_id", profileId)
    .single();

  if (!store) throw new Error("FORBIDDEN");

  return updateProduct(productId, input);
}

export async function deleteSellerProduct(productId: string, profileId: string) {
  const storeId = await getProductOwnerStoreId(productId);
  if (!storeId) throw new Error("PRODUCT_NOT_FOUND");

  const supabase = await createRouteClient();
  const { data: store } = await supabase
    .from("seller_profiles")
    .select("id")
    .eq("id", storeId)
    .eq("owner_id", profileId)
    .single();

  if (!store) throw new Error("FORBIDDEN");

  await softDeleteProduct(productId);
}
