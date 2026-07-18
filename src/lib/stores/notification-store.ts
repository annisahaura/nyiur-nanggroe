import { create } from "zustand";
import { persist } from "zustand/middleware";

// ============================================
// TYPES
// ============================================

export type NotificationType =
  | "order_new"
  | "order_paid"
  | "order_shipped"
  | "low_stock"
  | "new_review"
  | "education"
  | "ai_suggestion"
  | "system"
  | "promo";

export interface NotificationItem {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  href?: string;
  is_read: boolean;
  created_at: string;
}

interface NotificationState {
  notifications: NotificationItem[];
  unreadCount: number;
  // Which role the mock notifications were last seeded for. Used to avoid
  // re-seeding (and wiping read/deleted state) every time initNotifications
  // runs on remount.
  initializedRole: "user" | "seller" | "admin" | null;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  addNotification: (item: Omit<NotificationItem, "id" | "created_at" | "is_read">) => void;
  clearAll: () => void;
}

// ============================================
// MOCK NOTIFICATIONS
// ============================================

const MOCK_SELLER_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "n-1",
    type: "order_new",
    title: "Pesanan Baru! 🎉",
    message: "Ahmad Maulana memesan Briket Kelapa Premium 5kg",
    href: "/mitra/pesanan",
    is_read: false,
    created_at: new Date(Date.now() - 5 * 60000).toISOString(),
  },
  {
    id: "n-2",
    type: "order_paid",
    title: "Pembayaran Diterima",
    message: "Pesanan #NN-892714 telah dibayar. Segera proses pengiriman.",
    href: "/mitra/pesanan",
    is_read: false,
    created_at: new Date(Date.now() - 30 * 60000).toISOString(),
  },
  {
    id: "n-3",
    type: "low_stock",
    title: "Stok Hampir Habis ⚠️",
    message: "VCO Premium 250ml hanya tersisa 3 unit.",
    href: "/mitra/inventaris",
    is_read: false,
    created_at: new Date(Date.now() - 2 * 3600000).toISOString(),
  },
  {
    id: "n-4",
    type: "new_review",
    title: "Ulasan Baru ⭐",
    message: "Budi Santoso memberikan ulasan 5 bintang untuk Arang Aktif.",
    href: "/mitra/produk",
    is_read: true,
    created_at: new Date(Date.now() - 5 * 3600000).toISOString(),
  },
  {
    id: "n-5",
    type: "ai_suggestion",
    title: "Saran dari Nyai Nyiur 🌿",
    message: "Produk Cocopeat Anda bisa tampil di halaman depan. Tambahkan lebih banyak foto!",
    href: "/mitra/produk",
    is_read: true,
    created_at: new Date(Date.now() - 24 * 3600000).toISOString(),
  },
];

const MOCK_USER_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "n-u1",
    type: "order_shipped",
    title: "Pesanan Dikirim! 📦",
    message: "Pesanan #NN-392741 sudah dikirim via J&T Express. Lacak sekarang.",
    href: "/akun",
    is_read: false,
    created_at: new Date(Date.now() - 10 * 60000).toISOString(),
  },
  {
    id: "n-u2",
    type: "education",
    title: "Artikel Baru Tersedia",
    message: "Cara Membuat Briket Kelapa Rumahan — baca sekarang di Education Hub.",
    href: "/edukasi",
    is_read: false,
    created_at: new Date(Date.now() - 3 * 3600000).toISOString(),
  },
  {
    id: "n-u3",
    type: "promo",
    title: "Promo Hari Ini 🎊",
    message: "Gratis ongkir untuk pembelian di atas Rp 100.000 hari ini!",
    href: "/produk",
    is_read: true,
    created_at: new Date(Date.now() - 12 * 3600000).toISOString(),
  },
];

// ============================================
// ZUSTAND STORE
// ============================================

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set) => ({
      notifications: [],
      unreadCount: 0,
      initializedRole: null,

      markAsRead: (id: string) =>
        set((state) => {
          const updated = state.notifications.map((n) =>
            n.id === id ? { ...n, is_read: true } : n
          );
          return {
            notifications: updated,
            unreadCount: updated.filter((n) => !n.is_read).length,
          };
        }),

      markAllAsRead: () =>
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, is_read: true })),
          unreadCount: 0,
        })),

      addNotification: (item) =>
        set((state) => {
          const newNotif: NotificationItem = {
            ...item,
            id: `n-${Date.now()}`,
            is_read: false,
            created_at: new Date().toISOString(),
          };
          const updated = [newNotif, ...state.notifications];
          return {
            notifications: updated,
            unreadCount: updated.filter((n) => !n.is_read).length,
          };
        }),

      clearAll: () => set({ notifications: [], unreadCount: 0 }),
    }),
    {
      name: "nyiur-notifications",
      version: 1,
    }
  )
);

export function initNotifications(role: "user" | "seller" | "admin") {
  const store = useNotificationStore.getState();
  if (store.initializedRole === role) return;

  const notifs =
    role === "seller" || role === "admin"
      ? MOCK_SELLER_NOTIFICATIONS
      : MOCK_USER_NOTIFICATIONS;
  useNotificationStore.setState({
    notifications: notifs,
    unreadCount: notifs.filter((n) => !n.is_read).length,
    initializedRole: role,
  });
}
