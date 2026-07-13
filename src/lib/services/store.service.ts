import {
  createSellerProfile,
  getSellerProfileBySlug,
  getSellerStatistics,
} from "@/lib/repositories/user.repository";
import { findProductsByStore } from "@/lib/repositories/product.repository";
import { createRouteClient } from "@/lib/utils/auth-helpers";
import type { CreateSellerInput } from "@/lib/validators/auth.schema";

export async function getStoreDetail(slug: string, page = 1, per_page = 12) {
  const store = await getSellerProfileBySlug(slug);
  if (!store) return null;

  const productsData = await findProductsByStore(store.id, page, per_page);

  return {
    store,
    products: productsData.data,
    meta: productsData.meta,
  };
}

export async function registerSeller(profileId: string, input: CreateSellerInput) {
  return createSellerProfile(profileId, input);
}

export async function getSellerDashboardOverview(storeId: string) {
  const stats = await getSellerStatistics(storeId);
  const supabase = await createRouteClient();

  // Fetch low stock alerts (less than 5 units)
  const { data: lowStockProducts } = await supabase
    .from("products")
    .select("id, name, stock, slug")
    .eq("store_id", storeId)
    .is("deleted_at", null)
    .lt("stock", 5)
    .order("stock", { ascending: true });

  // Fetch top selling products (sorted by total_sold)
  const { data: topProducts } = await supabase
    .from("products")
    .select("id, name, slug, price, total_sold, rating")
    .eq("store_id", storeId)
    .is("deleted_at", null)
    .order("total_sold", { ascending: false })
    .limit(5);

  // Fetch recent orders
  const { data: recentOrders } = await supabase
    .from("orders")
    .select("id, order_number, total, status, created_at, buyer_id")
    .eq("store_id", storeId)
    .order("created_at", { ascending: false })
    .limit(5);

  return {
    statistics: stats ?? {
      total_revenue: 0,
      total_orders: 0,
      completed_orders: 0,
      cancelled_orders: 0,
      total_customers: 0,
      avg_rating: 0,
      total_reviews: 0,
      monthly_revenue: {},
      monthly_orders: {},
    },
    lowStockAlerts: lowStockProducts ?? [],
    topProducts: topProducts ?? [],
    recentOrders: recentOrders ?? [],
  };
}

export async function updateStoreProfile(
  storeId: string,
  ownerId: string,
  input: Partial<CreateSellerInput> & { logo_url?: string; banner_url?: string }
) {
  const supabase = await createRouteClient();

  // Validate owner
  const { data: store, error: checkError } = await supabase
    .from("seller_profiles")
    .select("id")
    .eq("id", storeId)
    .eq("owner_id", ownerId)
    .single();

  if (checkError || !store) throw new Error("FORBIDDEN");

  const { data, error } = await supabase
    .from("seller_profiles")
    .update(input)
    .eq("id", storeId)
    .select("*")
    .single();

  if (error) throw error;
  return data;
}
