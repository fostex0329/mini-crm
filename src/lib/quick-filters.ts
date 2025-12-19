import { DEMO_TODAY } from "@/lib/constants"; // Assuming DEMO_TODAY is in constants? It was in sample code as hardcoded "2025-12-17" in calculateAlerts default param.
import type { DealViewModel, QuickFilterKey } from "@/types/crm";

// We can define DEMO_TODAY here or import. sample-code uses "2025-12-17"
const demoTodayDate = new Date("2025-12-17");
const currentMonth = `${demoTodayDate.getFullYear()}-${String(demoTodayDate.getMonth() + 1).padStart(2, '0')}`;
// nextMonth logic not in sample code filters used in Dashboard, but let's keep it if useful, or simplify.
// sample code filters: overdue, due_soon, unbilled_this_month, action_overdue.

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
    key: "due_soon",
    label: "入金期限まもなく",
    description: "5日以内", 
    predicate: (deal) => deal.alerts.some((alert) => alert.type === "due_soon"),
  },
  {
    key: "unbilled_this_month",
    label: "今月：未請求",
    description: "請求予定月=当月",
    predicate: (deal) => deal.alerts.some((alert) => alert.type === "unbilled_this_month"),
  },
  {
    key: "action_overdue",
    label: "対応期限切れ",
    description: "次アクション遅延",
    predicate: (deal) => deal.alerts.some((alert) => alert.type === "action_overdue"),
  },
  // Extra filters from original quick-filters (optional, maybe keep if sidebar uses them)
  // But Dashboard only uses the 4 above.
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
