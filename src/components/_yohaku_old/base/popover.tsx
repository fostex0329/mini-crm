import * as React from "react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export type YohakuPopoverProps = React.ComponentProps<typeof Popover>;

const baseContentClass =
  "rounded-2xl border border-[var(--color-border)] bg-white/95 p-3 shadow-xl shadow-slate-200/80 backdrop-blur";

export const YohakuPopover = React.forwardRef<
  React.ElementRef<typeof Popover>,
  YohakuPopoverProps
>((props, ref) => <Popover {...props} />);
YohakuPopover.displayName = "YohakuPopover";

export const YohakuPopoverTrigger = React.forwardRef<
  React.ElementRef<typeof PopoverTrigger>,
  React.ComponentPropsWithoutRef<typeof PopoverTrigger>
>((props, ref) => <PopoverTrigger ref={ref} {...props} />);
YohakuPopoverTrigger.displayName = "YohakuPopoverTrigger";

export const YohakuPopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverContent>,
  React.ComponentPropsWithoutRef<typeof PopoverContent>
>(({ className, ...props }, ref) => (
  <PopoverContent ref={ref} className={cn(baseContentClass, className)} {...props} />
));
YohakuPopoverContent.displayName = "YohakuPopoverContent";
