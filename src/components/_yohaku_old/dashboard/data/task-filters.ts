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
  { label: "至急", value: "urgent", description: "24時間以内に対応" },
  { label: "高", value: "high", description: "今週中に対応" },
  { label: "中", value: "medium", description: "優先度ふつう" },
  { label: "低", value: "low", description: "時間のある時でOK" },
];
