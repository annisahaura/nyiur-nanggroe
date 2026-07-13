import { NextRequest, NextResponse } from "next/server";
import { handlePaymentWebhook } from "@/lib/services/payment.service";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Process payment webhook payload
    const result = await handlePaymentWebhook(body);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error("[Payment Webhook Error]", error);
    // Return 200/204 to payment gateway to stop retrying, but log internal error
    return NextResponse.json({ processed: false, error: "Internal processing error" }, { status: 200 });
  }
}
