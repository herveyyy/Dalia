"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  readTableView,
  writeTableView,
  type TableViewMode,
} from "@repo/ui/components/molecules/ViewToggle";

/**
 * - page / items → URL (?page=1&items=20), via DataPagination `navigate`
 * - view → localStorage for this table only; null until client has read it
 */
export function useListControls(opts: {
  storageKey: string;
  defaultItemsPerPage?: number;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const page = Math.max(1, Number(searchParams.get("page") || 1) || 1);
  const itemsPerPage = Math.max(
    1,
    Number(searchParams.get("items") || opts.defaultItemsPerPage || 20) || 20
  );

  // null until localStorage is read — don’t paint the list with the wrong layout
  const [viewMode, setViewModeState] = React.useState<TableViewMode | null>(null);

  React.useEffect(() => {
    const saved = readTableView(opts.storageKey);
    setViewModeState(saved ?? "rows");
  }, [opts.storageKey]);

  const navigate = React.useCallback(
    (href: string) => {
      router.replace(href, { scroll: false });
    },
    [router]
  );

  const setViewMode = React.useCallback(
    (view: TableViewMode) => {
      writeTableView(opts.storageKey, view);
      setViewModeState(view);
    },
    [opts.storageKey]
  );

  return {
    page,
    itemsPerPage,
    viewMode,
    setViewMode,
    navigate,
  };
}
