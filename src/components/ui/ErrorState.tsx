"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { AlertCircle, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./Button";

export interface ErrorStateProps {
  title?: string;
  description: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title = "Terjadi Kesalahan",
  description,
  onRetry,
  className,
}: ErrorStateProps) {
  const [isRetrying, setIsRetrying] = React.useState(false);

  const handleRetry = async () => {
    if (!onRetry) return;
    setIsRetrying(true);
    try {
      await onRetry();
    } finally {
      setIsRetrying(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "flex flex-col items-center justify-center text-center p-8 sm:p-12 rounded-3xl bg-red-50/40 dark:bg-red-950/10 border border-red-100 dark:border-red-900/20 max-w-md mx-auto my-6 shadow-sm",
        className
      )}
    >
      {/* Icon Area */}
      <div className="w-14 h-14 rounded-2xl bg-red-100 dark:bg-red-500/10 flex items-center justify-center text-red-600 dark:text-red-400 mb-5">
        <AlertCircle className="h-7 w-7" />
      </div>

      {/* Copywriting */}
      <h3 className="font-display font-bold text-base sm:text-lg text-foreground mb-2">
        {title}
      </h3>
      <p className="text-xs sm:text-sm text-red-700/80 dark:text-red-300/70 max-w-sm mb-6 leading-relaxed">
        {description}
      </p>

      {/* Action Button */}
      {onRetry && (
        <Button
          onClick={handleRetry}
          variant="outline"
          size="sm"
          className="border-red-200 hover:bg-red-50 hover:text-red-700 dark:border-red-900/30 dark:hover:bg-red-950/20 dark:hover:text-red-300"
          isLoading={isRetrying}
        >
          {!isRetrying && <RefreshCw className="h-3.5 w-3.5 mr-1" />}
          <span>Coba Lagi</span>
        </Button>
      )}
    </motion.div>
  );
}
