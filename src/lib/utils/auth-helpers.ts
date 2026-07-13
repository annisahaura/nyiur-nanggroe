import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import type { UserRole } from "@/types";

// ============================================================
// SESSION TYPES
// ============================================================

export interface AuthUser {
  id: string;           // auth.users.id
  email: string;
  role: UserRole;
  profile_id: string;
  full_name: string;
}

export interface AuthResult {
  user: AuthUser | null;
  error: string | null;
}

// ============================================================
// GET USER FROM SERVER COMPONENT / ROUTE HANDLER (via cookies)
// ============================================================

export async function getAuthUser(): Promise<AuthResult> {
  try {
    const cookieStore = await cookies();

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll: () => cookieStore.getAll(),
          setAll: (cookiesToSet: { name: string; value: string; options?: any }[]) => {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              );
            } catch {}
          },
        },
      }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return { user: null, error: "Not authenticated" };
    }

    // Get profile + role
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("id, full_name, role")
      .eq("user_id", user.id)
      .single();

    if (profileError || !profile) {
      return { user: null, error: "Profile not found" };
    }

    return {
      user: {
        id: user.id,
        email: user.email!,
        role: profile.role as UserRole,
        profile_id: profile.id,
        full_name: profile.full_name,
      },
      error: null,
    };
  } catch (e) {
    console.error("[getAuthUser]", e);
    return { user: null, error: "Auth error" };
  }
}

// ============================================================
// GET USER FROM REQUEST HEADERS (for API route handlers)
// ============================================================

export async function getAuthUserFromRequest(_req: NextRequest): Promise<AuthResult> {
  // Route handlers use the same cookie-based approach
  return getAuthUser();
}

// ============================================================
// REQUIRE AUTH — throws-equivalent (returns null on fail)
// ============================================================

export async function requireAuth(): Promise<AuthUser | null> {
  const { user } = await getAuthUser();
  return user;
}

// ============================================================
// REQUIRE ROLE
// ============================================================

export function requireRole(user: AuthUser, requiredRole: UserRole): boolean {
  const roleHierarchy: Record<UserRole, number> = {
    user: 1,
    seller: 2,
    admin: 3,
  };

  return roleHierarchy[user.role] >= roleHierarchy[requiredRole];
}

export function isSeller(user: AuthUser): boolean {
  return user.role === "seller" || user.role === "admin";
}

export function isAdmin(user: AuthUser): boolean {
  return user.role === "admin";
}

// ============================================================
// CREATE SUPABASE CLIENT FOR ROUTE HANDLERS
// ============================================================

export async function createRouteClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet: { name: string; value: string; options?: any }[]) => {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {}
        },
      },
    }
  );
}

export async function createAdminRouteClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet: { name: string; value: string; options?: any }[]) => {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {}
        },
      },
    }
  );
}
