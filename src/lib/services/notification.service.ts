import {
  getNotifications,
  getUnreadCount,
  createNotification,
  markNotificationRead,
  markAllNotificationsRead,
  CreateNotificationInput,
} from "@/lib/repositories/notification.repository";

export async function getUserNotifications(userId: string, page = 1, per_page = 20) {
  return getNotifications(userId, page, per_page);
}

export async function getUnreadNotificationsCount(userId: string): Promise<number> {
  return getUnreadCount(userId);
}

export async function sendNotification(input: CreateNotificationInput) {
  return createNotification(input);
}

export async function readNotification(notificationId: string, userId: string) {
  return markNotificationRead(notificationId, userId);
}

export async function readAllNotifications(userId: string) {
  return markAllNotificationsRead(userId);
}

export async function sendSystemAnnouncement(title: string, message: string, actionUrl?: string) {
  // Send announcements to all users or admins.
  // For simplicity, we can fetch all profile IDs and insert notifications, 
  // but in a large system, this would be processed asynchronously or via a bulk insert.
  const { createAdminRouteClient } = await import("@/lib/utils/auth-helpers");
  const supabase = await createAdminRouteClient();

  const { data: users, error } = await supabase.from("profiles").select("user_id");
  if (error || !users) return;

  const notifications = users.map((u) => ({
    user_id: u.user_id,
    type: "announcement" as const,
    title,
    message,
    action_url: actionUrl,
  }));

  const { error: insertError } = await supabase.from("notifications").insert(notifications);
  if (insertError) throw insertError;
}
