"use client";

import * as React from "react";
import type { Column } from "@tanstack/react-table";
import { PlusIcon, XIcon } from "lucide-react";

import { YohakuBadge } from "@/components/_yohaku_old/base/badge";
import { YohakuButton } from "@/components/_yohaku_old/base/button";
import {
  YohakuDropdownMenu,
  YohakuDropdownMenuCheckboxItem,
  YohakuDropdownMenuContent,
  YohakuDropdownMenuItem,
  YohakuDropdownMenuSeparator,
  YohakuDropdownMenuTrigger,
} from "@/components/_yohaku_old/base/dropdown-menu";
import type { FacetedFilterOption } from "./data/task-filters";

interface DataTableFacetedFilterProps<TData, TValue> {
  column: Column<TData, TValue>;
  title: string;
  options: FacetedFilterOption[];
}

export function DataTableFacetedFilter<TData, TValue>({
  column,
  title,
  options,
}: DataTableFacetedFilterProps<TData, TValue>) {
  const selectedValues = new Set<string>(
    (column.getFilterValue() as string[]) ?? []
  );
  const selectedOptions = options.filter((option) =>
    selectedValues.has(option.value)
  );

  const toggleValue = (value: string) => {
    if (selectedValues.has(value)) {
      selectedValues.delete(value);
    } else {
      selectedValues.add(value);
    }
    const result = Array.from(selectedValues);
    column.setFilterValue(result.length ? result : undefined);
  };

  const reset = () => {
    column.setFilterValue(undefined);
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <YohakuDropdownMenu>
        <YohakuDropdownMenuTrigger asChild>
          <YohakuButton
            variant="outline"
            size="sm"
            className="inline-flex w-fit items-center gap-2 border-dashed px-3 py-1 text-xs font-semibold"
          >
            <PlusIcon className="size-3" />
            {title}
          </YohakuButton>
        </YohakuDropdownMenuTrigger>
        <YohakuDropdownMenuContent align="start" className="w-56">
          <div className="px-2 py-1 text-xs text-muted-foreground">
            {selectedValues.size > 0
              ? `${selectedValues.size} 件選択中`
              : `${title} を選択`}
          </div>
          <YohakuDropdownMenuSeparator />
          <div className="max-h-64 overflow-y-auto">
            {options.map((option) => (
              <YohakuDropdownMenuCheckboxItem
                key={option.value}
                className="items-start gap-2 text-sm"
                checked={selectedValues.has(option.value)}
                onCheckedChange={() => toggleValue(option.value)}
              >
                <div className="flex flex-col text-left">
                  <span className="font-medium text-[var(--color-text)]">
                    {option.label}
                  </span>
                  {option.description ? (
                    <span className="text-xs text-muted-foreground">
                      {option.description}
                    </span>
                  ) : null}
                </div>
              </YohakuDropdownMenuCheckboxItem>
            ))}
          </div>
          {selectedValues.size > 0 ? (
            <>
              <YohakuDropdownMenuSeparator />
              <YohakuDropdownMenuItem onSelect={reset} className="text-destructive">
                <XIcon className="mr-2 size-3" /> 全て解除
              </YohakuDropdownMenuItem>
            </>
          ) : null}
        </YohakuDropdownMenuContent>
      </YohakuDropdownMenu>
      {selectedOptions.length ? (
        <div className="flex flex-wrap items-center gap-1">
          {selectedOptions.map((option) => (
            <YohakuBadge
              key={option.value}
              variant="secondary"
              className="rounded-full border border-dashed bg-transparent px-3 py-1 text-xs font-medium"
            >
              {option.label}
            </YohakuBadge>
          ))}
        </div>
      ) : null}
    </div>
  );
}
