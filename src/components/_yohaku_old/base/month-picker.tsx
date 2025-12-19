"use client";

import * as React from "react";
import { addMonths, format } from "date-fns";
import { ChevronDownIcon } from "lucide-react";

import { YohakuButton } from "@/components/_yohaku_old/base/button";
import {
  YohakuSelect,
  YohakuSelectContent,
  YohakuSelectItem,
  YohakuSelectTrigger,
  YohakuSelectValue,
} from "@/components/_yohaku_old/base/select";
import { cn } from "@/lib/utils";

const DEFAULT_MONTHS = 24;

export type MonthPickerProps = {
  value?: string;
  onChange?: (value: string) => void;
  label?: string;
  placeholder?: string;
  months?: number;
};

type MonthOption = {
  label: string;
  value: string;
};

const buildMonthOptions = (count: number): MonthOption[] => {
  const result: MonthOption[] = [];
  let month = new Date();
  for (let i = 0; i < count; i += 1) {
    result.push({
      label: format(month, "yyyy年 M月"),
      value: format(month, "yyyy-MM"),
    });
    month = addMonths(month, 1);
  }
  return result;
};

export function MonthPicker({
  value,
  onChange,
  label,
  placeholder = "月を選択",
  months = DEFAULT_MONTHS,
}: MonthPickerProps) {
  const options = React.useMemo(() => buildMonthOptions(months), [months]);

  const displayLabel = React.useMemo(() => {
    if (!value) return placeholder;
    return options.find((option) => option.value === value)?.label ?? placeholder;
  }, [options, placeholder, value]);

  return (
    <div className="flex flex-col gap-2">
      {label ? (
        <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-muted-foreground">
          {label}
        </span>
      ) : null}
      <YohakuSelect value={value} onValueChange={onChange}>
        <YohakuSelectTrigger className="w-full justify-between rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-[var(--color-text)] shadow-sm transition hover:border-slate-300 focus-visible:ring-2 focus-visible:ring-primary/30">
          <span className="truncate">{displayLabel}</span>
          <ChevronDownIcon className="size-4 text-muted-foreground" />
        </YohakuSelectTrigger>
        <YohakuSelectContent align="start" className="w-[220px]">
          {options.map((option) => (
            <YohakuSelectItem key={option.value} value={option.value}>
              {option.label}
            </YohakuSelectItem>
          ))}
        </YohakuSelectContent>
      </YohakuSelect>
    </div>
  );
}
