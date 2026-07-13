import { create } from "zustand";
import { persist } from "zustand/middleware";

// ============================================
// TYPES
// ============================================

export type UserRole = "guest" | "user" | "seller" | "admin";

export interface MockUser {
  id: string;
  email: string;
  full_name: string;
  phone: string | null;
  avatar_url: string | null;
  role: UserRole;
  is_verified: boolean;
  province: string | null;
  city: string | null;
  country: string;
  bio: string | null;
  created_at: string;
  // Seller info
  store_name: string | null;
  store_slug: string | null;
  store_logo: string | null;
  // Learning progress
  articles_read: number;
  quizzes_passed: number;
  // Impact
  total_orders: number;
  co2_saved_kg: number;
}

export interface AuthState {
  user: MockUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  // Actions
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: RegisterData) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  upgradeToSeller: (storeData: StoreData) => Promise<{ success: boolean; error?: string }>;
  updateProfile: (data: Partial<MockUser>) => Promise<{ success: boolean; error?: string }>;
  fetchCurrentUser: () => Promise<void>;
}

export interface RegisterData {
  full_name: string;
  email: string;
  password: string;
  phone: string;
  country: string;
  province: string;
  city: string;
}

export interface StoreData {
  store_name: string;
  store_slug: string;
  store_logo?: string | null;
  description?: string;
  location?: string;
  province?: string;
  city?: string;
}

