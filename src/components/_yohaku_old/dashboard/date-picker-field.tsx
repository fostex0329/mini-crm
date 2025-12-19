// @ts-nocheck
import * as React from "react";
import { format, parseISO, isValid } from "date-fns";
import { ja } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  YohakuPopover,
  YohakuPopoverContent,
  YohakuPopoverTrigger,
} from "@/components/_yohaku_old/base/popover";
import { YohakuCalendar } from "@/components/_yohaku_old/base/calendar";

const useLocalTimeZone = () => {
  const [timeZone, setTimeZone] = React.useState<string>();

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const resolved = Intl.DateTimeFormat().resolvedOptions().timeZone;
    setTimeZone(resolved);
  }, []);

  return timeZone;
};

const parseDateValue = (value?: string) => {
  if (!value) return undefined;
  try {
    const parsed = parseISO(value);
    return isValid(parsed) ? parsed : undefined;
  } catch (error) {
    return undefined;
  }
};

export type YohakuDatePickerButtonProps = {
  value?: string;
  onChange?: (isoDate: string) => void;
  placeholder?: string;
  displayFormat?: string;
  buttonClassName?: string;
  align?: "start" | "center" | "end";
  calendarProps?: Partial<React.ComponentProps<typeof YohakuCalendar>>;
};

export const YohakuDatePickerButton = ({
  value,
  onChange,
  placeholder = "日付を選択",
  displayFormat = "yy/MM/dd",
  buttonClassName,
  align = "start",
  calendarProps,
}: YohakuDatePickerButtonProps) => {
  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<Date | undefined>(() =>
    parseDateValue(value)
  );
  const timeZone = useLocalTimeZone();

  React.useEffect(() => {
    setSelected(parseDateValue(value));
  }, [value]);

  const label = selected ? format(selected, displayFormat, { locale: ja }) : placeholder;

  const handleSelect = (date?: Date) => {
    if (!date) return;
    setSelected(date);
    setOpen(false);
    onChange?.(date.toISOString().slice(0, 10));
  };

  const currentYear = new Date().getFullYear();
  const mergedCalendarProps = {
    captionLayout: "dropdown" as const,
    fromYear: currentYear - 5,
    toYear: currentYear + 5,
    locale: ja,
    ...calendarProps,
  };

  return (
    <YohakuPopover open={open} onOpenChange={setOpen}>
      <YohakuPopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            "flex h-9 items-center gap-2 rounded-full border border-slate-200 bg-white px-4 text-sm font-semibold text-[var(--color-text)] shadow-sm transition hover:border-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30",
            buttonClassName
          )}
        >
          <span className="truncate text-left">{label}</span>
          <CalendarIcon className="size-4 text-slate-400" />
        </button>
      </YohakuPopoverTrigger>
      <YohakuPopoverContent align={align} className="w-auto p-2" sideOffset={8}>
        <YohakuCalendar
          mode="single"
          selected={selected}
          timeZone={timeZone}
          onSelect={handleSelect}
          initialFocus
          {...mergedCalendarProps}
        />
      </YohakuPopoverContent>
    </YohakuPopover>
  );
};
