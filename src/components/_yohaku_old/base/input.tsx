import * as React from "react";

import type { ComponentPropsWithoutRef } from "react";
import { Input as ShadcnInput } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export type YohakuInputProps = ComponentPropsWithoutRef<typeof ShadcnInput>;

export const YohakuInput = React.forwardRef<HTMLInputElement, YohakuInputProps>(
  ({ className, ...props }, ref) => {
    return (
      <ShadcnInput
        ref={ref}
        className={cn(
          "rounded-xl border-slate-300/70 bg-white/80 text-base placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-primary/50",
          className
        )}
        {...props}
      />
    );
  }
);
YohakuInput.displayName = "YohakuInput";
