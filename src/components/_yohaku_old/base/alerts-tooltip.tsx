"use client";

import { CircleAlert } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export type AlertRecord = {
  label: string;
  reason: string;
};

export type AlertsTooltipProps = {
  alerts: AlertRecord[];
  className?: string;
};

export function AlertsTooltip({ alerts, className }: AlertsTooltipProps) {
  if (!alerts.length) return null;

  return (
    <TooltipProvider>
      <Tooltip delayDuration={0} disableHoverableContent>
        <TooltipTrigger asChild>
          <span
            className={cn(
              "inline-flex items-center gap-2 rounded-full border border-transparent bg-destructive/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-destructive-foreground shadow-lg shadow-destructive/30 transition",
              className
            )}
          >
            <CircleAlert className="size-4 text-destructive-foreground/90" />
            <span className="flex-1 text-center">
              {alerts[0].label}
              {alerts.length > 1 ? (
                <span className="ml-2 text-[9px] font-semibold tracking-[0.4em] text-destructive-foreground/80">
                  +{alerts.length - 1}
                </span>
              ) : null}
            </span>
          </span>
        </TooltipTrigger>
        <TooltipContent
          align="center"
          sideOffset={6}
          className="max-w-xs space-y-3 rounded-2xl border border-destructive/40 bg-destructive/80 px-4 py-3 text-xs text-destructive-foreground backdrop-blur-sm shadow-2xl shadow-destructive/20"
        >
          {alerts.map((alert, index) => (
            <div key={`${alert.label}-${index}`} className="space-y-1">
              <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-destructive-foreground">
                {alert.label}
              </p>
              <p className="text-[12px] leading-5 text-destructive-foreground/80">
                {alert.reason}
              </p>
              {index < alerts.length - 1 ? (
                <hr className="border-white/40" />
              ) : null}
            </div>
          ))}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
