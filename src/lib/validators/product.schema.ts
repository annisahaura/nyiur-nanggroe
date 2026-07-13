import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string().min(5, "Nama produk minimal 5 karakter").max(200),
  slug: z
    .string()
    .min(3)
    .max(200)
    .regex(/^[a-z0-9-]+$/, "Slug hanya huruf kecil, angka, dan tanda hubung")
    .optional(),
  description: z.string().min(20, "Deskripsi minimal 20 karakter").max(10000),
  short_description: z.string().max(500).optional(),
  category_id: z.string().uuid("Category ID tidak valid"),
  price: z.number().positive("Harga harus lebih dari 0").max(999_999_999),
  min_price: z.number().positive().optional(),
  max_price: z.number().positive().optional(),
  stock: z.number().int().min(0, "Stok tidak boleh negatif"),
  min_order: z.number().int().positive().default(1),
  unit: z.string().min(1).max(20).default("pcs"),
  weight: z.number().positive().optional(),       // grams
  length: z.number().positive().optional(),        // cm
  width: z.number().positive().optional(),
  height: z.number().positive().optional(),
  location: z.string().max(200).optional(),
  province: z.string().max(100).optional(),
  is_eco_certified: z.boolean().default(false),
  tags: z.array(z.string().max(50)).max(10).default([]),
  co2_saved: z.number().positive().optional(),
  waste_diverted: z.number().positive().optional(),
});

export const updateProductSchema = createProductSchema.partial().omit({ slug: true });

export const productFilterSchema = z.object({
  q: z.string().max(200).optional(),
  category: z.string().optional(),
  province: z.string().optional(),
  min_price: z.coerce.number().positive().optional(),
  max_price: z.coerce.number().positive().optional(),
  is_eco_certified: z.coerce.boolean().optional(),
  is_featured: z.coerce.boolean().optional(),
  sort: z
    .enum(["relevance", "newest", "price_asc", "price_desc", "rating", "popular"])
    .default("newest"),
  page: z.coerce.number().int().positive().default(1),
  per_page: z.coerce.number().int().positive().max(100).default(20),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type ProductFilterInput = z.infer<typeof productFilterSchema>;
