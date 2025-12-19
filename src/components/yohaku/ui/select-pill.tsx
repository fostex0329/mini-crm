import * as React from "react"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

export const SelectPill = Select
export const SelectPillGroup = SelectGroup
export const SelectPillValue = SelectValue

export const SelectPillTrigger = React.forwardRef<
  React.ElementRef<typeof SelectTrigger>,
  React.ComponentPropsWithoutRef<typeof SelectTrigger>
>(({ className, children, ...props }, ref) => (
  <SelectTrigger
    ref={ref}
    className={cn(
      "inline-flex w-fit items-center justify-center gap-2 rounded-full border px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.1em] transition-all focus:ring-2 focus:ring-primary/20",
      // Default fallback if no color classes are provided
      "border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
      className
    )}
    {...props}
  >
    {children}
  </SelectTrigger>
))
SelectPillTrigger.displayName = "SelectPillTrigger"

export const SelectPillContent = React.forwardRef<
  React.ElementRef<typeof SelectContent>,
  React.ComponentPropsWithoutRef<typeof SelectContent>
>(({ className, ...props }, ref) => (
  <SelectContent
    ref={ref}
    className={cn(
      "rounded-xl border border-slate-100 bg-white shadow-xl shadow-slate-200/50",
      className
    )}
    {...props}
  />
))
SelectPillContent.displayName = "SelectPillContent"

export const SelectPillItem = React.forwardRef<
  React.ElementRef<typeof SelectItem>,
  React.ComponentPropsWithoutRef<typeof SelectItem>
>(({ className, ...props }, ref) => (
  <SelectItem
    ref={ref}
    className={cn(
      "rounded-lg px-3 py-2 text-xs font-medium text-slate-600 focus:bg-slate-50 focus:text-slate-900 my-0.5",
      className
    )}
    {...props}
  />
))
SelectPillItem.displayName = "SelectPillItem"
