"use client";

import { cn } from "@/lib/utils";

interface SkeletonCardProps {
  className?: string;
}

export function SkeletonCard({ className }: SkeletonCardProps) {
  return (
    <div className={cn("bg-white rounded-2xl border border-border/40 overflow-hidden", className)}>
      {/* Image skeleton */}
      <div className="skeleton aspect-square w-full" />
      
      {/* Content skeleton */}
      <div className="p-4 space-y-3">
        {/* Store name */}
        <div className="skeleton h-3 w-24 rounded-full" />
        
        {/* Product name */}
        <div className="space-y-1.5">
          <div className="skeleton h-4 w-full rounded-full" />
          <div className="skeleton h-4 w-3/4 rounded-full" />
        </div>
        
        {/* Rating */}
        <div className="flex items-center gap-2">
          <div className="skeleton h-3.5 w-20 rounded-full" />
          <div className="skeleton h-3 w-12 rounded-full" />
        </div>
        
        {/* Price */}
        <div className="skeleton h-5 w-28 rounded-full" />
        
        {/* Button */}
        <div className="skeleton h-9 w-full rounded-xl" />
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }, (_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
