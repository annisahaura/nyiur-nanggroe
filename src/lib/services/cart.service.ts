import {
  getCartWithItems,
  addCartItem,
  updateCartItemQuantity,
  removeCartItem,
  clearCart,
  getCartItemOwner,
} from "@/lib/repositories/cart.repository";
import { createRouteClient } from "@/lib/utils/auth-helpers";

export { clearCart };

export async function getUserCart(userId: string) {
  return getCartWithItems(userId);
}

export async function addToCart(userId: string, productId: string, quantity: number) {
  const supabase = await createRouteClient();

  // Validate product exists and has stock
  const { data: product, error } = await supabase
    .from("products")
    .select("id, price, stock, name, is_active")
    .eq("id", productId)
    .eq("is_active", true)
    .single();

  if (error || !product) throw new Error("PRODUCT_NOT_FOUND");
  if (product.stock < quantity) throw new Error(`INSUFFICIENT_STOCK:${product.name}`);

  return addCartItem(userId, productId, quantity, product.price);
}

export async function updateCartItem(userId: string, itemId: string, quantity: number) {
  const owner = await getCartItemOwner(itemId);
  if (owner !== userId) throw new Error("FORBIDDEN");

  return updateCartItemQuantity(itemId, quantity);
}

export async function removeFromCart(userId: string, itemId: string) {
  const owner = await getCartItemOwner(itemId);
  if (owner !== userId) throw new Error("FORBIDDEN");

  return removeCartItem(itemId);
}

export async function getCartTotal(userId: string) {
  const { items } = await getCartWithItems(userId);

  const subtotal = items.reduce((sum: number, item: any) => {
    return sum + (item.price_snapshot * item.quantity);
  }, 0);

  return { items, subtotal, item_count: items.length };
}
