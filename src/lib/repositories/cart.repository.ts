import { createRouteClient } from "@/lib/utils/auth-helpers";

const CART_ITEM_SELECT = `
  id, cart_id, product_id, quantity, price_snapshot, created_at, updated_at,
  product:products(
    id, name, slug, price, stock, unit, is_active,
    store:seller_profiles(id, name, slug),
    images:product_images(url, is_primary)
  )
`;

export async function getOrCreateCart(userId: string) {
  const supabase = await createRouteClient();

  // Try to get existing cart
  let { data: cart } = await supabase
    .from("carts")
    .select("id")
    .eq("user_id", userId)
    .single();

  // Create if not exists (shouldn't be needed due to trigger, but defensive)
  if (!cart) {
    const { data: newCart, error } = await supabase
      .from("carts")
      .insert({ user_id: userId })
      .select("id")
      .single();
    if (error) throw error;
    cart = newCart;
  }

  return cart!;
}

export async function getCartWithItems(userId: string) {
  const supabase = await createRouteClient();

  const cart = await getOrCreateCart(userId);

  const { data: items, error } = await supabase
    .from("cart_items")
    .select(CART_ITEM_SELECT)
    .eq("cart_id", cart.id)
    .order("created_at", { ascending: true });

  if (error) throw error;

  return { cart_id: cart.id, items: items ?? [] };
}

export async function addCartItem(
  userId: string,
  productId: string,
  quantity: number,
  price: number
) {
  const supabase = await createRouteClient();
  const cart = await getOrCreateCart(userId);

  // Upsert: if item exists, increase quantity
  const { data: existing } = await supabase
    .from("cart_items")
    .select("id, quantity")
    .eq("cart_id", cart.id)
    .eq("product_id", productId)
    .single();

  if (existing) {
    const { data, error } = await supabase
      .from("cart_items")
      .update({ quantity: existing.quantity + quantity })
      .eq("id", existing.id)
      .select(CART_ITEM_SELECT)
      .single();
    if (error) throw error;
    return data;
  }

  const { data, error } = await supabase
    .from("cart_items")
    .insert({ cart_id: cart.id, product_id: productId, quantity, price_snapshot: price })
    .select(CART_ITEM_SELECT)
    .single();

  if (error) throw error;
  return data;
}

export async function updateCartItemQuantity(itemId: string, quantity: number) {
  const supabase = await createRouteClient();

  const { data, error } = await supabase
    .from("cart_items")
    .update({ quantity })
    .eq("id", itemId)
    .select(CART_ITEM_SELECT)
    .single();

  if (error) throw error;
  return data;
}

export async function removeCartItem(itemId: string) {
  const supabase = await createRouteClient();

  const { error } = await supabase.from("cart_items").delete().eq("id", itemId);
  if (error) throw error;
}

export async function clearCart(userId: string) {
  const supabase = await createRouteClient();
  const cart = await getOrCreateCart(userId);

  const { error } = await supabase.from("cart_items").delete().eq("cart_id", cart.id);
  if (error) throw error;
}

export async function getCartItemOwner(itemId: string): Promise<string | null> {
  const supabase = await createRouteClient();

  const { data } = await supabase
    .from("cart_items")
    .select("cart:carts(user_id)")
    .eq("id", itemId)
    .single();

  return (data?.cart as any)?.user_id ?? null;
}
