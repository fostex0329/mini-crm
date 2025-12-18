import type { BadgeProps as ShadcnBadgeProps } from "@/components/ui/badge";
import { Badge as ShadcnBadge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type YohakuBadgeProps = ShadcnBadgeProps;

export function YohakuBadge({ className, ...props }: YohakuBadgeProps) {
  return (
    <ShadcnBadge
      className={cn(
        "rounded-full border-transparent bg-gradient-to-r from-slate-900 to-slate-700 uppercase tracking-wide text-[11px] text-white",
        className
      )}
      {...props}
    />
  );
}
