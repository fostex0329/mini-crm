export const DASHBOARD_TABLE_MIN_WIDTH = 960;

export type DashboardColumnLayout = {
  minWidth: number;
  maxWidth?: number;
  flex?: boolean;
  label?: string;
  headerPadding?: number;
  headerIconWidth?: number;
  cellPadding?: number;
  charWidth?: number;
};

export const dashboardColumnLayout: Record<string, DashboardColumnLayout> = {
  drag: { minWidth: 28 },
  select: { minWidth: 28 },
  header: { minWidth: 180, flex: true, label: "タスク", headerPadding: 48, headerIconWidth: 32, cellPadding: 40, charWidth: 14 },
  status: { minWidth: 120, label: "ステータス", headerPadding: 48, headerIconWidth: 32, cellPadding: 40, charWidth: 14 },
  type: { minWidth: 120, label: "カテゴリ", headerPadding: 48, headerIconWidth: 32, cellPadding: 40, charWidth: 14 },
  target: { minWidth: 72, label: "目標", headerPadding: 48, headerIconWidth: 32, cellPadding: 24, charWidth: 12 },
  limit: { minWidth: 72, label: "締切", headerPadding: 48, headerIconWidth: 32, cellPadding: 24, charWidth: 12 },
  priority: { minWidth: 120, label: "優先度", headerPadding: 48, headerIconWidth: 32, cellPadding: 40, charWidth: 14 },
  reviewer: { minWidth: 120, label: "担当者", headerPadding: 48, headerIconWidth: 32, cellPadding: 40, charWidth: 14 },
  actions: { minWidth: 64 },
};
