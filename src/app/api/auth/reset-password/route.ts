import { NextRequest } from "next/server";
import { updatePassword } from "@/lib/services/auth.service";
import { resetPasswordSchema } from "@/lib/validators/auth.schema";
import { ok, badRequest, handleError } from "@/lib/utils/api-response";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate request body
    const validation = resetPasswordSchema.safeParse(body);
    if (!validation.success) {
      return badRequest("Validasi gagal");
    }

    await updatePassword(validation.data.password);

    return ok({ reset: true }, { message: "Kata sandi Anda berhasil diperbarui." });
  } catch (error) {
    return handleError(error);
  }
}
