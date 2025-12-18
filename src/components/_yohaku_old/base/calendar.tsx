import * as React from "react";

import { Calendar, type CalendarProps } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

export type YohakuCalendarProps = CalendarProps & {
  timeZone?: string;
};

export const YohakuCalendar = React.forwardRef<HTMLDivElement, YohakuCalendarProps>(
  ({ className, timeZone, ...props }, ref) => (
    <Calendar
      ref={ref}
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
