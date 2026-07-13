import { NextRequest } from "next/server";
import { getAuthUser } from "@/lib/utils/auth-helpers";
import { sendMessageSchema } from "@/lib/validators/message.schema";
import { verifyConversationAccess, sendMessage } from "@/lib/repositories/message.repository";
import { createNotification } from "@/lib/repositories/notification.repository";
import { createRouteClient } from "@/lib/utils/auth-helpers";
import { ok, badRequest, unauthorized, forbidden, handleError } from "@/lib/utils/api-response";

// POST /api/messages/[conversationId]/send — kirim pesan ke percakapan
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ conversationId: string }> }
) {
  try {
    const { user, error: authError } = await getAuthUser();
    if (authError || !user) return unauthorized("Login untuk mengirim pesan.");

    const { conversationId } = await params;

    // Pastikan pengguna punya akses ke percakapan ini
    const hasAccess = await verifyConversationAccess(conversationId, user.id);
    if (!hasAccess) return forbidden("Kamu tidak memiliki akses ke percakapan ini.");

    const body = await req.json();
    const validation = sendMessageSchema.safeParse(body);
    if (!validation.success) {
      return badRequest("Pesan tidak valid", validation.error.flatten().fieldErrors);
    }

    // Kirim pesan
    const message = await sendMessage(conversationId, user.id, validation.data.content);

    // Kirim notifikasi ke pihak lain (non-blocking)
    notifyOtherParticipant(conversationId, user.id, user.full_name, validation.data.content).catch(() => {});

    return ok(message, { message: "Pesan terkirim." });
  } catch (error) {
    return handleError(error);
  }
}

// Fungsi bantu: kirim notifikasi ke lawan bicara
async function notifyOtherParticipant(
  conversationId: string,
  senderId: string,
  senderName: string,
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
  const preview = content.length > 60 ? `${content.slice(0, 60)}...` : content;

  await createNotification({
    user_id: recipientId,
    type: "marketplace",
    title: "Pesan Baru",
    message: `${senderName}: "${preview}"`,
    action_url: `/pesan/${conversationId}`,
    data: { conversation_id: conversationId },
  });
}
