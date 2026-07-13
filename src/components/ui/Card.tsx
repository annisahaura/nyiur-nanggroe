"use client";

import * as React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "glass" | "bordered" | "flat";
  hoverEffect?: "none" | "lift" | "glow" | "zoom";
  asChild?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = "default", hoverEffect = "none", ...props }, ref) => {
    const Component = "div";

    return (
      <Component
        ref={ref}
        className={cn(
          "rounded-2xl transition-all duration-300 overflow-hidden",
          // Variants
          variant === "default" && "bg-card text-card-foreground border border-border/60 shadow-sm",
          variant === "glass" && "glass dark:glass-dark shadow-glass border border-white/20 dark:border-white/5",
          variant === "bordered" && "bg-transparent text-foreground border border-border/80 dark:border-border",
          variant === "flat" && "bg-secondary/40 text-foreground border-none",
          // Hover Effects
          hoverEffect === "lift" && "hover:-translate-y-1 hover:shadow-md dark:hover:shadow-black/30",
          hoverEffect === "glow" && "hover:border-primary/40 dark:hover:border-ring/40 hover:shadow-[0_0_20px_rgba(45,106,79,0.08)] dark:hover:shadow-[0_0_20px_rgba(82,183,136,0.1)]",
          className
        )}
        {...props}
      />
    );
  }
);
Card.displayName = "Card";

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}
const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex flex-col space-y-1.5 p-6", className)}
      {...props}
    />
  )
);
CardHeader.displayName = "CardHeader";

export interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}
const CardTitle = React.forwardRef<HTMLParagraphElement, CardTitleProps>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn("font-display font-semibold text-lg leading-tight tracking-tight", className)}
      {...props}
    />
  )
);
CardTitle.displayName = "CardTitle";

export interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}
const CardDescription = React.forwardRef<HTMLParagraphElement, CardDescriptionProps>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn("text-xs text-charcoal-400 dark:text-foreground/45", className)}
      {...props}
    />
  )
);
CardDescription.displayName = "CardDescription";

export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {}
const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
  )
);
CardContent.displayName = "CardContent";

export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {}
const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex items-center p-6 pt-0 border-t border-border/40 mt-4", className)}
      {...props}
    />
  )
);
CardFooter.displayName = "CardFooter";

// Animated Card using Motion for premium interactions
export interface AnimatedCardProps extends HTMLMotionProps<"div"> {
  variant?: "default" | "glass" | "bordered" | "flat";
  hoverEffect?: "none" | "lift" | "glow" | "zoom";
}
const AnimatedCard = React.forwardRef<HTMLDivElement, AnimatedCardProps>(
  ({ className, variant = "default", hoverEffect = "none", ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        className={cn(
          "rounded-2xl transition-all duration-300 overflow-hidden",
          // Variants
          variant === "default" && "bg-card text-card-foreground border border-border/60 shadow-sm",
          variant === "glass" && "glass dark:glass-dark shadow-glass border border-white/20 dark:border-white/5",
          variant === "bordered" && "bg-transparent text-foreground border border-border/80 dark:border-border",
          variant === "flat" && "bg-secondary/40 text-foreground border-none",
          className
        )}
        whileHover={
          hoverEffect === "lift"
            ? { y: -6, scale: 1.01, transition: { duration: 0.2, ease: "easeOut" } }
            : hoverEffect === "zoom"
            ? { scale: 1.02, transition: { duration: 0.2, ease: "easeOut" } }
            : undefined
        }
        {...props}
      />
    );
  }
);
AnimatedCard.displayName = "AnimatedCard";

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, AnimatedCard };
