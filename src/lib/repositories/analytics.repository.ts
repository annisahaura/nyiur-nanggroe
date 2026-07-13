import { createRouteClient } from "@/lib/utils/auth-helpers";

// ============================================================
// REPOSITORI ANALITIK
// Data grafik dan time-series untuk dashboard penjual
// ============================================================

// ============================================================
// PENDAPATAN BULANAN (TIME-SERIES)
// ============================================================

export async function getMonthlyRevenue(
  storeId: string,
  months = 6
): Promise<{ month: string; revenue: number; orders: number }[]> {
  const supabase = await createRouteClient();

  const since = new Date();
  since.setMonth(since.getMonth() - months);

  const { data, error } = await supabase
    .from("orders")
    .select("total, created_at, status")
    .eq("store_id", storeId)
    .eq("payment_status", "paid")
    .in("status", ["delivered", "processing", "shipped"])
    .gte("created_at", since.toISOString())
    .order("created_at", { ascending: true });

  if (error) throw error;

  // Kelompokkan berdasarkan bulan
  const grouped: Record<string, { revenue: number; orders: number }> = {};
  (data ?? []).forEach((order) => {
    const month = order.created_at.slice(0, 7); // "YYYY-MM"
    if (!grouped[month]) grouped[month] = { revenue: 0, orders: 0 };
    grouped[month].revenue += order.total ?? 0;
    grouped[month].orders += 1;
  });

  // Isi bulan yang kosong dengan nilai 0
  const result: { month: string; revenue: number; orders: number }[] = [];
  for (let i = months - 1; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    const month = d.toISOString().slice(0, 7);
    result.push({
      month,
      revenue: grouped[month]?.revenue ?? 0,
      orders: grouped[month]?.orders ?? 0,
    });
  }

  return result;
}

// ============================================================
// PRODUK TERLARIS BERDASARKAN PENDAPATAN
// ============================================================

export async function getTopProductsByRevenue(storeId: string, limit = 5) {
  const supabase = await createRouteClient();

  const { data, error } = await supabase
    .from("order_items")
    .select(`
      product_id, quantity, subtotal,
      product:products!order_items_product_id_fkey(id, name, slug, price, total_sold, rating, images:product_images(url, is_primary))
    `)
    .eq("product.store_id", storeId)
    .limit(limit * 5); // ambil lebih banyak untuk keperluan pengelompokan

  if (error) throw error;

  // Agregasi berdasarkan product_id
  const map: Record<string, { product: any; revenue: number; units_sold: number }> = {};
  (data ?? []).forEach((item: any) => {
    if (!item.product) return;
    const pid = item.product_id;
    if (!map[pid]) map[pid] = { product: item.product, revenue: 0, units_sold: 0 };
    map[pid].revenue += item.subtotal ?? 0;
    map[pid].units_sold += item.quantity ?? 0;
  });

  return Object.values(map)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, limit);
}

// ============================================================
// DISTRIBUSI STATUS PESANAN
// ============================================================

export async function getOrderStatusBreakdown(storeId: string) {
  const supabase = await createRouteClient();

  const { data, error } = await supabase
    .from("orders")
    .select("status")
    .eq("store_id", storeId);

  if (error) throw error;

  const breakdown: Record<string, number> = {
    pending: 0,
    confirmed: 0,
    processing: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0,
    refunded: 0,
  };

  (data ?? []).forEach((order) => {
    if (order.status in breakdown) breakdown[order.status]++;
  });

  return breakdown;
}

// ============================================================
// JUMLAH PELANGGAN UNIK
// ============================================================

export async function getUniqueCustomerCount(storeId: string): Promise<number> {
  const supabase = await createRouteClient();

  const { data } = await supabase
    .from("orders")
    .select("buyer_id")
    .eq("store_id", storeId);

  const unique = new Set((data ?? []).map((o) => o.buyer_id));
  return unique.size;
}

// ============================================================
// PERTUMBUHAN PENDAPATAN (MoM - Bulan ke Bulan)
// ============================================================

export async function getRevenueGrowth(storeId: string): Promise<{
  current_month: number;
  previous_month: number;
  growth_percent: number;
}> {
  const supabase = await createRouteClient();

  const now = new Date();
  const currentStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const prevStart = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString();
  const prevEnd = new Date(now.getFullYear(), now.getMonth(), 0).toISOString();

  const [{ data: current }, { data: previous }] = await Promise.all([
    supabase
      .from("orders")
      .select("total")
      .eq("store_id", storeId)
      .eq("payment_status", "paid")
      .gte("created_at", currentStart),
    supabase
      .from("orders")
      .select("total")
      .eq("store_id", storeId)
      .eq("payment_status", "paid")
      .gte("created_at", prevStart)
      .lte("created_at", prevEnd),
  ]);

  const currentRevenue = (current ?? []).reduce((s, o) => s + (o.total ?? 0), 0);
  const previousRevenue = (previous ?? []).reduce((s, o) => s + (o.total ?? 0), 0);

  const growth =
    previousRevenue > 0
      ? ((currentRevenue - previousRevenue) / previousRevenue) * 100
      : currentRevenue > 0
        ? 100
        : 0;

  return {
    current_month: currentRevenue,
    previous_month: previousRevenue,
    growth_percent: Math.round(growth * 10) / 10,
  };
}

// ============================================================
// PESANAN TERBARU (untuk tampilan aktivitas dashboard)
// ============================================================

export async function getRecentOrders(storeId: string, limit = 10) {
  const supabase = await createRouteClient();

  const { data, error } = await supabase
    .from("orders")
    .select(`
      id, order_number, total, status, payment_status, created_at,
      buyer:profiles!orders_buyer_id_fkey(full_name, avatar_url)
    `)
    .eq("store_id", storeId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data ?? [];
}

// ============================================================
// PERINGATAN STOK MENIPIS
// ============================================================

export async function getLowStockProducts(storeId: string, threshold = 5) {
  const supabase = await createRouteClient();

  const { data, error } = await supabase
    .from("products")
    .select("id, name, slug, stock, price")
    .eq("store_id", storeId)
    .eq("is_active", true)
    .is("deleted_at", null)
    .lte("stock", threshold)
    .order("stock", { ascending: true });

  if (error) throw error;
  return data ?? [];
}

// ============================================================
// ADMIN: STATISTIK SELURUH PLATFORM
// ============================================================

export async function getPlatformStats() {
  const supabase = await createRouteClient();

  const [
    { count: totalUsers },
    { count: totalSellers },
    { count: totalProducts },
    { count: totalOrders },
    { data: revenue },
  ] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("seller_profiles").select("*", { count: "exact", head: true }).eq("is_active", true),
    supabase.from("products").select("*", { count: "exact", head: true }).eq("is_active", true).is("deleted_at", null),
    supabase.from("orders").select("*", { count: "exact", head: true }).eq("payment_status", "paid"),
    supabase.from("orders").select("total").eq("payment_status", "paid"),
  ]);

  const totalRevenue = (revenue ?? []).reduce((s, o) => s + (o.total ?? 0), 0);

  return {
    total_users: totalUsers ?? 0,
    total_sellers: totalSellers ?? 0,
    total_products: totalProducts ?? 0,
    total_orders: totalOrders ?? 0,
    total_revenue: totalRevenue,
  };
}
