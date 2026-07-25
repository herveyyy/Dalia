"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../../atoms/Button";

export interface DataPaginationProps {
  totalItems: number;
  currentPage?: number;
  itemsPerPage?: number;
  pageSizeOptions?: number[];
  onPageChange?: (page: number) => void;
  onItemsPerPageChange?: (items: number) => void;
  /**
   * Soft-navigate when page/items change (e.g. Next.js `router.push`).
   * Prefer this over history.pushState so App Router re-reads searchParams.
   */
  navigate?: (href: string) => void;
}

function buildListHref(page: number, items: number) {
  const url = new URL(window.location.href);
  url.searchParams.set("page", String(page));
  url.searchParams.set("items", String(items));
  return `${url.pathname}${url.search}${url.hash}`;
}

function syncListParams(
  page: number,
  items: number,
  navigate?: (href: string) => void
) {
  if (typeof window === "undefined") return;
  const href = buildListHref(page, items);
  if (navigate) {
    navigate(href);
  } else {
    window.history.pushState({}, "", href);
  }
}

export function DataPagination({
  totalItems,
  currentPage = 1,
  itemsPerPage = 20,
  pageSizeOptions = [10, 20, 50, 100],
  onPageChange,
  onItemsPerPageChange,
  navigate,
}: DataPaginationProps) {
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const handlePageChange = (newPage: number) => {
    onPageChange?.(newPage);
    // Always reflect page/items in the URL (bookmarkable / shareable)
    syncListParams(newPage, itemsPerPage, navigate);
  };

  const handleItemsPerPageChange = (newItems: number) => {
    onItemsPerPageChange?.(newItems);
    syncListParams(1, newItems, navigate);
  };

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pt-4 border-t border-border/60">
      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        <span>
          Showing <strong className="text-foreground">{startItem}–{endItem}</strong> of{" "}
          <strong className="text-foreground">{totalItems}</strong> items
        </span>
        <div className="flex items-center gap-1.5 border-l border-border pl-3">
          <span>Rows per page:</span>
          <select
            value={itemsPerPage}
            onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
            className="rounded border border-input bg-card px-2 py-1 text-xs font-medium text-foreground outline-none cursor-pointer"
          >
            {pageSizeOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="icon-sm"
          disabled={currentPage <= 1}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          <ChevronLeft className="size-4" />
        </Button>
        <span className="px-3 text-xs font-medium text-foreground">
          Page {currentPage} of {totalPages}
        </span>
        <Button
          variant="outline"
          size="icon-sm"
          disabled={currentPage >= totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}
