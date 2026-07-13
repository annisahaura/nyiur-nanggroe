"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ThumbsUp, ChevronDown, Camera, Star, ShieldCheck } from "lucide-react";
import { cn, formatRelativeTime } from "@/lib/utils";
import { StarRating } from "@/components/ui/StarRating";
import type { Review } from "@/types";

interface ReviewSectionProps {
  reviews: Review[];
  rating: number;
  reviewCount: number;
  productName: string;
}

const RATING_DISTRIBUTION = [5, 4, 3, 2, 1];

export function ReviewSection({ reviews, rating, reviewCount, productName }: ReviewSectionProps) {
  const [showAll, setShowAll] = useState(false);
  const [filter, setFilter] = useState(0);

  const distribution = RATING_DISTRIBUTION.map((star) => ({
    star,
    count: Math.round(reviewCount * (star === 5 ? 0.6 : star === 4 ? 0.25 : star === 3 ? 0.1 : 0.03)),
  }));

  const filteredReviews = filter
    ? reviews.filter((r) => r.rating === filter)
    : reviews;
  const displayedReviews = showAll ? filteredReviews : filteredReviews.slice(0, 3);

  return (
    <section aria-label="Ulasan produk">
      <h2 className="text-xl font-bold text-charcoal-800 mb-6">
        Ulasan Pembeli
      </h2>

      {/* Rating summary */}
      <div className="flex flex-col sm:flex-row gap-8 p-6 bg-white rounded-2xl border border-border/60 mb-6">
        {/* Overall rating */}
        <div className="flex flex-col items-center justify-center text-center sm:w-40 flex-shrink-0">
          <div className="text-5xl font-display font-bold text-charcoal-800 mb-1">
            {rating.toFixed(1)}
          </div>
          <StarRating rating={rating} size="md" className="justify-center mb-1" />
          <p className="text-sm text-charcoal-500">{reviewCount.toLocaleString("id-ID")} ulasan</p>
        </div>

        {/* Distribution bars */}
        <div className="flex-1 space-y-2">
          {distribution.map(({ star, count }) => {
            const pct = reviewCount > 0 ? Math.round((count / reviewCount) * 100) : 0;
            return (
              <button
                key={star}
                onClick={() => setFilter(filter === star ? 0 : star)}
                className={cn(
                  "w-full flex items-center gap-3 group",
                  filter === star ? "opacity-100" : "opacity-80 hover:opacity-100"
                )}
              >
                <div className="flex items-center gap-1 w-12 flex-shrink-0">
                  <Star className="w-3 h-3 fill-amber text-amber" />
                  <span className="text-xs font-medium text-charcoal-600">{star}</span>
                </div>
                <div className="flex-1 h-2 bg-charcoal-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.8, delay: 0.1 * (5 - star) }}
                    className={cn(
                      "h-full rounded-full",
                      filter === star ? "bg-forest-500" : "bg-amber"
                    )}
                  />
                </div>
                <span className="text-xs text-charcoal-400 w-8 flex-shrink-0">{pct}%</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter chips */}
      <div className="flex items-center gap-2 flex-wrap mb-5">
        <span className="text-sm text-charcoal-500 flex-shrink-0">Filter:</span>
        <button
          onClick={() => setFilter(0)}
          className={cn(
            "px-3 py-1.5 rounded-full text-xs font-medium transition-all",
            filter === 0
              ? "bg-forest-600 text-white"
              : "bg-white border border-border text-charcoal-600 hover:bg-mist"
          )}
        >
          Semua
        </button>
        {[5, 4, 3].map((star) => (
          <button
            key={star}
            onClick={() => setFilter(filter === star ? 0 : star)}
            className={cn(
              "flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-all",
              filter === star
                ? "bg-forest-600 text-white"
                : "bg-white border border-border text-charcoal-600 hover:bg-mist"
            )}
          >
            <Star className="w-3 h-3" />
            {star} Bintang
          </button>
        ))}
        <button
          onClick={() => setFilter(-1)}
          className={cn(
            "flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-all",
            filter === -1
              ? "bg-forest-600 text-white"
              : "bg-white border border-border text-charcoal-600 hover:bg-mist"
          )}
        >
          <Camera className="w-3 h-3" />
          Dengan Foto
        </button>
      </div>

      {/* Review cards */}
      {displayedReviews.length === 0 ? (
        <div className="text-center py-12 text-charcoal-400 text-sm">
          Belum ada ulasan untuk filter ini
        </div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {displayedReviews.map((review, i) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white rounded-2xl border border-border/60 p-5"
              >
                {/* Reviewer info */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-forest-100 flex items-center justify-center font-bold text-forest-700 text-sm flex-shrink-0">
                      {review.profile?.full_name?.charAt(0).toUpperCase() ?? "U"}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-charcoal-800">
                          {review.profile?.full_name}
                        </p>
                        {review.is_verified_purchase && (
                          <span className="flex items-center gap-0.5 text-[10px] text-moss-600 font-medium">
                            <ShieldCheck className="w-3 h-3" />
                            Verified
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-charcoal-400">
                        {review.profile?.location} · {formatRelativeTime(review.created_at)}
                      </p>
                    </div>
                  </div>
                  <StarRating rating={review.rating} size="xs" />
                </div>

                {/* Comment */}
                <p className="text-sm text-charcoal-700 leading-relaxed mb-3">
                  {review.comment}
                </p>

                {/* Review images */}
                {review.images.length > 0 && (
                  <div className="flex gap-2 mb-3">
                    {review.images.map((img, i) => (
                      <div key={i} className="relative w-16 h-16 rounded-xl overflow-hidden border border-border/40">
                        <Image
                          src={img}
                          alt="Foto ulasan"
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* Helpful */}
                <button className="flex items-center gap-1.5 text-xs text-charcoal-400 hover:text-charcoal-600 transition-colors">
                  <ThumbsUp className="w-3.5 h-3.5" />
                  Membantu ({review.helpful_count})
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Show more / less */}
      {filteredReviews.length > 3 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="w-full mt-4 flex items-center justify-center gap-2 py-3 border border-border rounded-xl text-sm font-medium text-charcoal-600 hover:bg-mist transition-colors"
        >
          {showAll ? (
            <>Tampilkan Lebih Sedikit</>
          ) : (
            <>
              Lihat Semua {filteredReviews.length} Ulasan
              <ChevronDown className="w-4 h-4" />
            </>
          )}
        </button>
      )}
    </section>
  );
}
