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
  alerts: { minWidth: 112, label: "Alerts", headerPadding: 32, cellPadding: 24, charWidth: 11 },
  dealName: { minWidth: 220, flex: true, label: "案件名", headerPadding: 48, headerIconWidth: 32, cellPadding: 40, charWidth: 14 },
  companyName: { minWidth: 180, label: "クライアント", headerPadding: 40, cellPadding: 32, charWidth: 13 },
  amount: { minWidth: 120, label: "金額", headerPadding: 32, cellPadding: 28, charWidth: 12 },
  status: { minWidth: 100, label: "ステータス", headerPadding: 32, headerIconWidth: 32, cellPadding: 32, charWidth: 12 },
  owner: { minWidth: 140, label: "担当者", headerPadding: 32, cellPadding: 28, charWidth: 12 },
  type: { minWidth: 120, label: "カテゴリ", headerPadding: 48, headerIconWidth: 32, cellPadding: 40, charWidth: 14 },
  target: { minWidth: 72, label: "目標", headerPadding: 48, headerIconWidth: 32, cellPadding: 24, charWidth: 12 },
  limit: { minWidth: 72, label: "締切", headerPadding: 48, headerIconWidth: 32, cellPadding: 24, charWidth: 12 },
  priority: { minWidth: 120, label: "優先度", headerPadding: 48, headerIconWidth: 32, cellPadding: 40, charWidth: 14 },
  reviewer: { minWidth: 120, label: "担当者", headerPadding: 48, headerIconWidth: 32, cellPadding: 40, charWidth: 14 },
  nextActionText: { minWidth: 220, label: "次アクション", headerPadding: 32, cellPadding: 32, charWidth: 12 },
  nextActionOwner: { minWidth: 150, label: "次アクション担当", headerPadding: 32, cellPadding: 28, charWidth: 11 },
  nextActionDue: { minWidth: 140, label: "期限", headerPadding: 32, cellPadding: 28, charWidth: 11 },
  invoicePlannedMonth: { minWidth: 140, label: "請求予定月", headerPadding: 32, cellPadding: 28, charWidth: 11 },
  invoiceStatus: { minWidth: 140, label: "請求状態", headerPadding: 32, cellPadding: 28, charWidth: 11 },
  invoiceDueDate: { minWidth: 140, label: "入金期日", headerPadding: 32, cellPadding: 28, charWidth: 11 },
  amountInvoice: { minWidth: 140, label: "請求金額", headerPadding: 32, cellPadding: 28, charWidth: 11 },
  amountOutstanding: { minWidth: 150, label: "未回収額", headerPadding: 32, cellPadding: 28, charWidth: 11 },
  updatedAt: { minWidth: 140, label: "最終更新日", headerPadding: 32, cellPadding: 28, charWidth: 11 },
  actions: { minWidth: 64 },
};
