export type DealStatus =
  | "見込み"
  | "提案中"
  | "契約"
  | "請求準備"
  | "請求済み"
  | "入金済み"
  | "完了/保守";

export type InvoiceStatus = "none" | "draft" | "issued" | "paid";

export type ActivityType =
  | "note"
  | "status_changed"
  | "invoice_issued"
  | "payment_recorded"
  | "next_action_updated";

export type AlertType = "overdue" | "dueSoon" | "unbilled" | "actionOverdue";

export type QuickFilterKey =
  | "none"
  | "overdue"
  | "dueSoon"
  | "unbilledThisMonth"
  | "actionOverdue"
  | "plannedThisMonth"
  | "plannedNextMonth";

export type UserRef = {
  id: string;
  displayName: string;
};

export type CompanyRef = {
  id: string;
  name: string;
};

export type NextAction = {
  text: string;
  owner: UserRef;
  dueDate: string;
};

export type InvoiceInfo = {
  status: InvoiceStatus;
  invoiceDate?: string;
  invoiceDueDate?: string;
  amountInvoice?: number;
  amountPaid?: number;
  paidDate?: string;
};

export type DealLink = {
  label: string;
  url: string;
};

export type ActivityRecord = {
  id: string;
  type: ActivityType;
  body: string;
  createdAt: string;
  createdBy: UserRef;
};

export type AlertDescriptor = {
  type: AlertType;
  label: string;
  reason: string;
};

export type DealRecord = {
  id: string;
  title: string;
  status: DealStatus;
  owner: UserRef;
  company: CompanyRef;
  amountExpected: number;
  amountContract?: number;
  contractDate?: string;
  dueDate?: string;
  nextAction: NextAction;
  invoicePlannedMonth?: string;
  billingToName?: string;
  invoice: InvoiceInfo | null;
  links: DealLink[];
  updatedAt: string;
  activities: ActivityRecord[];
};

export type InvoiceSummary = {
  status: InvoiceStatus;
  invoiceDate?: string;
  invoiceDueDate?: string;
  amountInvoice?: number;
  amountOutstanding?: number;
  paidDate?: string;
};

export type DealViewModel = DealRecord & {
  invoiceSummary: InvoiceSummary;
  alerts: AlertDescriptor[];
};

export type DemoState = {
  deals: DealRecord[];
  users: UserRef[];
  companies: CompanyRef[];
  quickFilter: QuickFilterKey;
  activeNav: "dashboard" | "deals" | "invoices";
  updatedAt: string;
};
