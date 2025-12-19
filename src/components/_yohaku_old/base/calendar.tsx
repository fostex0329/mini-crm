import * as React from "react";

import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

export type YohakuCalendarProps = React.ComponentProps<typeof Calendar> & {
  timeZone?: string;
};

export const YohakuCalendar = React.forwardRef<HTMLDivElement, YohakuCalendarProps>(
  ({ className, timeZone, ...props }, ref) => (
    <Calendar
      {...props}
      timeZone={timeZone}
      className={cn(
        "rounded-2xl bg-white p-3 [&>.rdp-months]:gap-3",
        className
      )}
    />
  )
);
YohakuCalendar.displayName = "YohakuCalendar";
