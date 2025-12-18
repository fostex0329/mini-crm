import * as React from "react";

import { cn } from "@/lib/utils";
import {
  Button as ShadcnButton,
  type ButtonProps as ShadcnButtonProps,
} from "@/components/ui/button";

export type YohakuButtonProps = ShadcnButtonProps & {
  variant?: ShadcnButtonProps["variant"];
  size?: ShadcnButtonProps["size"];
};

export const YohakuButton = React.forwardRef<HTMLButtonElement, YohakuButtonProps>(
  ({ className, ...props }, ref) => {
    return (
      <ShadcnButton
        ref={ref}
        className={cn("rounded-xl font-semibold tracking-wide", className)}
        {...props}
      />
    );
  }
);

YohakuButton.displayName = "YohakuButton";
