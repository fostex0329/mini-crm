import * as React from "react";

import { cn } from "@/lib/utils";
import { YohakuInput, type YohakuInputProps } from "@/components/yohaku/base/input";

export type YohakuInputGroupProps = React.HTMLAttributes<HTMLDivElement>;

export const YohakuInputGroup = React.forwardRef<HTMLDivElement, YohakuInputGroupProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex h-9 w-full items-center gap-2 rounded-xl border border-slate-200 bg-white/80 px-3 py-1 shadow-sm transition focus-within:border-slate-400 focus-within:ring-2 focus-within:ring-primary/20",
        className
      )}
      {...props}
    />
  )
);
YohakuInputGroup.displayName = "YohakuInputGroup";

export const YohakuInputGroupInput = React.forwardRef<HTMLInputElement, YohakuInputProps>(
  ({ className, ...props }, ref) => (
    <YohakuInput
      ref={ref}
      className={cn(
        "h-9 flex-1 border-0 bg-transparent p-0 text-sm font-medium text-[var(--color-text)] shadow-none focus-visible:ring-0",
        className
      )}
      {...props}
    />
  )
);
YohakuInputGroupInput.displayName = "YohakuInputGroupInput";

export type YohakuInputGroupAddonProps = React.HTMLAttributes<HTMLSpanElement> & {
  align?: "inline-start" | "inline-end";
};

export const YohakuInputGroupAddon = React.forwardRef<HTMLSpanElement, YohakuInputGroupAddonProps>(
  ({ className, align = "inline-start", ...props }, ref) => (
    <span
      ref={ref}
      className={cn(
        "flex items-center gap-1 text-sm text-muted-foreground",
        align === "inline-start" && "pr-2 text-slate-400",
        align === "inline-end" && "ml-auto pl-2 text-slate-500",
        className
      )}
      {...props}
    />
  )
);
YohakuInputGroupAddon.displayName = "YohakuInputGroupAddon";
