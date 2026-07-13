"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Sprout, Search, Inbox, ShoppingBag, FolderOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./Button";

export interface EmptyStateProps {
  icon?: "sprout" | "search" | "inbox" | "shopping-bag" | "folder";
  title: string;
  description: string;
  actionText?: string;
  onActionClick?: () => void;
  className?: string;
  children?: React.ReactNode;
}

export function EmptyState({
  icon = "folder",
  title,
  description,
  actionText,
  onActionClick,
  className,
  children,
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className={cn(
        "flex flex-col items-center justify-center text-center p-8 sm:p-12 rounded-3xl bg-card border border-border/40 max-w-md mx-auto my-6 shadow-sm",
        className
      )}
    >
      {/* Icon Area */}
      <div className="w-16 h-16 rounded-2xl bg-secondary/50 dark:bg-secondary flex items-center justify-center text-primary dark:text-ring mb-6">
        {icon === "sprout" && <Sprout className="h-8 w-8" />}
        {icon === "search" && <Search className="h-8 w-8" />}
        {icon === "inbox" && <Inbox className="h-8 w-8" />}
        {icon === "shopping-bag" && <ShoppingBag className="h-8 w-8" />}
        {icon === "folder" && <FolderOpen className="h-8 w-8" />}
      </div>

      {/* Copywriting */}
      <h3 className="font-display font-bold text-lg text-foreground mb-2">
        {title}
      </h3>
      <p className="text-sm text-charcoal-400 dark:text-foreground/45 max-w-sm mb-6 leading-relaxed">
        {description}
      </p>

      {/* Action Button */}
      {actionText && onActionClick && (
        <Button onClick={onActionClick} variant="primary" size="sm">
          {actionText}
        </Button>
      )}

      {children}
    </motion.div>
  );
}
