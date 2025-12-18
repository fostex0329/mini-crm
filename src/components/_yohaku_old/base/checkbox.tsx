import * as React from "react";
import type { ComponentPropsWithoutRef, ElementRef } from "react";

import { Checkbox as ShadcnCheckbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

export type YohakuCheckboxProps = ComponentPropsWithoutRef<typeof ShadcnCheckbox>;

export const YohakuCheckbox = React.forwardRef<ElementRef<typeof ShadcnCheckbox>, YohakuCheckboxProps>(
  ({ className, ...props }, ref) => {
    return (
      <ShadcnCheckbox
        ref={ref}
        className={cn(
          "h-5 w-5 rounded-md border-slate-300 bg-white data-[state=checked]:bg-primary data-[state=checked]:shadow-lg",
          className
        )}
        {...props}
      />
    );
  }
);
YohakuCheckbox.displayName = "YohakuCheckbox";
