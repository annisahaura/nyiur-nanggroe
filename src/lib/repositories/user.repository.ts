import { createRouteClient, createAdminRouteClient } from "@/lib/utils/auth-helpers";
import type { UpdateProfileInput, CreateSellerInput } from "@/lib/validators/auth.schema";
import { sanitizeImageUrl } from "@/lib/utils/image-sanitizer";

export function sanitizeSellerProfile(s: any): any {
  if (!s) return s;
  s.logo_url = sanitizeImageUrl(s.logo_url, s.name);
  s.banner_url = sanitizeImageUrl(s.banner_url, s.name);
  return s;
}

export async function getProfileByUserId(userId: string) {
  const supabase = await createRouteClient();

  const { data, error } = await supabase
    .from("profiles")
    .select(`
      id, user_id, full_name, username, avatar_url, bio,
      phone, location, province, city, country, role, is_verified,
      created_at, updated_at
    `)
    .eq("user_id", userId)
    .single();

  if (error) return null;
  return data;
}

export async function getProfileWithStore(userId: string) {
  const supabase = await createRouteClient();

  const { data, error } = await supabase
    .from("profiles")
    .select(`
      id, user_id, full_name, username, avatar_url, bio,
      phone, location, province, city, country, role, is_verified,
      created_at, updated_at,
      seller_profile:seller_profiles(
        id, name, slug, description, logo_url, banner_url,
        location, province, city, rating, total_sales, total_products,
        is_verified, is_active, whatsapp, instagram, website, created_at
      ),
      stats:user_statistics(
        total_orders, total_spent, co2_saved_kg, articles_read, quizzes_passed
      )
    `)
    .eq("user_id", userId)
    .single();

  if (error || !data) return null;

  const profile = data as any;
  const seller_profile = Array.isArray(profile.seller_profile)
    ? profile.seller_profile[0]
    : profile.seller_profile;
  const stats = Array.isArray(profile.stats)
    ? profile.stats[0]
    : profile.stats;

  return {
    ...profile,
    seller_profile: seller_profile ? sanitizeSellerProfile(seller_profile) : null,
    stats: stats || null,
  };
}

export async function updateProfile(userId: string, input: UpdateProfileInput) {
  const supabase = await createRouteClient();

  const { data, error } = await supabase
    .from("profiles")
    .update(input)
    .eq("user_id", userId)
    .select("id, full_name, username, avatar_url, bio, phone, province, city, role")
    .single();

  if (error) throw error;
  return data;
}

export async function createSellerProfile(profileId: string, input: CreateSellerInput) {
  const supabase = await createRouteClient();

  const { data, error } = await supabase
    .from("seller_profiles")
    .insert({ owner_id: profileId, ...input })
    .select("id, name, slug")
    .single();

  if (error) throw error;

  // Update user role to seller
  await supabase
    .from("profiles")
    .update({ role: "seller" })
    .eq("id", profileId);

  // Create seller stats row
  await supabase.from("seller_statistics").insert({ store_id: data.id });

  return data;
}

export async function getSellerProfileBySlug(slug: string) {
  const supabase = await createRouteClient();

  const { data, error } = await supabase
    .from("seller_profiles")
    .select(`
      id, name, slug, description, logo_url, banner_url,
      location, province, city, rating, total_sales, total_products,
      is_verified, is_active, whatsapp, instagram, website, created_at,
      owner:profiles(full_name, avatar_url)
    `)
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (error) return null;
  return sanitizeSellerProfile(data);
}

export async function getSellerStatistics(storeId: string) {
  const supabase = await createRouteClient();

  const { data } = await supabase
    .from("seller_statistics")
    .select("*")
    .eq("store_id", storeId)
    .single();

  return data;
}

export async function setUserRole(userId: string, role: "user" | "seller" | "admin") {
  const supabase = await createAdminRouteClient();

  await supabase.from("profiles").update({ role }).eq("user_id", userId);
  await supabase.auth.admin.updateUserById(userId, {
    app_metadata: { role },
  });
}
