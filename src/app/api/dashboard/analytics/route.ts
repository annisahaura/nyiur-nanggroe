import { NextRequest } from "next/server";
import {
  getMonthlyRevenue,
  getOrderStatusBreakdown,
  getRevenueGrowth,
  getUniqueCustomerCount,
  getLowStockProducts,
  getRecentOrders,
} from "@/lib/repositories/analytics.repository";
import { getAuthUser, isSeller } from "@/lib/utils/auth-helpers";
import { getProfileWithStore } from "@/lib/repositories/user.repository";
import { ok, unauthorized, forbidden, handleError } from "@/lib/utils/api-response";

// GET /api/dashboard/analytics
// Mengembalikan data time-series dan ringkasan untuk grafik dashboard penjual
export async function GET(req: NextRequest) {
  try {
    const { user, error: authError } = await getAuthUser();
    if (authError || !user) return unauthorized();
    if (!isSeller(user)) return forbidden("Akses ditolak. Hanya untuk Mitra.");

    const profile = await getProfileWithStore(user.id);
    const store = profile?.seller_profile;
    if (!store) return forbidden("Profil Mitra tidak ditemukan.");

    const { searchParams } = new URL(req.url);
    const months = Math.min(parseInt(searchParams.get("months") ?? "6", 10), 12);

    // Ambil semua data analitik secara paralel
    const [pendapatanBulanan, distribusiStatus, pertumbuhan, jumlahPelanggan, stokMenipis, pesananTerbaru] =
      await Promise.all([
        getMonthlyRevenue(store.id, months),
        getOrderStatusBreakdown(store.id),
        getRevenueGrowth(store.id),
        getUniqueCustomerCount(store.id),
        getLowStockProducts(store.id),
        getRecentOrders(store.id, 10),
      ]);

    return ok({
      pendapatan_bulanan: pendapatanBulanan,
      distribusi_status_pesanan: distribusiStatus,
      pertumbuhan_pendapatan: pertumbuhan,
      total_pelanggan: jumlahPelanggan,
      peringatan_stok_menipis: stokMenipis,
      pesanan_terbaru: pesananTerbaru,
    });
  } catch (error) {
    return handleError(error);
  }
}
