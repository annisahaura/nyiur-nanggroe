"use client";

import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={cn("flex items-center gap-1.5 text-sm", className)}
    >
      <Link
        href="/"
        className="text-charcoal-400 hover:text-forest-600 transition-colors flex-shrink-0"
        aria-label="Beranda"
      >
        <Home className="w-3.5 h-3.5" />
      </Link>

      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <span key={index} className="flex items-center gap-1.5">
            <ChevronRight className="w-3.5 h-3.5 text-charcoal-300 flex-shrink-0" aria-hidden />
            {isLast || !item.href ? (
              <span
                className={cn(
                  "truncate max-w-[200px]",
                  isLast
                    ? "text-charcoal-700 font-medium"
                    : "text-charcoal-400"
                )}
                aria-current={isLast ? "page" : undefined}
              >
                {item.label}
              </span>
            ) : (
              <Link
                href={item.href}
                className="text-charcoal-400 hover:text-forest-600 transition-colors truncate max-w-[160px]"
              >
                {item.label}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
