import { NextRequest } from "next/server";
import { getAuthUser } from "@/lib/utils/auth-helpers";
import { getProfileWithStore } from "@/lib/repositories/user.repository";
import { ok, unauthorized, handleError } from "@/lib/utils/api-response";

export async function GET(_req: NextRequest) {
  try {
    const { user, error } = await getAuthUser();
    
    if (error || !user) {
      return unauthorized();
    }

    const profileData = await getProfileWithStore(user.id);
    if (!profileData) {
      return unauthorized("Profil tidak ditemukan.");
    }

    return ok({
      id: user.id,
      email: user.email,
      role: user.role,
      full_name: profileData.full_name,
      avatar_url: profileData.avatar_url,
      phone: profileData.phone,
      location: profileData.location,
      province: profileData.province,
      city: profileData.city,
      bio: profileData.bio,
      is_verified: profileData.is_verified,
      created_at: profileData.created_at,
      seller_profile: profileData.seller_profile,
      stats: profileData.stats,
    });
  } catch (error) {
    return handleError(error);
  }
}
