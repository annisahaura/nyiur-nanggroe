import { NextRequest } from "next/server";
import { sendPasswordResetEmail } from "@/lib/services/auth.service";
import { forgotPasswordSchema } from "@/lib/validators/auth.schema";
import { ok, badRequest, handleError } from "@/lib/utils/api-response";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate request body
    const validation = forgotPasswordSchema.safeParse(body);
    if (!validation.success) {
      return badRequest("Email tidak valid");
    }

    await sendPasswordResetEmail(validation.data.email);

    return ok({ sent: true }, { message: "Link atur ulang kata sandi telah dikirim ke email Anda." });
  } catch (error) {
    return handleError(error);
  }
}
