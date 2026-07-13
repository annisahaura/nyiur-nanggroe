"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "@/types";

export interface CartItem {
  product: Product;
  quantity: number;
  note?: string;
}

interface CartStore {
  items: CartItem[];
  voucher: string | null;
  voucherDiscount: number;

  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  removeItems: (productIds: string[]) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  applyVoucher: (code: string) => boolean;
  removeVoucher: () => void;

  // Computed
  totalItems: () => number;
  subtotal: () => number;
  total: () => number;
}

const VALID_VOUCHERS: Record<string, number> = {
  NYIUR10: 10,
  KELAPA15: 15,
  HIJAU20: 20,
  MITRA5: 5,
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      voucher: null,
      voucherDiscount: 0,

      addItem: (product, quantity = 1) => {
        set((state) => {
          const existing = state.items.find((i) => i.product.id === product.id);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.product.id === product.id
                  ? { ...i, quantity: Math.min(i.quantity + quantity, product.stock) }
                  : i
              ),
            };
          }
          return {
            items: [...state.items, { product, quantity: Math.min(quantity, product.stock) }],
          };
        });
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((i) => i.product.id !== productId),
        }));
      },

      removeItems: (productIds) => {
        set((state) => ({
          items: state.items.filter((i) => !productIds.includes(i.product.id)),
        }));
      },

      updateQuantity: (productId, quantity) => {
        set((state) => {
          if (quantity <= 0) {
            return { items: state.items.filter((i) => i.product.id !== productId) };
          }
          return {
            items: state.items.map((i) =>
              i.product.id === productId
                ? { ...i, quantity: Math.min(quantity, i.product.stock) }
                : i
            ),
          };
        });
      },

      clearCart: () => set({ items: [], voucher: null, voucherDiscount: 0 }),

      applyVoucher: (code) => {
        const upperCode = code.toUpperCase().trim();
        const discount = VALID_VOUCHERS[upperCode];
        if (discount) {
          set({ voucher: upperCode, voucherDiscount: discount });
          return true;
        }
        return false;
      },

      removeVoucher: () => set({ voucher: null, voucherDiscount: 0 }),

      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

      subtotal: () =>
        get().items.reduce((sum, i) => sum + i.product.price * i.quantity, 0),

      total: () => {
        const sub = get().subtotal();
        const disc = get().voucherDiscount;
        const shipping = 15000;
        const platformFee = Math.round(sub * 0.02);
        const discountAmount = Math.round(sub * (disc / 100));
        return sub + shipping + platformFee - discountAmount;
      },
    }),
    {
      name: "nyiur-cart",
      version: 1,
    }
  )
);
