import { createRouteClient } from "@/lib/utils/auth-helpers";
import {
  createOrder,
  findOrdersByBuyer,
  findOrderById,
  updateOrderStatus,
} from "@/lib/repositories/order.repository";
import { getCartWithItems, clearCart } from "@/lib/repositories/cart.repository";
import { createNotification } from "@/lib/repositories/notification.repository";
import { initiatePayment } from "./payment.service";
import type { CheckoutInput, UpdateOrderStatusInput } from "@/lib/validators/order.schema";

export { findOrdersByBuyer, findOrderById };

export async function checkout(userId: string, input: CheckoutInput) {
  const supabase = await createRouteClient();

  let items: any[];
  let cameFromServerCart = false;

  if (input.items && input.items.length > 0) {
    // Checkout with an explicit, caller-provided item selection (e.g. user
    // only ticked 1-2 products in their cart instead of everything).
    const productIds = input.items.map((i) => i.product_id);
    const { data: products, error: productsError } = await supabase
      .from("products")
      .select("id, name, price, stock, store_id")
      .in("id", productIds);

    if (productsError) throw productsError;

    items = input.items.map((i) => {
      const product = products?.find((p) => p.id === i.product_id);
      if (!product) throw new Error("INVALID_CART");
      return {
        product_id: i.product_id,
        quantity: i.quantity,
        price_snapshot: product.price,
        product: { id: product.id, name: product.name, store: { id: product.store_id } },
      };
    });
  } else {
    // Fall back to whatever is in the server-side cart table.
    const cart = await getCartWithItems(userId);
    items = cart.items;
    cameFromServerCart = true;
    if (!items.length) throw new Error("CART_EMPTY");
  }

  if (!items.length) throw new Error("CART_EMPTY");

  // This marketplace currently creates one order per checkout, so all
  // selected items must belong to the same store. Fail loudly with a clear
  // message instead of silently checking out only the first store's items.
  const storeIds = new Set(items.map((item: any) => item.product?.store?.id));
  if (storeIds.size > 1) {
    throw new Error("MULTI_STORE_CHECKOUT");
  }

  const firstItem = items[0] as any;
  const storeId: string = firstItem.product?.store?.id;
  if (!storeId) throw new Error("INVALID_CART");

  // Validate stock for all items
  for (const item of items as any[]) {
    const { data: product } = await supabase
      .from("products")
      .select("stock, name")
      .eq("id", item.product_id)
      .single();

    if (!product || product.stock < item.quantity) {
      throw new Error(`INSUFFICIENT_STOCK:${product?.name ?? item.product_id}`);
    }
  }

  // Prepare items for order
  const orderItems = (items as any[]).map((item) => ({
    product_id: item.product_id,
    quantity: item.quantity,
    price: item.price_snapshot,
    name: item.product?.name ?? "Produk",
    store_id: storeId,
  }));

  // Create order
  const order = await createOrder(userId, storeId, orderItems, input);

  // Initiate payment
  await initiatePayment(order.id, input.payment_method, order as any);

  // Clear cart after order — only clear the server-side cart table if
  // that's actually where these items came from. If the caller sent an
  // explicit selection, the client's own cart store manages removal of
  // just those items itself.
  if (cameFromServerCart) {
    await clearCart(userId);
  }

  // Notify seller
  await notifyNewOrder(storeId, order.order_number);

  return order;
}

async function notifyNewOrder(storeId: string, orderNumber: string) {
  const supabase = await createRouteClient();

  // Get seller user_id
  const { data: store } = await supabase
    .from("seller_profiles")
    .select("owner:profiles(user_id)")
    .eq("id", storeId)
    .single();

  const sellerId = (store?.owner as any)?.user_id;
  if (!sellerId) return;

  await createNotification({
    user_id: sellerId,
    type: "order",
    title: "Pesanan Baru!",
    message: `Anda mendapat pesanan baru #${orderNumber}`,
    action_url: `/mitra/pesanan`,
    data: { order_number: orderNumber },
  });
}

export async function changeOrderStatus(
  orderId: string,
  input: UpdateOrderStatusInput,
  actorId: string,
  actorRole: string
) {
  const order = await findOrderById(orderId);
  if (!order) throw new Error("ORDER_NOT_FOUND");

  // Validate permission
  if (actorRole === "user" && order.buyer_id !== actorId) throw new Error("FORBIDDEN");

  // State machine validation
  const validTransitions: Record<string, string[]> = {
    pending: ["confirmed", "cancelled"],
    confirmed: ["processing", "cancelled"],
    processing: ["shipped", "cancelled"],
    shipped: ["delivered"],
    delivered: ["refunded"],
    cancelled: [],
    refunded: [],
  };

  if (!validTransitions[order.status]?.includes(input.status)) {
    throw new Error(`INVALID_TRANSITION:${order.status}→${input.status}`);
  }

  const updated = await updateOrderStatus(orderId, input);

  // Notify buyer of status change
  await createNotification({
    user_id: order.buyer_id,
    type: "order",
    title: "Status Pesanan Diperbarui",
    message: `Pesanan #${order.id.slice(0, 8).toUpperCase()} kini berstatus: ${input.status}`,
    action_url: `/pesanan/${orderId}`,
    data: { order_id: orderId, status: input.status },
  });

  return updated;
}
