import { NextRequest } from "next/server";
import { signUp } from "@/lib/services/auth.service";
import { registerSchema } from "@/lib/validators/auth.schema";
import { ok, badRequest, conflict, handleError } from "@/lib/utils/api-response";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Validate request body
    const validation = registerSchema.safeParse(body);
    if (!validation.success) {
      const fieldErrors: Record<string, string[]> = {};
      validation.error.errors.forEach((err) => {
        const path = err.path.join(".");
        if (!fieldErrors[path]) fieldErrors[path] = [];
        fieldErrors[path].push(err.message);
      });
      return badRequest("Validasi gagal", fieldErrors);
    }

    const result = await signUp(validation.data);
    return ok(result, { message: "Pendaftaran berhasil. Silakan cek email Anda untuk verifikasi." });
  } catch (error: any) {
    console.error("[REGISTER ERROR]", error?.message, error?.status, error);
    if (error.message === "EMAIL_EXISTS") {
      return conflict("Email sudah terdaftar. Silakan gunakan email lain atau masuk.");
    }
    // Return the actual error message for debugging
    const errObj = {
      message: error?.message,
      name: error?.name,
      status: error?.status,
      code: error?.code,
      stack: error?.stack,
      raw: error
    };
    return handleError(new Error(`Server error details: ${JSON.stringify(errObj)}`));
  }
}
