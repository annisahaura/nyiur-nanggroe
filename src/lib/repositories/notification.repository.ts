import { createRouteClient } from "@/lib/utils/auth-helpers";
import { parsePaginationParams, toRange, buildPaginationMeta } from "@/lib/utils/pagination";

export type NotificationType = "marketplace" | "order" | "education" | "ai" | "announcement" | "system";

export interface CreateNotificationInput {
  user_id: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, unknown>;
  action_url?: string;
}

export async function getNotifications(userId: string, page = 1, per_page = 20) {
  const supabase = await createRouteClient();
  const pagination = parsePaginationParams(
    new URLSearchParams({ page: String(page), per_page: String(per_page) })
  );
  const { from, to } = toRange(pagination);

  const { data, count, error } = await supabase
    .from("notifications")
    .select("*", { count: "exact" })
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) throw error;

  return {
    data: data ?? [],
    meta: buildPaginationMeta(count ?? 0, pagination),
  };
}

export async function getUnreadCount(userId: string): Promise<number> {
  const supabase = await createRouteClient();

  const { count } = await supabase
    .from("notifications")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("is_read", false);

  return count ?? 0;
}

export async function createNotification(input: CreateNotificationInput) {
  const supabase = await createRouteClient();

  const { data, error } = await supabase
    .from("notifications")
    .insert(input)
    .select("id")
    .single();

  if (error) throw error;
  return data;
}

export async function markNotificationRead(notificationId: string, userId: string) {
  const supabase = await createRouteClient();

  const { error } = await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("id", notificationId)
    .eq("user_id", userId);

  if (error) throw error;
}

export async function markAllNotificationsRead(userId: string) {
  const supabase = await createRouteClient();

  const { error } = await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("user_id", userId)
    .eq("is_read", false);

  if (error) throw error;
}
