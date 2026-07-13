import { createRouteClient, createAdminRouteClient } from "@/lib/utils/auth-helpers";
import { getProfileByUserId } from "@/lib/repositories/user.repository";
import type { RegisterInput, LoginInput } from "@/lib/validators/auth.schema";

// ============================================================
// REGISTER
// ============================================================

export async function signUp(input: RegisterInput) {
  const supabase = await createAdminRouteClient();

  const { data, error } = await supabase.auth.admin.createUser({
    email: input.email,
    password: input.password,
    email_confirm: true,         // automatically confirms the email, no verification needed
    user_metadata: {
      full_name: input.full_name,
      phone: input.phone,
      province: input.province,
      city: input.city,
      country: input.country,
    },
  });

  if (error) {
    console.error("[signUp] SUPABASE ERROR:", error.name, error.message, error.status);
    console.dir(error, { depth: null });
    if (error.message && error.message.includes("already registered")) {
      throw new Error("EMAIL_EXISTS");
    }
    throw error;
  }

  // Update profile with additional fields (trigger creates basic profile)
  if (data.user && input.province) {
    const supabaseClient = await createRouteClient();
    await supabaseClient
      .from("profiles")
      .update({
        phone: input.phone,
        province: input.province,
        city: input.city,
        country: input.country,
      })
      .eq("user_id", data.user.id);
  }

  return { user_id: data.user?.id, email: data.user?.email };
}

// ============================================================
// LOGIN
// ============================================================

export async function signIn(input: LoginInput) {
  const supabase = await createRouteClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email: input.email,
    password: input.password,
  });

  if (error) {
    if (error.message.includes("Invalid login credentials")) {
      throw new Error("INVALID_CREDENTIALS");
    }
    if (error.message.includes("Email not confirmed")) {
      throw new Error("EMAIL_NOT_VERIFIED");
    }
    throw error;
  }

  const profile = await getProfileByUserId(data.user.id);

  return {
    user: {
      id: data.user.id,
      email: data.user.email!,
      role: profile?.role ?? "user",
      full_name: profile?.full_name ?? data.user.user_metadata?.full_name ?? "",
      avatar_url: profile?.avatar_url ?? null,
    },
    session: data.session,
  };
}

// ============================================================
// SIGN OUT
// ============================================================

export async function signOut() {
  const supabase = await createRouteClient();
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

// ============================================================
// FORGOT PASSWORD
// ============================================================

export async function sendPasswordResetEmail(email: string) {
  const supabase = await createRouteClient();

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/reset-password`,
  });

  if (error) throw error;
}

// ============================================================
// RESET PASSWORD
// ============================================================

export async function updatePassword(newPassword: string) {
  const supabase = await createRouteClient();

  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) throw error;
}

// ============================================================
// GET CURRENT SESSION
// ============================================================

export async function getCurrentSession() {
  const supabase = await createRouteClient();
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}

export async function getCurrentUser() {
  const supabase = await createRouteClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

// ============================================================
// RESEND VERIFICATION EMAIL
// ============================================================

export async function resendVerificationEmail(email: string) {
  const supabase = await createRouteClient();
  const { error } = await supabase.auth.resend({ type: "signup", email });
  if (error) throw error;
}
