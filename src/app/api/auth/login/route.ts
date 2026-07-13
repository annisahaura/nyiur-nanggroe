import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { signIn } from "@/lib/services/auth.service";
import { loginSchema } from "@/lib/validators/auth.schema";
import { ok, badRequest, unauthorized, handleError } from "@/lib/utils/api-response";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate request body
    const validation = loginSchema.safeParse(body);
    if (!validation.success) {
      return badRequest("Validasi gagal");
    }

    const { user, session } = await signIn(validation.data);

    // Save role in cookie so middleware can perform role guard efficiently
    const cookieStore = await cookies();
    cookieStore.set("nyiur_mock_role", user.role, {
      path: "/",
      maxAge: 60 * 60 * 24, // 1 day
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    return ok({ user, session }, { message: "Login berhasil" });
  } catch (error: any) {
    if (error.message === "INVALID_CREDENTIALS") {
      return unauthorized("Email atau kata sandi salah.");
    }
    if (error.message === "EMAIL_NOT_VERIFIED") {
      return unauthorized("Email Anda belum terverifikasi. Silakan cek inbox Anda.");
    }
    return handleError(error);
  }
}
