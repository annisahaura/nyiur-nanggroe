import { z } from "zod";

export const createReviewSchema = z.object({
  product_id: z.string().uuid("Product ID tidak valid"),
  order_id: z.string().uuid("Order ID tidak valid").optional(),
  rating: z.number().int().min(1, "Rating minimal 1").max(5, "Rating maksimal 5"),
  comment: z.string().min(10, "Ulasan minimal 10 karakter").max(2000).optional(),
  images: z.array(z.string().url()).max(5, "Maksimal 5 foto").default([]),
});

export const updateReviewSchema = z.object({
  rating: z.number().int().min(1).max(5).optional(),
  comment: z.string().min(10).max(2000).optional(),
  images: z.array(z.string().url()).max(5).optional(),
});

export type CreateReviewInput = z.infer<typeof createReviewSchema>;
export type UpdateReviewInput = z.infer<typeof updateReviewSchema>;
