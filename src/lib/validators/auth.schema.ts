import { z } from "zod";

export const registerSchema = z.object({
  full_name: z.string().min(2, "Nama minimal 2 karakter").max(100),
  email: z.string().email("Format email tidak valid"),
  password: z
    .string()
    .min(8, "Kata sandi minimal 8 karakter")
    .regex(/[A-Z]/, "Harus ada huruf kapital")
    .regex(/[0-9]/, "Harus ada angka"),
  phone: z.string().min(9, "Nomor telepon tidak valid").max(15).optional(),
  province: z.string().max(100).optional(),
  city: z.string().max(100).optional(),
  country: z.string().default("Indonesia"),
});

export const loginSchema = z.object({
  email: z.string().email("Format email tidak valid"),
  password: z.string().min(1, "Kata sandi wajib diisi"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Format email tidak valid"),
});

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Kata sandi minimal 8 karakter")
      .regex(/[A-Z]/, "Harus ada huruf kapital")
      .regex(/[0-9]/, "Harus ada angka"),
    confirm_password: z.string(),
  })
  .refine((d) => d.password === d.confirm_password, {
    message: "Kata sandi tidak cocok",
    path: ["confirm_password"],
  });

export const updateProfileSchema = z.object({
  full_name: z.string().min(2).max(100).optional(),
  username: z
    .string()
    .min(3)
    .max(30)
    .regex(/^[a-z0-9_]+$/, "Username hanya boleh huruf kecil, angka, dan underscore")
    .optional(),
  bio: z.string().max(500).optional(),
  phone: z.string().max(15).optional(),
  location: z.string().max(200).optional(),
  province: z.string().max(100).optional(),
  city: z.string().max(100).optional(),
  avatar_url: z.string().url().optional(),
});

export const createSellerSchema = z.object({
  name: z.string().min(3, "Nama toko minimal 3 karakter").max(100),
  slug: z
    .string()
    .min(3)
    .max(60)
    .regex(/^[a-z0-9-]+$/, "Slug hanya boleh huruf kecil, angka, dan tanda hubung"),
  description: z.string().min(20, "Deskripsi minimal 20 karakter").max(2000).optional(),
  location: z.string().max(200).optional(),
  province: z.string().max(100).optional(),
  city: z.string().max(100).optional(),
  whatsapp: z.string().max(20).optional(),
  instagram: z.string().max(100).optional(),
  website: z.string().url().optional().or(z.literal("")),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type CreateSellerInput = z.infer<typeof createSellerSchema>;
