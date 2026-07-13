import { createRouteClient } from "@/lib/utils/auth-helpers";
import { parsePaginationParams, toRange, buildPaginationMeta } from "@/lib/utils/pagination";
import type { CreateReviewInput, UpdateReviewInput } from "@/lib/validators/review.schema";

const REVIEW_SELECT = `
  id, product_id, user_id, order_id, rating, comment, is_verified_purchase,
  helpful_count, created_at, updated_at,
  profile:profiles(id, full_name, avatar_url),
  images:review_images(id, url)
`;

export async function getProductReviews(productId: string, page = 1, per_page = 10) {
  const supabase = await createRouteClient();
  const pagination = parsePaginationParams(
    new URLSearchParams({ page: String(page), per_page: String(per_page) })
  );
  const { from, to } = toRange(pagination);

  const { data, count, error } = await supabase
    .from("reviews")
    .select(REVIEW_SELECT, { count: "exact" })
    .eq("product_id", productId)
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) throw error;

  return {
    data: data ?? [],
    meta: buildPaginationMeta(count ?? 0, pagination),
  };
}

export async function createProductReview(userId: string, input: CreateReviewInput) {
  const supabase = await createRouteClient();

  // Verify if it's a verified purchase
  let isVerifiedPurchase = false;
  if (input.order_id) {
    const { data: order } = await supabase
      .from("orders")
      .select("id, status")
      .eq("id", input.order_id)
      .eq("buyer_id", userId)
      .eq("status", "delivered")
      .single();

    if (order) {
      // Check if product is in order
      const { data: orderItem } = await supabase
        .from("order_items")
        .select("id")
        .eq("order_id", order.id)
        .eq("product_id", input.product_id)
        .single();

      if (orderItem) {
        isVerifiedPurchase = true;
      }
    }
  }

  // Insert review
  const { data: review, error } = await supabase
    .from("reviews")
    .insert({
      product_id: input.product_id,
      user_id: userId,
      order_id: input.order_id || null,
      rating: input.rating,
      comment: input.comment || null,
      is_verified_purchase: isVerifiedPurchase,
    })
    .select("id")
    .single();

  if (error) {
    if (error.message.includes("unique_product_user_order") || error.message.includes("duplicate key")) {
      throw new Error("REVIEW_ALREADY_EXISTS");
    }
    throw error;
  }

  // Insert review images if any
  if (input.images && input.images.length > 0) {
    const reviewImages = input.images.map((url, i) => ({
      review_id: review.id,
      url,
      sort_order: i,
    }));
    await supabase.from("review_images").insert(reviewImages);
  }

  // Retrieve complete review with profile and images
  const { data: completeReview } = await supabase
    .from("reviews")
    .select(REVIEW_SELECT)
    .eq("id", review.id)
    .single();

  return completeReview;
}

export async function markReviewHelpful(reviewId: string) {
  const supabase = await createRouteClient();

  // Increment helpful count directly in database
  const { data, error } = await supabase.rpc("increment_review_helpful", {
    rev_id: reviewId,
  });

  if (error) {
    // If RPC doesn't exist, we can fallback to standard query
    const { data: review } = await supabase
      .from("reviews")
      .select("helpful_count")
      .eq("id", reviewId)
      .single();

    if (review) {
      const { data: updated } = await supabase
        .from("reviews")
        .update({ helpful_count: (review.helpful_count || 0) + 1 })
        .eq("id", reviewId)
        .select("id, helpful_count")
        .single();
      return updated;
    }
    throw error;
  }

  return data;
}
