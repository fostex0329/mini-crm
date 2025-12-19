import { Deal, Alert, AlertType } from "@/lib/constants";
// import { Alert as UtilityAlert } from "@/lib/utils"; // Removed

export type { Deal };
export type DealRecord = Deal;

export type QuickFilterKey =
  | "none"
  | "overdue"
  | "due_soon"
  | "unbilled_this_month"
  | "action_overdue"
  | "planned_this_month"
  | "planned_next_month";

export type DealViewModel = Deal & {
  alerts: Alert[];
};

export type DemoState = {
  deals: Deal[];
  quickFilter: QuickFilterKey;
  activeNav: "dashboard" | "deals" | "invoices";
  updatedAt: string;
};
