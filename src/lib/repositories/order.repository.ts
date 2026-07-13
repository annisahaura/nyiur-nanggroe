import { createRouteClient } from "@/lib/utils/auth-helpers";
import { parsePaginationParams, toRange, buildPaginationMeta } from "@/lib/utils/pagination";
import type { Order, OrderItem } from "@/types";
import type { CheckoutInput, UpdateOrderStatusInput } from "@/lib/validators/order.schema";

const ORDER_SELECT = `
  id, order_number, buyer_id, store_id, status, payment_status, payment_method,
  subtotal, shipping_cost, platform_fee, total, notes, shipping_address,
  tracking_number, cancelled_reason, created_at, updated_at,
  items:order_items(
    id, order_id, product_id, quantity, price, subtotal, product_snapshot,
    product:products(id, name, slug, images:product_images(url, is_primary))
  ),
  store:seller_profiles(id, name, slug, logo_url)
`;

export interface CartItemForOrder {
  product_id: string;
  quantity: number;
  price: number;
  name: string;
  store_id: string;
}

export async function createOrder(
  buyerId: string,
  storeId: string,
  items: CartItemForOrder[],
  input: CheckoutInput
) {
  const supabase = await createRouteClient();

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const shipping_cost = 0;                         // calculated later via shipping API
  const platform_fee = Math.round(subtotal * 0.02); // 2% platform fee
  const total = subtotal + shipping_cost + platform_fee;

  // Insert order
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      buyer_id: buyerId,
      store_id: storeId,
      status: "pending",
      payment_status: "pending",
      payment_method: input.payment_method,
      subtotal,
      shipping_cost,
      platform_fee,
      total,
      notes: input.notes,
      shipping_address: input.shipping_address,
    })
    .select("id, order_number")
    .single();

  if (orderError) throw orderError;

  // Insert order items
  const orderItems = items.map((item) => ({
    order_id: order.id,
    product_id: item.product_id,
    quantity: item.quantity,
    price: item.price,
    subtotal: item.price * item.quantity,
    product_snapshot: { name: item.name },
  }));

  const { error: itemsError } = await supabase.from("order_items").insert(orderItems);
  if (itemsError) throw itemsError;

  // Decrement stock for each product
  for (const item of items) {
    await supabase.rpc("decrement_stock", {
      product_id: item.product_id,
      qty: item.quantity,
    });
  }

  return order;
}

export async function findOrdersByBuyer(buyerId: string, page = 1, per_page = 10) {
  const supabase = await createRouteClient();
  const pagination = parsePaginationParams(
    new URLSearchParams({ page: String(page), per_page: String(per_page) })
  );
  const { from, to } = toRange(pagination);

  const { data, count, error } = await supabase
    .from("orders")
    .select(ORDER_SELECT, { count: "exact" })
    .eq("buyer_id", buyerId)
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) throw error;
  return { data: (data ?? []) as unknown as Order[], meta: buildPaginationMeta(count ?? 0, pagination) };
}

export async function findOrdersByStore(storeId: string, page = 1, per_page = 20) {
  const supabase = await createRouteClient();
  const pagination = parsePaginationParams(
    new URLSearchParams({ page: String(page), per_page: String(per_page) })
  );
  const { from, to } = toRange(pagination);

  const { data, count, error } = await supabase
    .from("orders")
    .select(ORDER_SELECT, { count: "exact" })
    .eq("store_id", storeId)
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) throw error;
  return { data: (data ?? []) as unknown as Order[], meta: buildPaginationMeta(count ?? 0, pagination) };
}

export async function findOrderById(orderId: string) {
  const supabase = await createRouteClient();

  const { data, error } = await supabase
    .from("orders")
    .select(ORDER_SELECT)
    .eq("id", orderId)
    .single();

  if (error) return null;
  return data as unknown as Order;
}

export async function updateOrderStatus(orderId: string, input: UpdateOrderStatusInput) {
  const supabase = await createRouteClient();

  const { data, error } = await supabase
    .from("orders")
    .update({
      status: input.status,
      ...(input.tracking_number && { tracking_number: input.tracking_number }),
      ...(input.cancelled_reason && { cancelled_reason: input.cancelled_reason }),
    })
    .eq("id", orderId)
    .select("id, status, order_number, buyer_id, store_id")
    .single();

  if (error) throw error;
  return data;
}
