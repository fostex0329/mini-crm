import { parseISO, addDays, isSaturday, isSunday } from "date-fns";

const WEEKEND = [0, 6];

export const isWeekendDay = (date: Date) => WEEKEND.includes(date.getDay());

export const toDate = (value: string | Date) =>
  typeof value === "string" ? parseISO(value) : value;

export const nextBusinessDay = (value: string | Date) => {
  let date = toDate(value);
  while (isWeekendDay(date)) {
    date = addDays(date, 1);
  }
  return date;
};

export const addBusinessDays = (value: string | Date, days: number) => {
  let date = toDate(value);
  const step = days >= 0 ? 1 : -1;
  let remaining = Math.abs(days);
  while (remaining > 0) {
    date = addDays(date, step);
    if (!isWeekendDay(date)) {
      remaining -= 1;
    }
  }
  return date;
};

export const businessDaysDiff = (from: string | Date, to: string | Date) => {
  let start = toDate(from);
  const target = toDate(to);
  const step = start <= target ? 1 : -1;
  let diff = 0;
  while (
    (step > 0 && start < target) ||
    (step < 0 && start > target)
  ) {
    start = addDays(start, step);
    if (!isWeekendDay(start)) {
      diff += step;
    }
  }
  return diff;
};

export const formatISODate = (date: Date) => date.toISOString().slice(0, 10);
