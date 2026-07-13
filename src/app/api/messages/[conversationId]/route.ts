import { NextRequest } from "next/server";
import { getConversationMessages } from "@/lib/services/message.service";
import { messageFilterSchema } from "@/lib/validators/message.schema";
import { getAuthUser } from "@/lib/utils/auth-helpers";
import { ok, unauthorized, forbidden, handleError } from "@/lib/utils/api-response";

// GET /api/messages/[conversationId] — riwayat pesan berurutan dengan paginasi
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ conversationId: string }> }
) {
  try {
    const { user, error: authError } = await getAuthUser();
    if (authError || !user) return unauthorized("Login untuk melihat pesan.");

    const { conversationId } = await params;
    const { searchParams } = new URL(req.url);

    const validation = messageFilterSchema.safeParse({
      page: searchParams.get("page"),
      per_page: searchParams.get("per_page"),
    });

    const { page = 1, per_page = 30 } = validation.data ?? {};

    const result = await getConversationMessages(conversationId, user.id, page, per_page);
    return ok(result.data, { meta: result.meta });
  } catch (error: any) {
    if (error.message === "FORBIDDEN") return forbidden("Kamu tidak memiliki akses ke percakapan ini.");
    return handleError(error);
  }
}
