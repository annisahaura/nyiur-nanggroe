"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, CheckCircle2, AlertCircle, AlertTriangle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastType = "success" | "error" | "warning" | "info";

export interface ToastItem {
  id: string;
  type: ToastType;
  message: string;
  description?: string;
  duration?: number;
}

// Global subscribers set
const subscribers = new Set<(toasts: ToastItem[]) => void>();
let toasts: ToastItem[] = [];

const notify = () => {
  subscribers.forEach((callback) => callback([...toasts]));
};

export const toast = {
  show: (type: ToastType, message: string, description?: string, duration = 4000) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast: ToastItem = { id, type, message, description, duration };
    toasts = [...toasts, newToast];
    notify();

    setTimeout(() => {
      toast.dismiss(id);
    }, duration);
  },
  success: (message: string, description?: string, duration?: number) => {
    toast.show("success", message, description, duration);
  },
  error: (message: string, description?: string, duration?: number) => {
    toast.show("error", message, description, duration);
  },
  warning: (message: string, description?: string, duration?: number) => {
    toast.show("warning", message, description, duration);
  },
  info: (message: string, description?: string, duration?: number) => {
    toast.show("info", message, description, duration);
  },
  dismiss: (id: string) => {
    toasts = toasts.filter((t) => t.id !== id);
    notify();
  },
};

export function useToasts() {
  const [currentToasts, setCurrentToasts] = React.useState<ToastItem[]>(toasts);

  React.useEffect(() => {
    subscribers.add(setCurrentToasts);
    return () => {
      subscribers.delete(setCurrentToasts);
    };
  }, []);

  return { toasts: currentToasts, dismiss: toast.dismiss };
}

export function ToastContainer() {
  const { toasts, dismiss } = useToasts();

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2.5 w-full max-w-sm pointer-events-none px-4">
      <AnimatePresence>
        {toasts.map((item) => {
          return (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className={cn(
                "w-full rounded-2xl p-4 shadow-lg border pointer-events-auto flex gap-3 relative overflow-hidden backdrop-blur-md",
                item.type === "success" &&
                  "bg-green-50/90 border-green-200 text-green-800 dark:bg-green-950/80 dark:border-green-800/40 dark:text-green-200",
                item.type === "error" &&
                  "bg-red-50/90 border-red-200 text-red-800 dark:bg-red-950/80 dark:border-red-800/40 dark:text-red-200",
                item.type === "warning" &&
                  "bg-amber-50/90 border-amber-200 text-amber-800 dark:bg-amber-950/80 dark:border-amber-800/40 dark:text-amber-200",
                item.type === "info" &&
                  "bg-blue-50/90 border-blue-200 text-blue-800 dark:bg-blue-950/80 dark:border-blue-800/40 dark:text-blue-200"
              )}
            >
              {/* Type Icon */}
              <div className="flex-shrink-0 mt-0.5">
                {item.type === "success" && <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />}
                {item.type === "error" && <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />}
                {item.type === "warning" && <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />}
                {item.type === "info" && <Info className="h-5 w-5 text-blue-600 dark:text-blue-400" />}
              </div>

              {/* Message Content */}
              <div className="flex-grow pr-4">
                <p className="text-sm font-semibold leading-tight">{item.message}</p>
                {item.description && (
                  <p className="text-xs mt-1 text-charcoal-500/80 dark:text-foreground/60 leading-normal">
                    {item.description}
                  </p>
                )}
              </div>

              {/* Close Button */}
              <button
                onClick={() => dismiss(item.id)}
                className="absolute right-3 top-3 p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-all text-charcoal-400 dark:text-foreground/45"
                aria-label="Tutup notifikasi"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
