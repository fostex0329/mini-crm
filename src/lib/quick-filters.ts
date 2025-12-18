import { addMonths, format } from "date-fns";

import { DEMO_TODAY } from "@/lib/constants";
import type { DealViewModel, QuickFilterKey } from "@/types/crm";

const currentMonth = DEMO_TODAY.slice(0, 7);
const nextMonth = format(addMonths(new Date(DEMO_TODAY), 1), "yyyy-MM");

export type QuickFilterDefinition = {
  key: QuickFilterKey;
  label: string;
  description: string;
  predicate: (deal: DealViewModel) => boolean;
};

export const quickFilterDefinitions: QuickFilterDefinition[] = [
  {
    key: "none",
    label: "すべて表示",
    description: "フィルタを解除",
    predicate: () => true,
  },
  {
    key: "overdue",
    label: "未入金（遅延）",
    description: "実効期日超過",
    predicate: (deal) => deal.alerts.some((alert) => alert.type === "overdue"),
  },
  {
    key: "dueSoon",
    label: "入金期限まもなく",
    description: "3営業日以内",
    predicate: (deal) => deal.alerts.some((alert) => alert.type === "dueSoon"),
  },
  {
    key: "unbilledThisMonth",
    label: "今月：未請求",
    description: "請求予定月=当月",
    predicate: (deal) =>
      deal.invoicePlannedMonth === currentMonth &&
      !["issued", "paid"].includes(deal.invoice?.status ?? "none"),
  },
  {
    key: "actionOverdue",
    label: "対応期限切れ",
    description: "次アクション遅延",
    predicate: (deal) =>
      deal.alerts.some((alert) => alert.type === "actionOverdue"),
  },
  {
    key: "plannedThisMonth",
    label: "今月：請求予定",
    description: "請求予定月=今月",
    predicate: (deal) => deal.invoicePlannedMonth === currentMonth,
  },
  {
    key: "plannedNextMonth",
    label: "来月：請求予定",
    description: "請求予定月=来月",
    predicate: (deal) => deal.invoicePlannedMonth === nextMonth,
  },
];

export const getQuickFilterDefinition = (key: QuickFilterKey) =>
  quickFilterDefinitions.find((definition) => definition.key === key);

export const matchesQuickFilter = (
  deal: DealViewModel,
  key: QuickFilterKey
) => {
  if (key === "none") return true;
  const definition = getQuickFilterDefinition(key);
  if (!definition) return true;
  return definition.predicate(deal);
};
