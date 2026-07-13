import { createRouteClient } from "@/lib/utils/auth-helpers";
import { parsePaginationParams, toRange, buildPaginationMeta } from "@/lib/utils/pagination";
import type { ProductFilterInput, CreateProductInput, UpdateProductInput } from "@/lib/validators/product.schema";
import type { Product } from "@/types";
import { sanitizeImageUrl } from "@/lib/utils/image-sanitizer";

export function sanitizeProduct(p: any): any {
  if (!p) return p;
  
  if (p.images && Array.isArray(p.images)) {
    p.images = p.images.map((img: any, idx: number) => ({
      ...img,
      url: sanitizeImageUrl(img.url, p.slug || p.name, idx)
    }));
  }
  
  if (p.category) {
    p.category.image_url = sanitizeImageUrl(p.category.image_url, p.category.slug || p.category.name);
  }
  
  if (p.store) {
    p.store.logo_url = sanitizeImageUrl(p.store.logo_url, p.store.name);
    p.store.banner_url = sanitizeImageUrl(p.store.banner_url, p.store.name);
  }
  
  return p;
}

const PRODUCT_SELECT = `
  id, store_id, category_id, name, slug, description, short_description,
  price, min_price, max_price, stock, min_order, unit, weight,
  is_active, is_featured, is_eco_certified, tags, rating, review_count,
  total_sold, co2_saved, waste_diverted, location, province, created_at, updated_at,
  store:seller_profiles(id, name, slug, logo_url, rating, is_verified, city, province),
  category:categories(id, name, slug, icon),
  images:product_images(id, url, alt, sort_order, is_primary)
`;

export async function findProducts(filters: ProductFilterInput) {
  const supabase = await createRouteClient();
  const pagination = parsePaginationParams(
    new URLSearchParams({
      page: String(filters.page),
      per_page: String(filters.per_page),
    })
  );
  const { from, to } = toRange(pagination);

  let query = supabase
    .from("products")
    .select(PRODUCT_SELECT, { count: "exact" })
    .eq("is_active", true)
    .is("deleted_at", null);

  // Full-text search
  if (filters.q) {
    query = query.textSearch("search_vector", filters.q, { type: "websearch" });
  }

  // Category filter (by slug or id)
  if (filters.category) {
    const { data: cat } = await supabase
      .from("categories")
      .select("id")
      .or(`slug.eq.${filters.category},id.eq.${filters.category}`)
      .single();
    if (cat) query = query.eq("category_id", cat.id);
  }

  if (filters.province) query = query.ilike("province", `%${filters.province}%`);
  if (filters.min_price !== undefined) query = query.gte("price", filters.min_price);
  if (filters.max_price !== undefined) query = query.lte("price", filters.max_price);
  if (filters.is_eco_certified !== undefined)
    query = query.eq("is_eco_certified", filters.is_eco_certified);
  if (filters.is_featured !== undefined) query = query.eq("is_featured", filters.is_featured);

  // Sorting
  switch (filters.sort) {
    case "price_asc":
      query = query.order("price", { ascending: true });
      break;
    case "price_desc":
      query = query.order("price", { ascending: false });
      break;
    case "rating":
      query = query.order("rating", { ascending: false });
      break;
    case "popular":
      query = query.order("total_sold", { ascending: false });
      break;
    case "newest":
    default:
      query = query.order("created_at", { ascending: false });
  }

  const { data, count, error } = await query.range(from, to);

  if (error) throw error;

  return {
    data: (data ?? []).map(sanitizeProduct) as unknown as Product[],
    meta: buildPaginationMeta(count ?? 0, pagination),
  };
}

export async function findProductBySlug(slug: string) {
  const supabase = await createRouteClient();

  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("slug", slug)
    .eq("is_active", true)
    .is("deleted_at", null)
    .single();

  if (error) return null;
  return sanitizeProduct(data) as unknown as Product;
}

export async function findProductsByStore(storeId: string, page = 1, per_page = 20) {
  const supabase = await createRouteClient();
  const pagination = parsePaginationParams(
    new URLSearchParams({ page: String(page), per_page: String(per_page) })
  );
  const { from, to } = toRange(pagination);

  const { data, count, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT, { count: "exact" })
    .eq("store_id", storeId)
    .is("deleted_at", null)
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) throw error;
  return { data: (data ?? []).map(sanitizeProduct) as unknown as Product[], meta: buildPaginationMeta(count ?? 0, pagination) };
}

export async function createProduct(storeId: string, input: CreateProductInput) {
  const supabase = await createRouteClient();

  // Auto-generate slug if not provided
  const slug =
    input.slug ??
    input.name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .slice(0, 200);

  const { data, error } = await supabase
    .from("products")
    .insert({ ...input, slug, store_id: storeId })
    .select(PRODUCT_SELECT)
    .single();

  if (error) throw error;
  return sanitizeProduct(data) as unknown as Product;
}

export async function updateProduct(productId: string, input: UpdateProductInput) {
  const supabase = await createRouteClient();

  const { data, error } = await supabase
    .from("products")
    .update(input)
    .eq("id", productId)
    .select(PRODUCT_SELECT)
    .single();

  if (error) throw error;
  return sanitizeProduct(data) as unknown as Product;
}

export async function softDeleteProduct(productId: string) {
  const supabase = await createRouteClient();

  const { error } = await supabase
    .from("products")
    .update({ is_active: false, deleted_at: new Date().toISOString() })
    .eq("id", productId);

  if (error) throw error;
}

export async function getProductOwnerStoreId(productId: string): Promise<string | null> {
  const supabase = await createRouteClient();

  const { data } = await supabase
    .from("products")
    .select("store_id")
    .eq("id", productId)
    .single();

  return data?.store_id ?? null;
}
