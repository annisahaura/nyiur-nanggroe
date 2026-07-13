import { z } from "zod";

// ============================================================
// VALIDATOR EDUKASI
// ============================================================

const KATEGORI_ARTIKEL = [
  "coconut_products",
  "circular_economy",
  "farming_tips",
  "business_guide",
  "environment",
  "technology",
] as const;

export const articleFilterSchema = z.object({
  q: z.string().max(200).optional(),
  category: z.enum(KATEGORI_ARTIKEL).optional(),
  tag: z.string().max(50).optional(),
  is_featured: z.coerce.boolean().optional(),
  page: z.coerce.number().int().positive().default(1),
  per_page: z.coerce.number().int().positive().max(50).default(12),
});

export const videoFilterSchema = z.object({
  q: z.string().max(200).optional(),
  category: z.enum(KATEGORI_ARTIKEL).optional(),
  page: z.coerce.number().int().positive().default(1),
  per_page: z.coerce.number().int().positive().max(50).default(12),
});

export const quizSubmitSchema = z.object({
  answers: z
    .array(z.number().int().min(0).max(10))
    .min(1, "Harus menjawab minimal 1 pertanyaan")
    .max(50),
});

export const createArticleSchema = z.object({
  title: z.string().min(5, "Judul minimal 5 karakter").max(200),
  slug: z
    .string()
    .min(3)
    .max(200)
    .regex(/^[a-z0-9-]+$/, "Slug hanya huruf kecil, angka, dan tanda hubung"),
  excerpt: z.string().max(500).optional(),
  content: z.string().min(100, "Konten minimal 100 karakter"),
  cover_image: z.string().url().optional(),
  category: z.enum(KATEGORI_ARTIKEL),
  tags: z.array(z.string().max(50)).max(10).default([]),
  read_time: z.number().int().positive().default(5),
  is_published: z.boolean().default(false),
  is_featured: z.boolean().default(false),
});

export const bookmarkToggleSchema = z.object({
  article_id: z.string().uuid("Article ID tidak valid"),
});

export type ArticleFilterInput = z.infer<typeof articleFilterSchema>;
export type VideoFilterInput = z.infer<typeof videoFilterSchema>;
export type QuizSubmitInput = z.infer<typeof quizSubmitSchema>;
export type CreateArticleInput = z.infer<typeof createArticleSchema>;
export type BookmarkToggleInput = z.infer<typeof bookmarkToggleSchema>;
