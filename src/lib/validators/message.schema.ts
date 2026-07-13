import { z } from "zod";

// ============================================================
// VALIDATOR PESAN
// ============================================================

export const sendMessageSchema = z.object({
  content: z
    .string()
    .min(1, "Pesan tidak boleh kosong")
    .max(2000, "Pesan maksimal 2000 karakter"),
});

export const startConversationSchema = z.object({
  seller_id: z.string().uuid("ID Penjual tidak valid"),
  product_id: z.string().uuid("ID Produk tidak valid").optional(),
  initial_message: z.string().min(1).max(2000).optional(),
});

export const messageFilterSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  per_page: z.coerce.number().int().positive().max(100).default(30),
});

export type SendMessageInput = z.infer<typeof sendMessageSchema>;
export type StartConversationInput = z.infer<typeof startConversationSchema>;
export type MessageFilterInput = z.infer<typeof messageFilterSchema>;
