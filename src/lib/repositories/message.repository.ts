import { createRouteClient } from "@/lib/utils/auth-helpers";
import { parsePaginationParams, toRange, buildPaginationMeta } from "@/lib/utils/pagination";

// ============================================================
// REPOSITORI PESAN
// Mengelola: percakapan, pesan
// ============================================================

const CONVERSATION_SELECT = `
  id, buyer_id, seller_id, product_id, last_message_at, created_at,
  buyer:profiles!conversations_buyer_id_fkey(id, full_name, avatar_url),
  seller:profiles!conversations_seller_id_fkey(id, full_name, avatar_url),
  product:products(id, name, slug, images:product_images(url, is_primary))
`;

const MESSAGE_SELECT = `
  id, conversation_id, sender_id, content, is_read, created_at,
  sender:profiles(id, full_name, avatar_url)
`;

// ============================================================
// PERCAKAPAN
// ============================================================

export async function getConversations(userId: string) {
  const supabase = await createRouteClient();

  const { data, error } = await supabase
    .from("conversations")
    .select(CONVERSATION_SELECT)
    .or(`buyer_id.eq.${userId},seller_id.eq.${userId}`)
    .order("last_message_at", { ascending: false });

  if (error) throw error;

  // Tambahkan jumlah pesan belum dibaca per percakapan
  const withUnread = await Promise.all(
    (data ?? []).map(async (conv) => {
      const { count } = await supabase
        .from("messages")
        .select("*", { count: "exact", head: true })
        .eq("conversation_id", conv.id)
        .eq("is_read", false)
        .neq("sender_id", userId);

      return { ...conv, unread_count: count ?? 0 };
    })
  );

  return withUnread;
}

export async function getOrCreateConversation(
  buyerId: string,
  sellerId: string,
  productId?: string | null
): Promise<{ id: string; is_new: boolean }> {
  const supabase = await createRouteClient();

  // Cari percakapan yang sudah ada
  let query = supabase
    .from("conversations")
    .select("id")
    .eq("buyer_id", buyerId)
    .eq("seller_id", sellerId);

  if (productId) {
    query = query.eq("product_id", productId);
  } else {
    query = query.is("product_id", null);
  }

  const { data: existing } = await query.single();

  if (existing) {
    return { id: existing.id, is_new: false };
  }

  // Buat percakapan baru
  const { data: created, error } = await supabase
    .from("conversations")
    .insert({ buyer_id: buyerId, seller_id: sellerId, product_id: productId ?? null })
    .select("id")
    .single();

  if (error) throw error;
  return { id: created.id, is_new: true };
}

export async function getConversationById(
  conversationId: string,
  userId: string
) {
  const supabase = await createRouteClient();

  const { data, error } = await supabase
    .from("conversations")
    .select(CONVERSATION_SELECT)
    .eq("id", conversationId)
    .or(`buyer_id.eq.${userId},seller_id.eq.${userId}`)
    .single();

  if (error) return null;
  return data;
}

// ============================================================
// PESAN
// ============================================================

export async function getMessages(conversationId: string, page = 1, per_page = 30) {
  const supabase = await createRouteClient();
  const pagination = parsePaginationParams(
    new URLSearchParams({ page: String(page), per_page: String(per_page) })
  );
  const { from, to } = toRange(pagination);

  const { data, count, error } = await supabase
    .from("messages")
    .select(MESSAGE_SELECT, { count: "exact" })
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: false }) // terbaru dulu untuk scroll terbalik
    .range(from, to);

  if (error) throw error;

  return {
    data: (data ?? []).reverse(), // balik ke urutan kronologis
    meta: buildPaginationMeta(count ?? 0, pagination),
  };
}

export async function sendMessage(
  conversationId: string,
  senderId: string,
  content: string
) {
  const supabase = await createRouteClient();

  const { data, error } = await supabase
    .from("messages")
    .insert({ conversation_id: conversationId, sender_id: senderId, content })
    .select(MESSAGE_SELECT)
    .single();

  if (error) throw error;
  return data;
}

export async function markMessagesRead(conversationId: string, userId: string) {
  const supabase = await createRouteClient();

  // Tandai semua pesan dari pihak lain sebagai sudah dibaca
  await supabase
    .from("messages")
    .update({ is_read: true })
    .eq("conversation_id", conversationId)
    .eq("is_read", false)
    .neq("sender_id", userId);
}

export async function getTotalUnreadMessages(userId: string): Promise<number> {
  const supabase = await createRouteClient();

  // Ambil semua percakapan pengguna ini
  const { data: convs } = await supabase
    .from("conversations")
    .select("id")
    .or(`buyer_id.eq.${userId},seller_id.eq.${userId}`);

  if (!convs || convs.length === 0) return 0;

  const convIds = convs.map((c) => c.id);

  const { count } = await supabase
    .from("messages")
    .select("*", { count: "exact", head: true })
    .in("conversation_id", convIds)
    .eq("is_read", false)
    .neq("sender_id", userId);

  return count ?? 0;
}

export async function verifyConversationAccess(
  conversationId: string,
  userId: string
): Promise<boolean> {
  const supabase = await createRouteClient();

  const { data } = await supabase
    .from("conversations")
    .select("id")
    .eq("id", conversationId)
    .or(`buyer_id.eq.${userId},seller_id.eq.${userId}`)
    .single();

  return !!data;
}
