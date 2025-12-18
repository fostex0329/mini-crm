"use client";

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
import {
  dashboardPriorities,
  dashboardStatuses,
} from "./data/task-filters";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  actionLabel?: string;
  onAction?: () => void;
}

export function DataTableToolbar<TData>({
  table,
  actionLabel = "タスクを追加",
  onAction,
}: DataTableToolbarProps<TData>) {
  const columnFilters = table.getState().columnFilters;
  const isFiltered = columnFilters.length > 0;
  const titleColumn = table.getColumn("header");

  return (
    <div className="flex flex-col gap-3 rounded-2xl bg-transparent p-4">
      {titleColumn ? (
        <div>
          <YohakuInputGroup className="w-full max-w-xl">
            <YohakuInputGroupAddon aria-hidden>
              <SearchIcon className="size-4" />
            </YohakuInputGroupAddon>
            <YohakuInputGroupInput
              placeholder="タスク名を検索"
              aria-label="タスク名を検索"
              value={(titleColumn.getFilterValue() as string) ?? ""}
              onChange={(event) => titleColumn.setFilterValue(event.target.value)}
            />
          </YohakuInputGroup>
        </div>
      ) : null}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {table.getColumn("status") ? (
            <DataTableFacetedFilter
              column={table.getColumn("status")}
              title="ステータス"
              options={dashboardStatuses}
            />
          ) : null}
          {table.getColumn("priority") ? (
            <DataTableFacetedFilter
              column={table.getColumn("priority")}
              title="優先度"
              options={dashboardPriorities}
            />
          ) : null}
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
                .filter((column) => typeof column.accessorFn !== "undefined" && column.getCanHide())
                .map((column) => {
                  const label =
                    typeof column.columnDef.header === "string"
                      ? column.columnDef.header
                      : column.id;
                  return (
                    <YohakuDropdownMenuCheckboxItem
                      key={column.id}
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) => column.toggleVisibility(!!value)}
                    >
                      {label}
                    </YohakuDropdownMenuCheckboxItem>
                  );
                })}
            </YohakuDropdownMenuContent>
          </YohakuDropdownMenu>
          <YohakuButton size="sm" onClick={onAction} className="gap-2">
            <FilePlus2 className="size-4" />
            タスクを追加
          </YohakuButton>
        </div>
      </div>
    </div>
  );
}
