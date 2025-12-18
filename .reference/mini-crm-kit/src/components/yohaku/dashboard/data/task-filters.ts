import type { TaskPriority } from "@/components/dashboard/columns";

export type FacetedFilterOption = {
  label: string;
  value: string;
  description?: string;
};

export const dashboardStatuses: FacetedFilterOption[] = [
  { label: "進行中", value: "進行中" },
  { label: "完了", value: "完了" },
  { label: "レビュー中", value: "レビュー中" },
  { label: "クローズ", value: "クローズ" },
];

export const dashboardPriorities: FacetedFilterOption[] = [
  { label: "至急", value: "urgent" satisfies TaskPriority, description: "24時間以内に対応" },
  { label: "高", value: "high" satisfies TaskPriority, description: "今週中に対応" },
  { label: "中", value: "medium" satisfies TaskPriority, description: "優先度ふつう" },
  { label: "低", value: "low" satisfies TaskPriority, description: "時間のある時でOK" },
];