// ============================================
// ZUSTAND STORE WITH REAL API FALLBACKS
// ============================================

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true });

        try {
          const res = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
          });

          const data = await res.json();
          set({ isLoading: false });

          if (!res.ok || !data.success) {
            return { success: false, error: data.error || "Gagal masuk. Silakan coba lagi." };
          }

          const { user } = data.data;
          
          // Map to MockUser structure
          const mappedUser: MockUser = {
            id: user.id,
            email: user.email,
            full_name: user.full_name,
            phone: user.phone || null,
            avatar_url: user.avatar_url || null,
            role: user.role,
            is_verified: user.is_verified || false,
            province: user.province || null,
            city: user.city || null,
            country: user.country || "Indonesia",
            bio: user.bio || null,
            created_at: user.created_at || new Date().toISOString(),
            store_name: user.seller_profile?.name || null,
            store_slug: user.seller_profile?.slug || null,
            store_logo: user.seller_profile?.logo_url || null,
            articles_read: user.stats?.articles_read || 0,
            quizzes_passed: user.stats?.quizzes_passed || 0,
            total_orders: user.stats?.total_orders || 0,
            co2_saved_kg: user.stats?.co2_saved_kg || 0,
          };

          set({ user: mappedUser, isAuthenticated: true });

          // Set cookies for middleware
          if (typeof document !== "undefined") {
            document.cookie = "nyiur_mock_session=true; path=/; max-age=86400";
            document.cookie = `nyiur_mock_role=${mappedUser.role}; path=/; max-age=86400`;
          }

          return { success: true };
        } catch (err) {
          set({ isLoading: false });
          return { success: false, error: "Terjadi kesalahan koneksi." };
        }
      },

      register: async (data: RegisterData) => {
        set({ isLoading: true });

        try {
          const res = await fetch("/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          });

          const resData = await res.json();
          set({ isLoading: false });

          if (!res.ok || !resData.success) {
            return { success: false, error: resData.error || "Gagal mendaftar." };
          }

          // Auto-login after successful registration
          const loginRes = await get().login(data.email, data.password);
          if (!loginRes.success) {
            return { success: true, error: "Pendaftaran berhasil, tetapi gagal masuk otomatis. Silakan masuk manual." };
          }

          return { success: true };
        } catch (err) {
          set({ isLoading: false });
          return { success: false, error: "Terjadi kesalahan koneksi." };
        }
      },

      logout: async () => {
        // 1. Call backend logout (clear Supabase session)
        try {
          await fetch("/api/auth/logout", { method: "POST" });
        } catch {}

        // 2. Clear all cookies (force expire)
        if (typeof document !== "undefined") {
          document.cookie = "nyiur_mock_session=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT";
          document.cookie = "nyiur_mock_role=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT";
          // Also clear any sb- Supabase cookies
          document.cookie.split(";").forEach((cookie) => {
            const name = cookie.split("=")[0].trim();
            if (name.startsWith("sb-")) {
              document.cookie = `${name}=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
            }
          });
        }

        // 3. Clear Zustand state
        set({ user: null, isAuthenticated: false });

        // 4. Clear localStorage (persisted Zustand state)
        if (typeof localStorage !== "undefined") {
          localStorage.removeItem("nyiur-auth");
        }
      },

      upgradeToSeller: async (storeData: StoreData) => {
        const { user } = get();
        if (!user) return { success: false, error: "Harap masuk terlebih dahulu" };

        try {
          const res = await fetch("/api/store", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: storeData.store_name,
              slug: storeData.store_slug,
              description: storeData.description || "Toko penjual produk kelapa lestari.",
              location: storeData.location || user.city || "",
              province: storeData.province || user.province || "",
              city: storeData.city || user.city || "",
            }),
          });

          const data = await res.json();
          if (!res.ok || !data.success) {
            return { success: false, error: data.error || "Gagal mendaftar Mitra." };
          }

          const updatedUser: MockUser = {
            ...user,
            role: "seller",
            store_name: storeData.store_name,
            store_slug: storeData.store_slug,
            store_logo: storeData.store_logo ?? null,
          };

          set({ user: updatedUser });

          if (typeof document !== "undefined") {
            document.cookie = `nyiur_mock_role=seller; path=/; max-age=86400`;
          }

          return { success: true };
        } catch (err) {
          return { success: false, error: "Kesalahan koneksi." };
        }
      },

      updateProfile: async (data: Partial<MockUser>) => {
        const { user } = get();
        if (!user) return { success: false, error: "Harap masuk terlebih dahulu" };

        try {
          const res = await fetch("/api/profile", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          });

          const resData = await res.json();
          if (!res.ok || !resData.success) {
            return { success: false, error: resData.error || "Gagal memperbarui profil." };
          }

          const updatedUser = { ...user, ...data };
          set({ user: updatedUser });

          if (typeof document !== "undefined" && data.role) {
            document.cookie = `nyiur_mock_role=${data.role}; path=/; max-age=86400`;
          }

          return { success: true };
        } catch (err) {
          return { success: false, error: "Kesalahan koneksi." };
        }
      },

      fetchCurrentUser: async () => {
        try {
          const res = await fetch("/api/auth/me");
          const data = await res.json();

          if (res.ok && data.success) {
            const user = data.data;
            const mappedUser: MockUser = {
              id: user.id,
              email: user.email,
              full_name: user.full_name,
              phone: user.phone || null,
              avatar_url: user.avatar_url || null,
              role: user.role,
              is_verified: user.is_verified || false,
              province: user.province || null,
              city: user.city || null,
              country: user.country || "Indonesia",
              bio: user.bio || null,
              created_at: user.created_at || new Date().toISOString(),
              store_name: user.seller_profile?.name || null,
              store_slug: user.seller_profile?.slug || null,
              store_logo: user.seller_profile?.logo_url || null,
              articles_read: user.stats?.articles_read || 0,
              quizzes_passed: user.stats?.quizzes_passed || 0,
              total_orders: user.stats?.total_orders || 0,
              co2_saved_kg: user.stats?.co2_saved_kg || 0,
            };

            set({ user: mappedUser, isAuthenticated: true });
          } else {
            // Clear session if unauthorized
            set({ user: null, isAuthenticated: false });
          }
        } catch (err) {
          console.error("Gagal sinkronisasi data user", err);
        }
      },
    }),
    {
      name: "nyiur-auth",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// Helper hook for role checks
export const useIsAuthenticated = () => useAuthStore((s) => s.isAuthenticated);
export const useCurrentUser = () => useAuthStore((s) => s.user);
export const useUserRole = () => useAuthStore((s) => s.user?.role ?? "guest");
export const useIsSeller = () => useAuthStore((s) => s.user?.role === "seller" || s.user?.role === "admin");
export const useIsAdmin = () => useAuthStore((s) => s.user?.role === "admin");
