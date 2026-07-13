import { z } from "zod";

const shippingAddressSchema = z.object({
  full_name: z.string().min(2, "Nama penerima wajib diisi"),
  phone: z.string().min(9, "Nomor telepon tidak valid"),
  address: z.string().min(10, "Alamat lengkap wajib diisi"),
  city: z.string().min(2, "Kota wajib diisi"),
  province: z.string().min(2, "Provinsi wajib diisi"),
  postal_code: z.string().length(5, "Kode pos harus 5 digit"),
});

export const checkoutSchema = z.object({
  shipping_address: shippingAddressSchema,
  payment_method: z
    .enum(["dummy", "qris", "midtrans", "xendit", "bank_transfer", "e_wallet"])
    .default("dummy"),
  notes: z.string().max(500).optional(),
  // Optional: checkout only these specific items (e.g. user selected just
  // 1-2 products out of their whole cart) instead of the whole cart.
  items: z
    .array(
      z.object({
        product_id: z.string().uuid("Product ID tidak valid"),
        quantity: z.number().int().positive().max(999),
      })
    )
    .min(1)
    .optional(),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum([
    "pending",
    "confirmed",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
    "refunded",
  ]),
  tracking_number: z.string().max(100).optional(),
  cancelled_reason: z.string().max(500).optional(),
});

export const addCartItemSchema = z.object({
  product_id: z.string().uuid("Product ID tidak valid"),
  quantity: z.number().int().positive("Jumlah harus lebih dari 0").max(999),
});

export const updateCartItemSchema = z.object({
  quantity: z.number().int().positive("Jumlah harus lebih dari 0").max(999),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;
export type AddCartItemInput = z.infer<typeof addCartItemSchema>;
export type UpdateCartItemInput = z.infer<typeof updateCartItemSchema>;
