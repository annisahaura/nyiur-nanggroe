import { createRouteClient } from "@/lib/utils/auth-helpers";

// ============================================================
// PAYMENT ABSTRACTION LAYER
// Supports: dummy (now), midtrans, xendit (future)
// ============================================================

export type PaymentMethod = "dummy" | "qris" | "midtrans" | "xendit" | "bank_transfer" | "e_wallet";

export interface PaymentResult {
  payment_id: string;
  token?: string;
  redirect_url?: string;
  expires_at?: string;
  status: "pending" | "paid";
}

// ============================================================
// INITIATE PAYMENT
// ============================================================

export async function initiatePayment(
  orderId: string,
  method: PaymentMethod,
  orderData: { total: number }
): Promise<PaymentResult> {
  switch (method) {
    case "dummy":
      return initiateDummyPayment(orderId, orderData.total);
    case "midtrans":
      return initiateMidtransPayment(orderId, orderData.total);
    // Future: xendit, qris, etc.
    default:
      return initiateDummyPayment(orderId, orderData.total);
  }
}

// ============================================================
// DUMMY PAYMENT (development / testing)
// ============================================================

async function initiateDummyPayment(orderId: string, amount: number): Promise<PaymentResult> {
  const supabase = await createRouteClient();

  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

  const { data, error } = await supabase
    .from("payments")
    .insert({
      order_id: orderId,
      method: "dummy",
      status: "paid",              // Auto-pay for demo
      amount,
      paid_at: new Date().toISOString(),
      expires_at: expiresAt,
      gateway_payload: { provider: "dummy", note: "Auto-approved for development" },
    })
    .select("id")
    .single();

  if (error) throw error;

  // Update order payment status
  await supabase
    .from("orders")
    .update({ payment_status: "paid", status: "confirmed" })
    .eq("id", orderId);

  return {
    payment_id: data.id,
    status: "paid",
    expires_at: expiresAt,
  };
}

// ============================================================
// MIDTRANS (placeholder — wire up when credentials available)
// ============================================================

async function initiateMidtransPayment(orderId: string, amount: number): Promise<PaymentResult> {
  // TODO: Integrate Midtrans Snap API
  // const snap = new midtransClient.Snap({ serverKey: process.env.MIDTRANS_SERVER_KEY! });
  // const token = await snap.createTransaction({ ... });

  // Fallback to dummy for now
  console.warn("[Payment] Midtrans not yet configured, falling back to dummy");
  return initiateDummyPayment(orderId, amount);
}

// ============================================================
// HANDLE WEBHOOK
// ============================================================

export async function handlePaymentWebhook(payload: Record<string, unknown>) {
  const supabase = await createRouteClient();

  const orderId = payload.order_id as string;
  const transactionStatus = payload.transaction_status as string;
  const gatewayRef = payload.transaction_id as string;

  let paymentStatus: "paid" | "failed" | "expired" | "refunded" = "failed";
  let orderStatus: "confirmed" | "cancelled" | null = null;

  if (["capture", "settlement"].includes(transactionStatus)) {
    paymentStatus = "paid";
    orderStatus = "confirmed";
  } else if (["deny", "cancel", "failure"].includes(transactionStatus)) {
    paymentStatus = "failed";
    orderStatus = "cancelled";
  } else if (transactionStatus === "expire") {
    paymentStatus = "expired";
    orderStatus = "cancelled";
  } else if (transactionStatus === "refund") {
    paymentStatus = "refunded";
  }

  // Update payment record
  await supabase
    .from("payments")
    .update({
      status: paymentStatus,
      gateway_ref: gatewayRef,
      gateway_payload: payload,
      ...(paymentStatus === "paid" && { paid_at: new Date().toISOString() }),
    })
    .eq("order_id", orderId);

  // Update order
  if (orderStatus) {
    await supabase
      .from("orders")
      .update({ payment_status: paymentStatus, status: orderStatus })
      .eq("id", orderId);
  }

  return { processed: true };
}

// ============================================================
// VERIFY PAYMENT STATUS
// ============================================================

export async function verifyPayment(orderId: string) {
  const supabase = await createRouteClient();

  const { data } = await supabase
    .from("payments")
    .select("id, status, amount, method, paid_at, expires_at")
    .eq("order_id", orderId)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  return data;
}
