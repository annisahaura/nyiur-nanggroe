"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/components/providers";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  className?: string;
  isScrolled?: boolean;
}

export function ThemeToggle({ className, isScrolled = false }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        "relative p-2 rounded-lg transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 overflow-hidden",
        isScrolled
          ? "text-charcoal-500 hover:text-forest-600 hover:bg-mist dark:text-foreground/75 dark:hover:text-ring dark:hover:bg-secondary"
          : "text-white/80 hover:text-white hover:bg-white/15 dark:text-foreground/75 dark:hover:text-ring dark:hover:bg-white/10",
        className
      )}
      aria-label={`Ubah ke tema ${theme === "light" ? "gelap" : "terang"}`}
    >
      <div className="relative w-5 h-5">
        {/* Sun Icon */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={false}
          animate={{
            scale: theme === "light" ? 1 : 0,
            rotate: theme === "light" ? 0 : 90,
            opacity: theme === "light" ? 1 : 0,
          }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        >
          <Sun className="w-5 h-5 text-amber-500" />
        </motion.div>

        {/* Moon Icon */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={false}
          animate={{
            scale: theme === "dark" ? 1 : 0,
            rotate: theme === "dark" ? 0 : -90,
            opacity: theme === "dark" ? 1 : 0,
          }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        >
          <Moon className="w-5 h-5 text-yellow-400" />
        </motion.div>
      </div>
    </button>
  );
}
