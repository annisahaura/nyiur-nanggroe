import { createRouteClient } from "@/lib/utils/auth-helpers";

// ============================================================
// LAYANAN DAMPAK LINGKUNGAN
// Mengelola tabel environmental_impacts dan statistik dampak pengguna
// ============================================================

// ============================================================
// AMBIL METRIK DAMPAK PLATFORM
// ============================================================

export async function getImpactMetrics() {
  const supabase = await createRouteClient();

  const { data, error } = await supabase
    .from("environmental_impacts")
    .select("*")
    .order("updated_at", { ascending: false })
    .limit(1)
    .single();

  if (error) {
    // Kembalikan nilai default jika tabel kosong
    return {
      total_waste_diverted: 0,
      total_co2_saved: 0,
      total_sellers: 0,
      total_products: 0,
      total_transactions: 0,
      total_communities: 0,
      monthly_growth: 0,
      updated_at: new Date().toISOString(),
    };
  }

  return data;
}

// ============================================================
// ADMIN: PEMICU KALKULASI ULANG
// Memanggil fungsi SQL recalculate_environmental_impact()
// ============================================================

export async function recalculateImpact(): Promise<{ updated_at: string }> {
  const supabase = await createRouteClient();

  const { error } = await supabase.rpc("recalculate_environmental_impact");
  if (error) throw error;

  // Ambil data terbaru setelah kalkulasi
  const { data } = await supabase
    .from("environmental_impacts")
    .select("updated_at")
    .limit(1)
    .single();

  return { updated_at: data?.updated_at ?? new Date().toISOString() };
}

// ============================================================
// DAMPAK LINGKUNGAN PENGGUNA
// ============================================================

export async function getUserImpact(userId: string) {
  const supabase = await createRouteClient();

  const { data } = await supabase
    .from("user_statistics")
    .select("co2_saved_kg, total_orders, total_spent")
    .eq("user_id", userId)
    .single();

  if (!data) {
    return {
      co2_saved_kg: 0,
      total_orders: 0,
      total_spent: 0,
      waste_diverted_kg: 0,
    };
  }

  // Estimasi sampah teralihkan (rasio kasar: 0.3 kg sampah per 1 kg CO2)
  const waste_diverted_kg = (data.co2_saved_kg ?? 0) * 0.3;

  return {
    co2_saved_kg: data.co2_saved_kg ?? 0,
    total_orders: data.total_orders ?? 0,
    total_spent: data.total_spent ?? 0,
    waste_diverted_kg,
  };
}

// ============================================================
// PERBARUI METRIK DAMPAK SECARA MANUAL (untuk seed admin)
// ============================================================

export async function updateImpactMetrics(input: {
  total_waste_diverted?: number;
  total_co2_saved?: number;
  total_sellers?: number;
  total_products?: number;
  total_transactions?: number;
  total_communities?: number;
  monthly_growth?: number;
}) {
  const supabase = await createRouteClient();

  // Ambil ID baris yang sudah ada
  const { data: existing } = await supabase
    .from("environmental_impacts")
    .select("id")
    .limit(1)
    .single();

  if (!existing) {
    const { data, error } = await supabase
      .from("environmental_impacts")
      .insert({ ...input })
      .select("*")
      .single();
    if (error) throw error;
    return data;
  }

  const { data, error } = await supabase
    .from("environmental_impacts")
    .update({ ...input, updated_at: new Date().toISOString() })
    .eq("id", existing.id)
    .select("*")
    .single();

  if (error) throw error;
  return data;
}
