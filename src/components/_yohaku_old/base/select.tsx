import * as React from "react";
import type { ComponentPropsWithoutRef, ElementRef } from "react";

import {
  Select as ShadcnSelect,
  SelectContent as ShadcnSelectContent,
  SelectGroup as ShadcnSelectGroup,
  SelectItem as ShadcnSelectItem,
  SelectLabel as ShadcnSelectLabel,
  SelectScrollDownButton as ShadcnSelectScrollDownButton,
  SelectScrollUpButton as ShadcnSelectScrollUpButton,
  SelectSeparator as ShadcnSelectSeparator,
  SelectTrigger as ShadcnSelectTrigger,
  SelectValue as ShadcnSelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export const YohakuSelect = ShadcnSelect;
export const YohakuSelectGroup = ShadcnSelectGroup;
export const YohakuSelectValue = ShadcnSelectValue;

export const YohakuSelectTrigger = React.forwardRef<
  ElementRef<typeof ShadcnSelectTrigger>,
  ComponentPropsWithoutRef<typeof ShadcnSelectTrigger>
>(({ className, ...props }, ref) => (
  <ShadcnSelectTrigger
    ref={ref}
    className={cn(
      "h-10 rounded-2xl border border-slate-200 bg-white/80 text-base font-medium text-slate-700 shadow-sm focus-visible:ring-2 focus-visible:ring-primary/30",
      className
    )}
    {...props}
  />
));
YohakuSelectTrigger.displayName = "YohakuSelectTrigger";

export const YohakuSelectContent = React.forwardRef<
  ElementRef<typeof ShadcnSelectContent>,
  ComponentPropsWithoutRef<typeof ShadcnSelectContent>
>(({ className, ...props }, ref) => (
  <ShadcnSelectContent
    ref={ref}
    className={cn("rounded-2xl border border-slate-100 bg-white shadow-2xl shadow-slate-200/80", className)}
    {...props}
  />
));
YohakuSelectContent.displayName = "YohakuSelectContent";

export const YohakuSelectItem = React.forwardRef<
  ElementRef<typeof ShadcnSelectItem>,
  ComponentPropsWithoutRef<typeof ShadcnSelectItem>
>(({ className, ...props }, ref) => (
  <ShadcnSelectItem
    ref={ref}
    className={cn(
      "rounded-xl px-3 py-2 text-sm font-medium text-slate-600 focus:bg-slate-100 focus:text-slate-900",
      className
    )}
    {...props}
  />
));
YohakuSelectItem.displayName = "YohakuSelectItem";

export const YohakuSelectLabel = React.forwardRef<
  ElementRef<typeof ShadcnSelectLabel>,
  ComponentPropsWithoutRef<typeof ShadcnSelectLabel>
>(({ className, ...props }, ref) => (
  <ShadcnSelectLabel ref={ref} className={cn("px-3 py-2 text-xs uppercase text-slate-400", className)} {...props} />
));
YohakuSelectLabel.displayName = "YohakuSelectLabel";

export const YohakuSelectSeparator = React.forwardRef<
  ElementRef<typeof ShadcnSelectSeparator>,
  ComponentPropsWithoutRef<typeof ShadcnSelectSeparator>
>(({ className, ...props }, ref) => (
  <ShadcnSelectSeparator ref={ref} className={cn("my-1 h-px bg-slate-100", className)} {...props} />
));
YohakuSelectSeparator.displayName = "YohakuSelectSeparator";

export const YohakuSelectScrollUpButton = ShadcnSelectScrollUpButton;
export const YohakuSelectScrollDownButton = ShadcnSelectScrollDownButton;
