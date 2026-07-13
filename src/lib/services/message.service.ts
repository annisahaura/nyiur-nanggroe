import {
  getConversations,
  getOrCreateConversation,
  getMessages,
  sendMessage as repoSendMessage,
  markMessagesRead,
  getTotalUnreadMessages,
  verifyConversationAccess,
} from "@/lib/repositories/message.repository";
import { createNotification } from "@/lib/repositories/notification.repository";
import { createRouteClient } from "@/lib/utils/auth-helpers";

// ============================================================
// LAYANAN PESAN
// ============================================================

export async function getUserConversations(userId: string) {
  return getConversations(userId);
}

export async function startConversation(
  buyerId: string,
  sellerId: string,
  productId?: string | null
) {
  // Cegah percakapan dengan diri sendiri
  if (buyerId === sellerId) {
    throw new Error("SELF_CONVERSATION");
  }

  // Pastikan penjual ada
  const supabase = await createRouteClient();
  const { data: sellerProfile } = await supabase
    .from("profiles")
    .select("id, user_id")
    .eq("user_id", sellerId)
    .single();

  if (!sellerProfile) throw new Error("SELLER_NOT_FOUND");

  return getOrCreateConversation(buyerId, sellerId, productId);
}

export async function getConversationMessages(
  conversationId: string,
  userId: string,
  page = 1,
  per_page = 30
) {
  // Verifikasi akses pengguna
  const hasAccess = await verifyConversationAccess(conversationId, userId);
  if (!hasAccess) throw new Error("FORBIDDEN");

  const result = await getMessages(conversationId, page, per_page);

  // Tandai sebagai sudah dibaca (non-blocking)
  markMessagesRead(conversationId, userId).catch(() => {});

  return result;
}

export async function sendMessageInConversation(
  conversationId: string,
  senderId: string,
  content: string
) {
  // Verifikasi akses
  const hasAccess = await verifyConversationAccess(conversationId, senderId);
  if (!hasAccess) throw new Error("FORBIDDEN");

  const message = await repoSendMessage(conversationId, senderId, content);

  // Kirim notifikasi ke pihak lain (non-blocking)
  notifyOtherParticipant(conversationId, senderId, content).catch(() => {});

  return message;
}

async function notifyOtherParticipant(
  conversationId: string,
  senderId: string,
  content: string
) {
  const supabase = await createRouteClient();

  const { data: conv } = await supabase
    .from("conversations")
    .select("buyer_id, seller_id")
    .eq("id", conversationId)
    .single();

  if (!conv) return;

  const recipientId = conv.buyer_id === senderId ? conv.seller_id : conv.buyer_id;

  // Ambil nama pengirim
  const { data: senderProfile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("user_id", senderId)
    .single();

  const preview = content.length > 60 ? `${content.slice(0, 60)}...` : content;

  await createNotification({
    user_id: recipientId,
    type: "marketplace",
    title: "Pesan Baru",
    message: `${senderProfile?.full_name ?? "Seseorang"}: "${preview}"`,
    action_url: `/pesan/${conversationId}`,
    data: { conversation_id: conversationId },
  });
}

export async function getUnreadMessageCount(userId: string): Promise<number> {
  return getTotalUnreadMessages(userId);
}
