import { NextRequest } from "next/server";
import { getUserNotifications, getUnreadNotificationsCount, readAllNotifications } from "@/lib/services/notification.service";
import { getAuthUser } from "@/lib/utils/auth-helpers";
import { ok, unauthorized, handleError } from "@/lib/utils/api-response";

export async function GET(req: NextRequest) {
  try {
    const { user, error: authError } = await getAuthUser();
    if (authError || !user) {
      return unauthorized();
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const perPage = parseInt(searchParams.get("per_page") || "20", 10);

    const result = await getUserNotifications(user.id, page, perPage);
    const unreadCount = await getUnreadNotificationsCount(user.id);

    return ok(result.data, {
      meta: {
        ...result.meta,
        unread_count: unreadCount,
      } as any,
    });
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(_req: NextRequest) {
  try {
    const { user, error: authError } = await getAuthUser();
    if (authError || !user) {
      return unauthorized();
    }

    await readAllNotifications(user.id);
    return ok({ marked_all_read: true }, { message: "Semua notifikasi ditandai telah dibaca" });
  } catch (error) {
    return handleError(error);
  }
}
