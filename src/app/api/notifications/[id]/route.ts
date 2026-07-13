import { NextRequest } from "next/server";
import { readNotification } from "@/lib/services/notification.service";
import { getAuthUser } from "@/lib/utils/auth-helpers";
import { ok, unauthorized, handleError } from "@/lib/utils/api-response";

export async function PATCH(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { user, error: authError } = await getAuthUser();
    if (authError || !user) {
      return unauthorized();
    }

    await readNotification(id, user.id);
    return ok({ read: true }, { message: "Notifikasi ditandai dibaca" });
  } catch (error) {
    return handleError(error);
  }
}
