import { NextRequest } from "next/server";
import { getUserConversations, startConversation } from "@/lib/services/message.service";
import { startConversationSchema } from "@/lib/validators/message.schema";
import { getAuthUser } from "@/lib/utils/auth-helpers";
import { ok, created, badRequest, unauthorized, handleError } from "@/lib/utils/api-response";

// GET /api/messages — daftar semua percakapan pengguna yang sudah login
export async function GET(_req: NextRequest) {
  try {
    const { user, error: authError } = await getAuthUser();
    if (authError || !user) return unauthorized("Login untuk melihat pesan.");

    const conversations = await getUserConversations(user.id);
    return ok(conversations);
  } catch (error) {
    return handleError(error);
  }
}

// POST /api/messages — mulai percakapan baru dengan penjual
export async function POST(req: NextRequest) {
  try {
    const { user, error: authError } = await getAuthUser();
    if (authError || !user) return unauthorized("Login untuk memulai percakapan.");

    const body = await req.json();
    const validation = startConversationSchema.safeParse(body);
    if (!validation.success) {
      return badRequest("Data percakapan tidak valid", validation.error.flatten().fieldErrors);
    }

    const { seller_id, product_id } = validation.data;

    const result = await startConversation(user.id, seller_id, product_id);
    return created(result, result.is_new ? "Percakapan berhasil dimulai." : "Percakapan sudah ada.");
  } catch (error: any) {
    if (error.message === "SELF_CONVERSATION")
      return badRequest("Kamu tidak bisa memulai percakapan dengan dirimu sendiri.");
    if (error.message === "SELLER_NOT_FOUND") return badRequest("Penjual tidak ditemukan.");
    return handleError(error);
  }
}
