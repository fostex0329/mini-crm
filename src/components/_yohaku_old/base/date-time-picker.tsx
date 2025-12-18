"use client";

import * as React from "react";
import { format, parseISO, isValid } from "date-fns";
import ja from "date-fns/locale/ja";

import { YohakuPopover, YohakuPopoverContent, YohakuPopoverTrigger } from "@/components/yohaku/base/popover";
import { YohakuButton } from "@/components/yohaku/base/button";
import { YohakuCalendar } from "@/components/yohaku/base/calendar";
import { cn } from "@/lib/utils";

const DATE_FORMAT = "yyyy/MM/dd";

const createIso = (date?: Date, time?: string) => {
  if (!date) return undefined;
  const [hours = "00", minutes = "00"] = (time ?? "00:00").split(":");
  const normalized = new Date(date);
  normalized.setHours(Number(hours), Number(minutes), 0, 0);
  return normalized.toISOString();
};

const parseValue = (value?: string) => {
  if (!value) return { date: undefined, time: "00:00" };
  try {
    const parsed = parseISO(value);
    if (!isValid(parsed)) return { date: undefined, time: "00:00" };
    const hours = String(parsed.getHours()).padStart(2, "0");
    const minutes = String(parsed.getMinutes()).padStart(2, "0");
    return { date: parsed, time: `${hours}:${minutes}` };
  } catch {
    return { date: undefined, time: "00:00" };
  }
};

const HOURS = Array.from({ length: 24 }, (_, index) =>
  String(index).padStart(2, "0")
);
const MINUTES = Array.from({ length: 12 }, (_, index) =>
  String(index * 5).padStart(2, "0")
);

export type DateTimePickerProps = {
  value?: string;
  onChange?: (isoDate: string) => void;
  placeholder?: string;
  label?: string;
  align?: "start" | "center" | "end";
};

export function DateTimePicker({
  value,
  onChange,
  placeholder = "日付と時刻を選択",
  label,
  align = "start",
}: DateTimePickerProps) {
  const parsed = React.useMemo(() => parseValue(value), [value]);
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(parsed.date);
  const [selectedTime, setSelectedTime] = React.useState(parsed.time);
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    setSelectedDate(parsed.date);
    setSelectedTime(parsed.time);
  }, [parsed.date, parsed.time]);

  const display = React.useMemo(() => {
    if (!value || !selectedDate) return placeholder;
    const parsedDate = parseISO(value);
    if (!isValid(parsedDate)) return placeholder;
    return format(parsedDate, "yyyy/MM/dd HH:mm", { locale: ja });
  }, [placeholder, selectedDate, value]);

  const handleDateSelect = (date?: Date) => {
    if (!date) return;
    setSelectedDate(date);
    const iso = createIso(date, selectedTime);
    if (iso) {
      onChange?.(iso);
    }
  };

  const handleTimeSelect = React.useCallback(
    (hour: string, minute: string) => {
      const nextTime = `${hour}:${minute}`;
      setSelectedTime(nextTime);
      const iso = createIso(selectedDate, nextTime);
      if (iso) {
        onChange?.(iso);
      }
    },
    [onChange, selectedDate]
  );

  const currentHour = selectedTime.split(":")[0] ?? "00";
  const currentMinute = selectedTime.split(":")[1] ?? "00";

  return (
    <div className="flex flex-col gap-2">
      {label ? (
        <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-muted-foreground">
          {label}
        </span>
      ) : null}
      <YohakuPopover open={open} onOpenChange={setOpen}>
        <YohakuPopoverTrigger asChild>
          <YohakuButton
            variant="outline"
            className={cn(
              "flex w-full items-center justify-between rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-[var(--color-text)] shadow-sm transition hover:border-slate-300 focus-visible:ring-2 focus-visible:ring-primary/30",
              !value ? "text-muted-foreground" : undefined
            )}
          >
            <span className="truncate">{display}</span>
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
              ⌄
            </span>
          </YohakuButton>
        </YohakuPopoverTrigger>
        <YohakuPopoverContent align={align} sideOffset={8} className="w-[320px] p-4">
          <div className="space-y-4">
            <YohakuCalendar mode="single" selected={selectedDate} onSelect={handleDateSelect} />
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                時刻
              </span>
              <div className="grid grid-cols-2 gap-3 rounded-2xl border border-slate-200 bg-white p-3 text-center shadow-sm">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">時</p>
                  <div className="mt-2 flex max-h-36 flex-col gap-1 overflow-y-auto">
                    {HOURS.map((hour) => (
                      <button
                        key={`hour-${hour}`}
                        type="button"
                        onClick={() => handleTimeSelect(hour, selectedTime.split(":")[1] ?? "00")}
                        className={cn(
                          "rounded-xl px-3 py-1 text-sm font-semibold transition-colors focus-visible:outline-none",
                          hour === currentHour
                            ? "bg-slate-900 text-white"
                            : "bg-transparent text-slate-600 hover:bg-slate-100"
                        )}
                      >
                        {hour}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">分</p>
                  <div className="mt-2 flex max-h-36 flex-col gap-1 overflow-y-auto">
                    {MINUTES.map((minute) => (
                      <button
                        key={`minute-${minute}`}
                        type="button"
                        onClick={() =>
                          handleTimeSelect(selectedTime.split(":")[0] ?? "00", minute)
                        }
                        className={cn(
                          "rounded-xl px-3 py-1 text-sm font-semibold transition-colors focus-visible:outline-none",
                          minute === currentMinute
                            ? "bg-slate-900 text-white"
                            : "bg-transparent text-slate-600 hover:bg-slate-100"
                        )}
                      >
                        {minute}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </YohakuPopoverContent>
      </YohakuPopover>
    </div>
  );
}
