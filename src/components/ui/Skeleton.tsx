"use client";

import { cn } from "@/lib/utils";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "line" | "circle" | "rect";
}

export function Skeleton({
  className,
  variant = "rect",
  ...props
}: SkeletonProps) {
  return (
    <div
      className={cn(
        "skeleton",
        variant === "line" && "h-4 w-full rounded-full",
        variant === "circle" && "rounded-full shrink-0",
        variant === "rect" && "rounded-xl",
        className
      )}
      {...props}
    />
  );
}
