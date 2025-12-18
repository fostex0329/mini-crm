import * as React from "react";
import type { ComponentPropsWithoutRef, ElementRef } from "react";

import { Label as ShadcnLabel } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export const YohakuLabel = React.forwardRef<ElementRef<typeof ShadcnLabel>, ComponentPropsWithoutRef<typeof ShadcnLabel>>(
  ({ className, ...props }, ref) => (
    <ShadcnLabel ref={ref} className={cn("text-xs font-semibold uppercase tracking-wide text-slate-500", className)} {...props} />
  )
);
YohakuLabel.displayName = "YohakuLabel";
