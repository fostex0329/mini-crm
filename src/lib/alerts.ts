import { format } from "date-fns";

import { DEMO_TODAY } from "@/lib/constants";
import { addBusinessDays, businessDaysDiff, formatISODate, nextBusinessDay, toDate } from "@/lib/business-day";
import type { DealRecord, AlertType, AlertDescriptor } from "@/types/crm";

const ALERT_LABELS: Record<AlertType, string> = {
  overdue: "未入金（遅延）",
  dueSoon: "入金期限まもなく",
  unbilled: "今月：未請求",
  actionOverdue: "対応期限切れ",
};

const ALERT_PRIORITY: AlertType[] = [
  "overdue",
  "dueSoon",
  "unbilled",
  "actionOverdue",
];

const formatDueDate = (value: string) => format(toDate(value), "yyyy/MM/dd");

const todaysDate = () => DEMO_TODAY;

const compareDate = (a: string, b: string) => {
  const aDate = toDate(a).getTime();
  const bDate = toDate(b).getTime();
  if (aDate === bDate) return 0;
  return aDate < bDate ? -1 : 1;
};

const isBefore = (a: string, b: string) => compareDate(a, b) === -1;

const isSameOrBefore = (a: string, b: string) => compareDate(a, b) <= 0;

const calculateEffectiveDueDate = (invoiceDueDate: string) =>
  formatISODate(nextBusinessDay(invoiceDueDate));

const computeAlerts = (deal: DealRecord): AlertDescriptor[] => {
  const alerts: AlertDescriptor[] = [];
  const today = todaysDate();

  if (deal.nextAction.dueDate && isBefore(deal.nextAction.dueDate, today)) {
    const overdueDays = Math.abs(
      businessDaysDiff(deal.nextAction.dueDate, today)
    );
    alerts.push({
      type: "actionOverdue",
      label: ALERT_LABELS.actionOverdue,
      reason: `次アクション期限を${overdueDays}日超過しています（期限: ${deal.nextAction.dueDate}）`,
    });
  }

  if (deal.invoicePlannedMonth) {
    const targetMonth = deal.invoicePlannedMonth;
    const currentMonth = today.slice(0, 7);
    const invoiceStatus = deal.invoice?.status ?? "none";
    if (
      targetMonth === currentMonth &&
      invoiceStatus !== "issued" &&
      invoiceStatus !== "paid"
    ) {
      alerts.push({
        type: "unbilled",
        label: ALERT_LABELS.unbilled,
        reason: `請求予定月が当月（${targetMonth}）で、まだ未請求です`,
      });
    }
  }

  if (deal.invoice?.status === "issued" && deal.invoice.invoiceDueDate) {
    const effectiveDueDate = calculateEffectiveDueDate(
      deal.invoice.invoiceDueDate
    );
    if (isBefore(effectiveDueDate, today)) {
      const overdueDays = Math.abs(
        businessDaysDiff(effectiveDueDate, today)
      );
      alerts.push({
        type: "overdue",
        label: ALERT_LABELS.overdue,
        reason: `実効期日を${overdueDays}日超過しています（期日: ${formatDueDate(
          deal.invoice.invoiceDueDate
        )} / 実効: ${formatDueDate(effectiveDueDate)}）`,
      });
    } else {
      const daysUntilDue = businessDaysDiff(today, effectiveDueDate);
      if (daysUntilDue >= 0 && daysUntilDue <= 3) {
        alerts.push({
          type: "dueSoon",
          label: ALERT_LABELS.dueSoon,
          reason: `実効期日まであと${daysUntilDue}営業日です（期日: ${formatDueDate(
            deal.invoice.invoiceDueDate
          )} / 実効: ${formatDueDate(effectiveDueDate)}）`,
        });
      }
    }
  }

  return alerts.sort(
    (a, b) =>
      ALERT_PRIORITY.indexOf(a.type) - ALERT_PRIORITY.indexOf(b.type)
  );
};

export const evaluateAlerts = (deal: DealRecord) => computeAlerts(deal);
