"use client";

import * as React from "react";
import type { Table } from "@tanstack/react-table";
import { X, SearchIcon, Settings2, FilePlus2 } from "lucide-react";

import { YohakuButton } from "@/components/yohaku/base/button";
import {
  YohakuDropdownMenu,
  YohakuDropdownMenuCheckboxItem,
  YohakuDropdownMenuContent,
  YohakuDropdownMenuLabel,
  YohakuDropdownMenuSeparator,
  YohakuDropdownMenuTrigger,
} from "@/components/yohaku/base/dropdown-menu";
import {
  YohakuInputGroup,
  YohakuInputGroupAddon,
  YohakuInputGroupInput,
} from "@/components/yohaku/base/input-group";
import type { FacetedFilterOption } from "./data/task-filters";
import {
  dashboardPriorities,
  dashboardStatuses,
} from "./data/task-filters";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";

export type FacetedFilterConfig = {
  columnId: string;
  title: string;
  options: FacetedFilterOption[];
};

export type DataTableSearchConfig = {
  columnId: string;
  placeholder?: string;
};

const defaultFacetedFilters: FacetedFilterConfig[] = [
  { columnId: "status", title: "ステータス", options: dashboardStatuses },
  { columnId: "priority", title: "優先度", options: dashboardPriorities },
];

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  actionLabel?: string;
  onAction?: () => void;
  facetedFilters?: FacetedFilterConfig[];
  search?: DataTableSearchConfig;
}

export function DataTableToolbar<TData>({
  table,
  actionLabel = "タスクを追加",
  onAction,
  facetedFilters,
  search,
}: DataTableToolbarProps<TData>) {
  const columnFilters = table.getState().columnFilters;
  const isFiltered = columnFilters.length > 0;

  const filters = React.useMemo(
    () =>
      facetedFilters && facetedFilters.length > 0
        ? facetedFilters
        : defaultFacetedFilters,
    [facetedFilters]
  );

  const searchColumnId = search?.columnId ?? "header";
  const searchPlaceholder = search?.placeholder ?? "タスク名を検索";
  const searchColumn = table.getColumn(searchColumnId);

  return (
    <div className="flex flex-col gap-3 rounded-2xl bg-transparent p-4">
      {searchColumn ? (
        <div>
          <YohakuInputGroup className="w-full max-w-xl">
            <YohakuInputGroupAddon aria-hidden>
              <SearchIcon className="size-4" />
            </YohakuInputGroupAddon>
            <YohakuInputGroupInput
              placeholder={searchPlaceholder}
              aria-label={searchPlaceholder}
              value={(searchColumn.getFilterValue() as string) ?? ""}
              onChange={(event) =>
                searchColumn.setFilterValue(event.target.value)
              }
            />
          </YohakuInputGroup>
        </div>
      ) : null}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {filters.map((filter) => {
            const column = table.getColumn(filter.columnId);
            if (!column) {
              return null;
            }
            return (
              <DataTableFacetedFilter
                key={filter.columnId}
                column={column}
                title={filter.title}
                options={filter.options}
              />
            );
          })}
          {isFiltered ? (
            <YohakuButton
              variant="ghost"
              size="sm"
              onClick={() => table.resetColumnFilters()}
              className="gap-1 text-xs"
            >
              解除
              <X className="size-4" />
            </YohakuButton>
          ) : null}
        </div>
        <div className="flex items-center gap-2">
          <YohakuDropdownMenu>
            <YohakuDropdownMenuTrigger asChild>
              <YohakuButton variant="outline" size="sm" className="gap-2">
                <Settings2 className="size-4" />
                列を選択
              </YohakuButton>
            </YohakuDropdownMenuTrigger>
            <YohakuDropdownMenuContent align="end" className="w-56">
              <YohakuDropdownMenuLabel>表示する列</YohakuDropdownMenuLabel>
              <YohakuDropdownMenuSeparator />
              {table
                .getAllColumns()
                .filter(
                  (column) =>
                    typeof column.accessorFn !== "undefined" &&
                    column.getCanHide()
                )
                .map((column) => {
                  const label =
                    typeof column.columnDef.header === "string"
                      ? column.columnDef.header
                      : column.id;
                  return (
                    <YohakuDropdownMenuCheckboxItem
                      key={column.id}
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {label}
                    </YohakuDropdownMenuCheckboxItem>
                  );
                })}
            </YohakuDropdownMenuContent>
          </YohakuDropdownMenu>
          <YohakuButton size="sm" onClick={onAction} className="gap-2">
            <FilePlus2 className="size-4" />
            {actionLabel}
          </YohakuButton>
        </div>
      </div>
    </div>
  );
}
