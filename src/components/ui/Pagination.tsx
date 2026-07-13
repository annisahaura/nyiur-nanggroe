"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./Button";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
}: PaginationProps) {
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always include page 1
      pages.push(1);

      if (currentPage > 3) {
        pages.push("ellipsis-start");
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push("ellipsis-end");
      }

      // Always include last page
      pages.push(totalPages);
    }

    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <nav
      role="navigation"
      aria-label="Navigasi halaman"
      className={cn("flex items-center justify-center gap-1.5 mt-8", className)}
    >
      {/* Previous Button */}
      <Button
        variant="ghost"
        size="sm"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="px-2"
        aria-label="Ke halaman sebelumnya"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {/* Pages */}
      {getPageNumbers().map((page, index) => {
        if (typeof page === "string") {
          return (
            <span
              key={`ellipsis-${index}`}
              className="w-9 h-9 flex items-center justify-center text-charcoal-400 dark:text-foreground/40"
            >
              <MoreHorizontal className="h-4 w-4" />
            </span>
          );
        }

        const isCurrent = page === currentPage;

        return (
          <Button
            key={`page-${page}`}
            variant={isCurrent ? "primary" : "ghost"}
            size="sm"
            onClick={() => onPageChange(page)}
            className={cn(
              "w-9 h-9 rounded-lg font-medium p-0",
              !isCurrent && "text-charcoal-600 dark:text-foreground/70"
            )}
            aria-current={isCurrent ? "page" : undefined}
            aria-label={`Ke halaman ${page}`}
          >
            {page}
          </Button>
        );
      })}

      {/* Next Button */}
      <Button
        variant="ghost"
        size="sm"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="px-2"
        aria-label="Ke halaman berikutnya"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </nav>
  );
}
