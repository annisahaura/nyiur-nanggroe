"use client";

import { cn } from "@/lib/utils";
import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
  max?: number;
  size?: "xs" | "sm" | "md" | "lg";
  showValue?: boolean;
  className?: string;
}

const SIZE_MAP = {
  xs: "w-3 h-3",
  sm: "w-3.5 h-3.5",
  md: "w-4 h-4",
  lg: "w-5 h-5",
};

export function StarRating({
  rating,
  max = 5,
  size = "sm",
  showValue = false,
  className,
}: StarRatingProps) {
  const filledStars = Math.floor(rating);
  const partialFill = rating % 1;

  return (
    <div className={cn("flex items-center gap-0.5", className)}>
      {Array.from({ length: max }, (_, i) => {
        const filled = i < filledStars;
        const partial = i === filledStars && partialFill > 0;

        return (
          <span key={i} className="relative inline-flex">
            {/* Background star */}
            <Star
              className={cn(SIZE_MAP[size], "text-charcoal-200 fill-charcoal-200")}
              aria-hidden="true"
            />
            {/* Filled star */}
            {(filled || partial) && (
              <span
                className="absolute inset-0 overflow-hidden"
                style={{ width: filled ? "100%" : `${partialFill * 100}%` }}
              >
                <Star
                  className={cn(SIZE_MAP[size], "text-amber fill-amber")}
                  aria-hidden="true"
                />
              </span>
            )}
          </span>
        );
      })}
      {showValue && (
        <span className="text-xs font-medium text-charcoal-500 ml-0.5">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}
