export type InvoiceSummary = {
  status: 'draft' | 'issued' | 'paid' | 'none';
  invoice_date: string;
  invoice_due_date: string;
  amount_invoice: number;
  amount_outstanding: number;
  amount_paid?: number;
  paid_date?: string;
};

export type NextAction = {
  text: string;
  owner_id: string;
  due_date: string;
};

export type Link = {
  title: string;
  url: string;
};

export type Deal = {
  id: string;
  title: string;
  workspace_id: string;
  company_id: string;
  company_name: string;
  status: string;
  owner_id: string;
  owner_name: string;
  amount_contract: number;
  amount_expected?: number;
  contract_date?: string;
  due_date?: string;
  links?: Link[];
  next_action: NextAction;
  invoice_planned_month: string;
  billing_to_name?: string;
  invoice_summary: InvoiceSummary;
  updated_at: string;
  last_activity_summary: string;
};

export type AlertType = 'overdue' | 'due_soon' | 'unbilled_this_month' | 'action_overdue';
export type Alert = {
  type: AlertType;
  priority: number;
  label: string;
  diffDays?: number;
  message?: string;
};

export const DEMO_TODAY = "2025-12-17";

export const SEED_DEALS: Deal[] = [
  {
    "id": "D0001",
    "title": "UIリニューアル（1）",
    "workspace_id": "WS001",
    "company_id": "C018",
    "company_name": "株式会社C018",
    "status": "請求準備",
    "owner_id": "U001",
    "owner_name": "佐藤",
    "amount_contract": 1332000,
    "next_action": {
      "text": "請求情報の確認",
      "owner_id": "U001",
      "due_date": "2025-12-26"
    },
    "invoice_planned_month": "2025-12",
    "invoice_summary": {
      "status": "draft",
      "invoice_date": "",
      "invoice_due_date": "",
      "amount_invoice": 0,
      "amount_outstanding": 0
    },
    "updated_at": "2025-12-02T12:00:00",
    "last_activity_summary": "情報を更新"
  },
  {
    "id": "D0002",
    "title": "UIリニューアル（2）",
    "workspace_id": "WS001",
    "company_id": "C008",
    "company_name": "株式会社C008",
    "status": "契約",
    "owner_id": "U001",
    "owner_name": "佐藤",
    "amount_contract": 908000,
    "amount_expected": 908000,
    "contract_date": "2025-11-20",
    "due_date": "2026-03-31",
    "links": [
      { "title": "契約書", "url": "https://example.com/contract/d0002" }
    ],
    "next_action": {
      "text": "キックオフ調整",
      "owner_id": "U006",
      "due_date": "2026-01-06"
    },
    "invoice_planned_month": "2025-12",
    "invoice_summary": {
      "status": "draft",
      "invoice_date": "",
      "invoice_due_date": "",
      "amount_invoice": 0,
      "amount_outstanding": 0
    },
    "updated_at": "2025-11-02T12:00:00",
    "last_activity_summary": "情報を更新"
  },
  {
    "id": "D0003",
    "title": "採用ページ制作（3）",
    "workspace_id": "WS001",
    "company_id": "C006",
    "company_name": "株式会社C006",
    "status": "契約",
    "owner_id": "U005",
    "owner_name": "伊藤",
    "amount_contract": 1552000,
    "next_action": {
      "text": "キックオフ調整",
      "owner_id": "U002",
      "due_date": "2025-12-29"
    },
    "invoice_planned_month": "2025-12",
    "invoice_summary": {
      "status": "draft",
      "invoice_date": "",
      "invoice_due_date": "",
      "amount_invoice": 0,
      "amount_outstanding": 0
    },
    "updated_at": "2025-12-13T12:00:00",
    "last_activity_summary": "情報を更新"
  },
  {
    "id": "D0004",
    "title": "デザイン監修（4）",
    "workspace_id": "WS001",
    "company_id": "C003",
    "company_name": "株式会社C003",
    "status": "提案中",
    "owner_id": "U002",
    "owner_name": "田中",
    "amount_contract": 0,
    "next_action": {
      "text": "提案内容のすり合わせ",
      "owner_id": "U004",
      "due_date": "2026-01-06"
    },
    "invoice_planned_month": "2025-12",
    "invoice_summary": {
      "status": "draft",
      "invoice_date": "",
      "invoice_due_date": "",
      "amount_invoice": 0,
      "amount_outstanding": 0
    },
    "updated_at": "2025-12-13T12:00:00",
    "last_activity_summary": "情報を更新"
  },
  {
    "id": "D0005",
    "title": "採用ページ制作（5）",
    "workspace_id": "WS001",
    "company_id": "C009",
    "company_name": "株式会社I 御中",
    "status": "見込み",
    "owner_id": "U002",
    "owner_name": "田中",
    "amount_contract": 0,
    "next_action": {
      "text": "初回連絡",
      "owner_id": "U005",
      "due_date": "2025-12-24"
    },
    "invoice_planned_month": "2025-12",
    "invoice_summary": {
      "status": "draft",
      "invoice_date": "",
      "invoice_due_date": "",
      "amount_invoice": 0,
      "amount_outstanding": 0
    },
    "updated_at": "2025-11-24T12:00:00",
    "last_activity_summary": "情報を更新"
  },
  {
    "id": "D0006",
    "title": "CRM導入支援（6）",
    "workspace_id": "WS001",
    "company_id": "C005",
    "company_name": "株式会社E 御中",
    "status": "入金済み",
    "owner_id": "U005",
    "owner_name": "伊藤",
    "amount_contract": 463000,
    "next_action": {
      "text": "完了の確認（必要なら）",
      "owner_id": "U005",
      "due_date": "2025-12-10"
    },
    "invoice_planned_month": "2026-01",
    "invoice_summary": {
      "status": "paid",
      "invoice_date": "2025-11-17",
      "invoice_due_date": "2025-12-31",
      "amount_invoice": 463000,
      "amount_outstanding": 0,
      "amount_paid": 463000,
      "paid_date": "2025-11-30"
    },
    "updated_at": "2025-12-03T12:00:00",
    "last_activity_summary": "情報を更新"
  },
  {
    "id": "D0007",
    "title": "広告運用（7）",
    "workspace_id": "WS001",
    "company_id": "C001",
    "company_name": "株式会社A 御中",
    "status": "請求準備",
    "owner_id": "U006",
    "owner_name": "渡辺",
    "amount_contract": 1724000,
    "next_action": {
      "text": "請求情報の確認",
      "owner_id": "U003",
      "due_date": "2025-12-31"
    },
    "invoice_planned_month": "2025-12",
    "invoice_summary": {
      "status": "draft",
      "invoice_date": "",
      "invoice_due_date": "",
      "amount_invoice": 0,
      "amount_outstanding": 0
    },
    "updated_at": "2025-10-23T12:00:00",
    "last_activity_summary": "情報を更新"
  },
  {
    "id": "D0008",
    "title": "バナー制作（8）",
    "workspace_id": "WS001",
    "company_id": "C009",
    "company_name": "株式会社C009",
    "status": "提案中",
    "owner_id": "U005",
    "owner_name": "伊藤",
    "amount_contract": 0,
    "next_action": {
      "text": "提案内容のすり合わせ",
      "owner_id": "U006",
      "due_date": "2025-12-23"
    },
    "invoice_planned_month": "2025-12",
    "invoice_summary": {
      "status": "draft",
      "invoice_date": "",
      "invoice_due_date": "",
      "amount_invoice": 0,
      "amount_outstanding": 0
    },
    "updated_at": "2025-10-31T12:00:00",
    "last_activity_summary": "情報を更新"
  },
  {
    "id": "D0009",
    "title": "アクセス解析整備（9）",
    "workspace_id": "WS001",
    "company_id": "C006",
    "company_name": "株式会社F 御中",
    "status": "請求準備",
    "owner_id": "U005",
    "owner_name": "伊藤",
    "amount_contract": 893000,
    "next_action": {
      "text": "請求情報の確認",
      "owner_id": "U001",
      "due_date": "2025-12-07"
    },
    "invoice_planned_month": "2025-12",
    "invoice_summary": {
      "status": "draft",
      "invoice_date": "",
      "invoice_due_date": "",
      "amount_invoice": 0,
      "amount_outstanding": 0
    },
    "updated_at": "2025-12-02T12:00:00",
    "last_activity_summary": "情報を更新"
  },
  {
    "id": "D0010",
    "title": "CRM導入支援（10）",
    "workspace_id": "WS001",
    "company_id": "C003",
    "company_name": "株式会社C003",
    "status": "契約",
    "owner_id": "U006",
    "owner_name": "渡辺",
    "amount_contract": 1718000,
    "next_action": {
      "text": "キックオフ調整",
      "owner_id": "U006",
      "due_date": "2026-01-05"
    },
    "invoice_planned_month": "2025-12",
    "invoice_summary": {
      "status": "draft",
      "invoice_date": "",
      "invoice_due_date": "",
      "amount_invoice": 0,
      "amount_outstanding": 0
    },
    "updated_at": "2025-12-11T12:00:00",
    "last_activity_summary": "情報を更新"
  },
  {
    "id": "D0011",
    "title": "フォーム最適化（11）",
    "workspace_id": "WS001",
    "company_id": "C017",
    "company_name": "株式会社Q 御中",
    "status": "請求準備",
    "owner_id": "U005",
    "owner_name": "伊藤",
    "amount_contract": 967000,
    "next_action": {
      "text": "請求情報の確認",
      "owner_id": "U005",
      "due_date": "2025-12-24"
    },
    "invoice_planned_month": "2025-12",
    "invoice_summary": {
      "status": "draft",
      "invoice_date": "",
      "invoice_due_date": "",
      "amount_invoice": 0,
      "amount_outstanding": 0
    },
    "updated_at": "2025-11-08T12:00:00",
    "last_activity_summary": "情報を更新"
  },
  {
    "id": "D0012",
    "title": "LP制作（12）",
    "workspace_id": "WS001",
    "company_id": "C003",
    "company_name": "株式会社C 御中",
    "status": "契約",
    "owner_id": "U003",
    "owner_name": "鈴木",
    "amount_contract": 164000,
    "next_action": {
      "text": "キックオフ調整",
      "owner_id": "U002",
      "due_date": "2025-12-16"
    },
    "invoice_planned_month": "2026-01",
    "invoice_summary": {
      "status": "draft",
      "invoice_date": "",
      "invoice_due_date": "",
      "amount_invoice": 0,
      "amount_outstanding": 0
    },
    "updated_at": "2025-11-03T12:00:00",
    "last_activity_summary": "情報を更新"
  },
  {
    "id": "D0013",
    "title": "採用ページ制作（13）",
    "workspace_id": "WS001",
    "company_id": "C003",
    "company_name": "株式会社C003",
    "status": "提案中",
    "owner_id": "U005",
    "owner_name": "伊藤",
    "amount_contract": 0,
    "next_action": {
      "text": "提案内容のすり合わせ",
      "owner_id": "U006",
      "due_date": "2026-01-05"
    },
    "invoice_planned_month": "2026-01",
    "invoice_summary": {
      "status": "draft",
      "invoice_date": "",
      "invoice_due_date": "",
      "amount_invoice": 0,
      "amount_outstanding": 0
    },
    "updated_at": "2025-11-27T12:00:00",
    "last_activity_summary": "情報を更新"
  },
  {
    "id": "D0014",
    "title": "フォーム最適化（14）",
    "workspace_id": "WS001",
    "company_id": "C008",
    "company_name": "株式会社H 御中",
    "status": "見込み",
    "owner_id": "U004",
    "owner_name": "高橋",
    "amount_contract": 0,
    "next_action": {
      "text": "初回連絡",
      "owner_id": "U003",
      "due_date": "2025-12-31"
    },
    "invoice_planned_month": "2026-01",
    "invoice_summary": {
      "status": "draft",
      "invoice_date": "",
      "invoice_due_date": "",
      "amount_invoice": 0,
      "amount_outstanding": 0
    },
    "updated_at": "2025-12-12T12:00:00",
    "last_activity_summary": "情報を更新"
  },
  {
    "id": "D0015",
    "title": "広告運用（15）",
    "workspace_id": "WS001",
    "company_id": "C002",
    "company_name": "株式会社B 御中",
    "status": "請求済み",
    "owner_id": "U006",
    "owner_name": "渡辺",
    "amount_contract": 659000,
    "next_action": {
      "text": "入金予定の確認",
      "owner_id": "U005",
      "due_date": "2025-12-30"
    },
    "invoice_planned_month": "2025-12",
    "invoice_summary": {
      "status": "issued",
      "invoice_date": "2025-12-09",
      "invoice_due_date": "2025-12-12",
      "amount_invoice": 659000,
      "amount_outstanding": 659000
    },
    "updated_at": "2025-11-26T12:00:00",
    "last_activity_summary": "情報を更新"
  },
  {
    "id": "D0016",
    "title": "GA4設定（16）",
    "workspace_id": "WS001",
    "company_id": "C003",
    "company_name": "株式会社C 御中",
    "status": "請求済み",
    "owner_id": "U004",
    "owner_name": "高橋",
    "amount_contract": 1862000,
    "next_action": {
      "text": "入金予定の確認",
      "owner_id": "U002",
      "due_date": "2025-12-09"
    },
    "invoice_planned_month": "2026-01",
    "invoice_summary": {
      "status": "issued",
      "invoice_date": "2025-12-07",
      "invoice_due_date": "2025-12-16",
      "amount_invoice": 1862000,
      "amount_outstanding": 1862000
    },
    "updated_at": "2025-12-13T12:00:00",
    "last_activity_summary": "情報を更新"
  },
  {
    "id": "D0017",
    "title": "LP制作（17）",
    "workspace_id": "WS001",
    "company_id": "C006",
    "company_name": "株式会社C006",
    "status": "提案中",
    "owner_id": "U004",
    "owner_name": "高橋",
    "amount_contract": 0,
    "next_action": {
      "text": "提案内容のすり合わせ",
      "owner_id": "U003",
      "due_date": "2026-01-05"
    },
    "invoice_planned_month": "2026-01",
    "invoice_summary": {
      "status": "draft",
      "invoice_date": "",
      "invoice_due_date": "",
      "amount_invoice": 0,
      "amount_outstanding": 0
    },
    "updated_at": "2025-12-11T12:00:00",
    "last_activity_summary": "情報を更新"
  },
  {
    "id": "D0018",
    "title": "ECサイト運用（18）",
    "workspace_id": "WS001",
    "company_id": "C016",
    "company_name": "株式会社P 御中",
    "status": "請求準備",
    "owner_id": "U002",
    "owner_name": "田中",
    "amount_contract": 1681000,
    "next_action": {
      "text": "請求情報の確認",
      "owner_id": "U001",
      "due_date": "2026-01-02"
    },
    "invoice_planned_month": "2026-01",
    "invoice_summary": {
      "status": "draft",
      "invoice_date": "",
      "invoice_due_date": "",
      "amount_invoice": 0,
      "amount_outstanding": 0
    },
    "updated_at": "2025-12-17T12:00:00",
    "last_activity_summary": "情報を更新"
  },
  {
    "id": "D0019",
    "title": "SEO改善（19）",
    "workspace_id": "WS001",
    "company_id": "C002",
    "company_name": "株式会社B 御中",
    "status": "請求済み",
    "owner_id": "U005",
    "owner_name": "伊藤",
    "amount_contract": 1532000,
    "next_action": {
      "text": "入金予定の確認",
      "owner_id": "U001",
      "due_date": "2026-01-05"
    },
    "invoice_planned_month": "2025-12",
    "invoice_summary": {
      "status": "issued",
      "invoice_date": "2025-12-02",
      "invoice_due_date": "2025-12-19",
      "amount_invoice": 1532000,
      "amount_outstanding": 1532000
    },
    "updated_at": "2025-12-17T12:00:00",
    "last_activity_summary": "情報を更新"
  },
  {
    "id": "D0020",
    "title": "デザイン監修（20）",
    "workspace_id": "WS001",
    "company_id": "C014",
    "company_name": "株式会社C014",
    "status": "見込み",
    "owner_id": "U006",
    "owner_name": "渡辺",
    "amount_contract": 0,
    "next_action": {
      "text": "初回連絡",
      "owner_id": "U006",
      "due_date": "2025-12-24"
    },
    "invoice_planned_month": "2026-01",
    "invoice_summary": {
      "status": "draft",
      "invoice_date": "",
      "invoice_due_date": "",
      "amount_invoice": 0,
      "amount_outstanding": 0
    },
    "updated_at": "2025-11-24T12:00:00",
    "last_activity_summary": "情報を更新"
  },
  {
    "id": "D0021",
    "title": "SNS運用（21）",
    "workspace_id": "WS001",
    "company_id": "C005",
    "company_name": "株式会社E 御中",
    "status": "入金済み",
    "owner_id": "U006",
    "owner_name": "渡辺",
    "amount_contract": 298000,
    "next_action": {
      "text": "完了の確認（必要なら）",
      "owner_id": "U005",
      "due_date": "2025-12-22"
    },
    "invoice_planned_month": "2025-12",
    "invoice_summary": {
      "status": "paid",
      "invoice_date": "2025-11-18",
      "invoice_due_date": "2025-12-31",
      "amount_invoice": 298000,
      "amount_outstanding": 0,
      "amount_paid": 298000,
      "paid_date": "2025-11-20"
    },
    "updated_at": "2025-12-11T12:00:00",
    "last_activity_summary": "情報を更新"
  },
  {
    "id": "D0022",
    "title": "SEO改善（22）",
    "workspace_id": "WS001",
    "company_id": "C005",
    "company_name": "株式会社C005",
    "status": "契約",
    "owner_id": "U003",
    "owner_name": "鈴木",
    "amount_contract": 1857000,
    "next_action": {
      "text": "キックオフ調整",
      "owner_id": "U005",
      "due_date": "2026-01-06"
    },
    "invoice_planned_month": "2026-01",
    "invoice_summary": {
      "status": "draft",
      "invoice_date": "",
      "invoice_due_date": "",
      "amount_invoice": 0,
      "amount_outstanding": 0
    },
    "updated_at": "2025-11-30T12:00:00",
    "last_activity_summary": "情報を更新"
  },
  {
    "id": "D0023",
    "title": "広告運用（23）",
    "workspace_id": "WS001",
    "company_id": "C018",
    "company_name": "株式会社R 御中",
    "status": "請求済み",
    "owner_id": "U003",
    "owner_name": "鈴木",
    "amount_contract": 1670000,
    "next_action": {
      "text": "入金予定の確認",
      "owner_id": "U003",
      "due_date": "2025-12-23"
    },
    "invoice_planned_month": "2026-01",
    "invoice_summary": {
      "status": "issued",
      "invoice_date": "2025-12-07",
      "invoice_due_date": "2025-12-21",
      "amount_invoice": 1670000,
      "amount_outstanding": 1670000
    },
    "updated_at": "2025-12-17T12:00:00",
    "last_activity_summary": "情報を更新"
  },
  {
    "id": "D0024",
    "title": "CRM導入支援（24）",
    "workspace_id": "WS001",
    "company_id": "C009",
    "company_name": "株式会社I 御中",
    "status": "完了",
    "owner_id": "U005",
    "owner_name": "伊藤",
    "amount_contract": 339000,
    "next_action": {
      "text": "次回提案の検討",
      "owner_id": "U001",
      "due_date": "2025-12-14"
    },
    "invoice_planned_month": "2026-01",
    "invoice_summary": {
      "status": "paid",
      "invoice_date": "2025-11-06",
      "invoice_due_date": "2025-12-31",
      "amount_invoice": 339000,
      "amount_outstanding": 0,
      "amount_paid": 339000,
      "paid_date": "2025-11-10"
    },
    "updated_at": "2025-12-07T12:00:00",
    "last_activity_summary": "情報を更新"
  },
  {
    "id": "D0025",
    "title": "LP制作（25）",
    "workspace_id": "WS001",
    "company_id": "C014",
    "company_name": "株式会社N 御中",
    "status": "入金済み",
    "owner_id": "U005",
    "owner_name": "伊藤",
    "amount_contract": 455000,
    "next_action": {
      "text": "完了の確認（必要なら）",
      "owner_id": "U003",
      "due_date": "2025-12-22"
    },
    "invoice_planned_month": "2026-01",
    "invoice_summary": {
      "status": "paid",
      "invoice_date": "2025-11-05",
      "invoice_due_date": "2025-12-31",
      "amount_invoice": 455000,
      "amount_outstanding": 0,
      "amount_paid": 455000,
      "paid_date": "2025-11-08"
    },
    "updated_at": "2025-12-12T12:00:00",
    "last_activity_summary": "情報を更新"
  },
  {
    "id": "D0026",
    "title": "ECサイト運用（26）",
    "workspace_id": "WS001",
    "company_id": "C002",
    "company_name": "株式会社B 御中",
    "status": "請求準備",
    "owner_id": "U003",
    "owner_name": "鈴木",
    "amount_contract": 1747000,
    "next_action": {
      "text": "請求情報の確認",
      "owner_id": "U005",
      "due_date": "2025-12-24"
    },
    "invoice_planned_month": "2026-01",
    "invoice_summary": {
      "status": "draft",
      "invoice_date": "",
      "invoice_due_date": "",
      "amount_invoice": 0,
      "amount_outstanding": 0
    },
    "updated_at": "2025-12-17T12:00:00",
    "last_activity_summary": "情報を更新"
  },
  {
    "id": "D0027",
    "title": "LP制作（27）",
    "workspace_id": "WS001",
    "company_id": "C006",
    "company_name": "株式会社F 御中",
    "status": "請求準備",
    "owner_id": "U004",
    "owner_name": "高橋",
    "amount_contract": 1792000,
    "next_action": {
      "text": "請求情報の確認",
      "owner_id": "U002",
      "due_date": "2025-12-22"
    },
    "invoice_planned_month": "2026-01",
    "invoice_summary": {
      "status": "draft",
      "invoice_date": "",
      "invoice_due_date": "",
      "amount_invoice": 0,
      "amount_outstanding": 0
    },
    "updated_at": "2025-11-19T12:00:00",
    "last_activity_summary": "情報を更新"
  },
  {
    "id": "D0028",
    "title": "採用ページ制作（28）",
    "workspace_id": "WS001",
    "company_id": "C002",
    "company_name": "株式会社C002",
    "status": "契約",
    "owner_id": "U004",
    "owner_name": "高橋",
    "amount_contract": 775000,
    "next_action": {
      "text": "キックオフ調整",
      "owner_id": "U001",
      "due_date": "2025-12-29"
    },
    "invoice_planned_month": "",
    "invoice_summary": {
      "status": "draft",
      "invoice_date": "",
      "invoice_due_date": "",
      "amount_invoice": 0,
      "amount_outstanding": 0
    },
    "updated_at": "2025-12-12T12:00:00",
    "last_activity_summary": "情報を更新"
  },
  {
    "id": "D0029",
    "title": "UX改善（29）",
    "workspace_id": "WS001",
    "company_id": "C003",
    "company_name": "株式会社C003",
    "status": "契約",
    "owner_id": "U003",
    "owner_name": "鈴木",
    "amount_contract": 828000,
    "next_action": {
      "text": "キックオフ調整",
      "owner_id": "U003",
      "due_date": "2025-12-12"
    },
    "invoice_planned_month": "",
    "invoice_summary": {
      "status": "draft",
      "invoice_date": "",
      "invoice_due_date": "",
      "amount_invoice": 0,
      "amount_outstanding": 0
    },
    "updated_at": "2025-10-28T12:00:00",
    "last_activity_summary": "情報を更新"
  },
  {
    "id": "D0030",
    "title": "UX改善（30）",
    "workspace_id": "WS001",
    "company_id": "C020",
    "company_name": "株式会社T 御中",
    "status": "入金済み",
    "owner_id": "U004",
    "owner_name": "高橋",
    "amount_contract": 1391000,
    "next_action": {
      "text": "完了の確認（必要なら）",
      "owner_id": "U004",
      "due_date": "2025-12-23"
    },
    "invoice_planned_month": "2026-01",
    "invoice_summary": {
      "status": "paid",
      "invoice_date": "2025-11-02",
      "invoice_due_date": "2025-12-31",
      "amount_invoice": 1391000,
      "amount_outstanding": 0
    },
    "updated_at": "2025-12-14T12:00:00",
    "last_activity_summary": "情報を更新"
  },
  {
    "id": "D0031",
    "title": "ECサイト運用（31）",
    "workspace_id": "WS001",
    "company_id": "C017",
    "company_name": "株式会社Q 御中",
    "status": "完了",
    "owner_id": "U005",
    "owner_name": "伊藤",
    "amount_contract": 826000,
    "next_action": {
      "text": "次回提案の検討",
      "owner_id": "U006",
      "due_date": "2025-12-26"
    },
    "invoice_planned_month": "2026-01",
    "invoice_summary": {
      "status": "paid",
      "invoice_date": "2025-11-22",
      "invoice_due_date": "2025-12-31",
      "amount_invoice": 826000,
      "amount_outstanding": 0
    },
    "updated_at": "2025-10-29T12:00:00",
    "last_activity_summary": "情報を更新"
  },
  {
    "id": "D0032",
    "title": "動画編集（32）",
    "workspace_id": "WS001",
    "company_id": "C010",
    "company_name": "株式会社J 御中",
    "status": "請求済み",
    "owner_id": "U005",
    "owner_name": "伊藤",
    "amount_contract": 1537000,
    "next_action": {
      "text": "入金予定の確認",
      "owner_id": "U004",
      "due_date": "2025-12-17"
    },
    "invoice_planned_month": "2026-01",
    "invoice_summary": {
      "status": "issued",
      "invoice_date": "2025-12-10",
      "invoice_due_date": "2025-12-27",
      "amount_invoice": 1537000,
      "amount_outstanding": 1537000
    },
    "updated_at": "2025-12-15T12:00:00",
    "last_activity_summary": "情報を更新"
  },
  {
    "id": "D0033",
    "title": "記事制作（33）",
    "workspace_id": "WS001",
    "company_id": "C019",
    "company_name": "株式会社S 御中",
    "status": "請求済み",
    "owner_id": "U005",
    "owner_name": "伊藤",
    "amount_contract": 587000,
    "next_action": {
      "text": "入金予定の確認",
      "owner_id": "U006",
      "due_date": "2025-12-15"
    },
    "invoice_planned_month": "2026-01",
    "invoice_summary": {
      "status": "issued",
      "invoice_date": "2025-12-17",
      "invoice_due_date": "2026-01-31",
      "amount_invoice": 587000,
      "amount_outstanding": 587000
    },
    "updated_at": "2025-12-17T12:00:00",
    "last_activity_summary": "情報を更新"
  },
  {
    "id": "D0034",
    "title": "SEO改善（34）",
    "workspace_id": "WS001",
    "company_id": "C020",
    "company_name": "株式会社T 御中",
    "status": "入金済み",
    "owner_id": "U003",
    "owner_name": "鈴木",
    "amount_contract": 1527000,
    "next_action": {
      "text": "完了の確認（必要なら）",
      "owner_id": "U002",
      "due_date": "2025-12-16"
    },
    "invoice_planned_month": "2025-12",
    "invoice_summary": {
      "status": "paid",
      "invoice_date": "2025-11-16",
      "invoice_due_date": "2025-12-31",
      "amount_invoice": 1527000,
      "amount_outstanding": 0
    },
    "updated_at": "2025-11-25T12:00:00",
    "last_activity_summary": "情報を更新"
  },
  {
    "id": "D0035",
    "title": "デザイン監修（35）",
    "workspace_id": "WS001",
    "company_id": "C015",
    "company_name": "株式会社O 御中",
    "status": "提案中",
    "owner_id": "U004",
    "owner_name": "高橋",
    "amount_contract": 0,
    "next_action": {
      "text": "提案内容のすり合わせ",
      "owner_id": "U004",
      "due_date": "2025-12-16"
    },
    "invoice_planned_month": "",
    "invoice_summary": {
      "status": "draft",
      "invoice_date": "",
      "invoice_due_date": "",
      "amount_invoice": 0,
      "amount_outstanding": 0
    },
    "updated_at": "2025-11-16T12:00:00",
    "last_activity_summary": "情報を更新"
  },
  {
    "id": "D0036",
    "title": "採用ページ制作（36）",
    "workspace_id": "WS001",
    "company_id": "C004",
    "company_name": "株式会社D 御中",
    "status": "完了",
    "owner_id": "U004",
    "owner_name": "高橋",
    "amount_contract": 1101000,
    "next_action": {
      "text": "次回提案の検討",
      "owner_id": "U001",
      "due_date": "2025-12-31"
    },
    "invoice_planned_month": "2026-01",
    "invoice_summary": {
      "status": "paid",
      "invoice_date": "2025-11-25",
      "invoice_due_date": "2025-12-25",
      "amount_invoice": 1101000,
      "amount_outstanding": 0
    },
    "updated_at": "2025-12-14T12:00:00",
    "last_activity_summary": "情報を更新"
  },
  {
    "id": "D0037",
    "title": "GA4設定（37）",
    "workspace_id": "WS001",
    "company_id": "C017",
    "company_name": "株式会社Q 御中",
    "status": "完了",
    "owner_id": "U004",
    "owner_name": "高橋",
    "amount_contract": 1914000,
    "next_action": {
      "text": "次回提案の検討",
      "owner_id": "U003",
      "due_date": "2026-01-06"
    },
    "invoice_planned_month": "2026-01",
    "invoice_summary": {
      "status": "paid",
      "invoice_date": "2025-11-25",
      "invoice_due_date": "2025-12-31",
      "amount_invoice": 1914000,
      "amount_outstanding": 0
    },
    "updated_at": "2025-10-24T12:00:00",
    "last_activity_summary": "情報を更新"
  },
  {
    "id": "D0038",
    "title": "メルマガ設計（38）",
    "workspace_id": "WS001",
    "company_id": "C008",
    "company_name": "株式会社C008",
    "status": "見込み",
    "owner_id": "U003",
    "owner_name": "鈴木",
    "amount_contract": 0,
    "next_action": {
      "text": "初回連絡",
      "owner_id": "U003",
      "due_date": "2026-01-05"
    },
    "invoice_planned_month": "",
    "invoice_summary": {
      "status": "draft",
      "invoice_date": "",
      "invoice_due_date": "",
      "amount_invoice": 0,
      "amount_outstanding": 0
    },
    "updated_at": "2025-11-25T12:00:00",
    "last_activity_summary": "情報を更新"
  },
  {
    "id": "D0039",
    "title": "UIリニューアル（39）",
    "workspace_id": "WS001",
    "company_id": "C005",
    "company_name": "株式会社E 御中",
    "status": "請求準備",
    "owner_id": "U002",
    "owner_name": "田中",
    "amount_contract": 999000,
    "next_action": {
      "text": "請求情報の確認",
      "owner_id": "U005",
      "due_date": "2025-12-18"
    },
    "invoice_planned_month": "2025-12",
    "invoice_summary": {
      "status": "draft",
      "invoice_date": "",
      "invoice_due_date": "",
      "amount_invoice": 0,
      "amount_outstanding": 0
    },
    "updated_at": "2025-12-11T12:00:00",
    "last_activity_summary": "情報を更新"
  },
  {
    "id": "D0040",
    "title": "デザイン監修（40）",
    "workspace_id": "WS001",
    "company_id": "C014",
    "company_name": "株式会社N 御中",
    "status": "請求済み",
    "owner_id": "U004",
    "owner_name": "高橋",
    "amount_contract": 1329000,
    "next_action": {
      "text": "入金予定の確認",
      "owner_id": "U001",
      "due_date": "2025-12-26"
    },
    "invoice_planned_month": "2026-01",
    "invoice_summary": {
      "status": "issued",
      "invoice_date": "2025-12-14",
      "invoice_due_date": "2026-01-31",
      "amount_invoice": 1329000,
      "amount_outstanding": 1329000
    },
    "updated_at": "2025-12-15T12:00:00",
    "last_activity_summary": "情報を更新"
  },
  {
    "id": "D0041",
    "title": "採用ページ制作（41）",
    "workspace_id": "WS001",
    "company_id": "C018",
    "company_name": "株式会社R 御中",
    "status": "見込み",
    "owner_id": "U005",
    "owner_name": "伊藤",
    "amount_contract": 0,
    "next_action": {
      "text": "初回連絡",
      "owner_id": "U001",
      "due_date": "2025-12-29"
    },
    "invoice_planned_month": "",
    "invoice_summary": {
      "status": "draft",
      "invoice_date": "",
      "invoice_due_date": "",
      "amount_invoice": 0,
      "amount_outstanding": 0
    },
    "updated_at": "2025-12-16T12:00:00",
    "last_activity_summary": "情報を更新"
  },
  {
    "id": "D0042",
    "title": "運用改善（42）",
    "workspace_id": "WS001",
    "company_id": "C015",
    "company_name": "株式会社O 御中",
    "status": "請求済み",
    "owner_id": "U002",
    "owner_name": "田中",
    "amount_contract": 1362000,
    "next_action": {
      "text": "入金予定の確認",
      "owner_id": "U001",
      "due_date": "2025-12-22"
    },
    "invoice_planned_month": "2026-01",
    "invoice_summary": {
      "status": "issued",
      "invoice_date": "2025-12-06",
      "invoice_due_date": "2026-01-31",
      "amount_invoice": 1362000,
      "amount_outstanding": 1362000
    },
    "updated_at": "2025-12-14T12:00:00",
    "last_activity_summary": "情報を更新"
  },
  {
    "id": "D0043",
    "title": "ECサイト運用（43）",
    "workspace_id": "WS001",
    "company_id": "C013",
    "company_name": "株式会社C013",
    "status": "見込み",
    "owner_id": "U003",
    "owner_name": "鈴木",
    "amount_contract": 0,
    "next_action": {
      "text": "初回連絡",
      "owner_id": "U003",
      "due_date": "2025-12-30"
    },
    "invoice_planned_month": "",
    "invoice_summary": {
      "status": "draft",
      "invoice_date": "",
      "invoice_due_date": "",
      "amount_invoice": 0,
      "amount_outstanding": 0
    },
    "updated_at": "2025-12-11T12:00:00",
    "last_activity_summary": "情報を更新"
  },
  {
    "id": "D0044",
    "title": "LP制作（44）",
    "workspace_id": "WS001",
    "company_id": "C003",
    "company_name": "株式会社C 御中",
    "status": "提案中",
    "owner_id": "U004",
    "owner_name": "高橋",
    "amount_contract": 0,
    "next_action": {
      "text": "提案内容のすり合わせ",
      "owner_id": "U006",
      "due_date": "2025-12-16"
    },
    "invoice_planned_month": "",
    "invoice_summary": {
      "status": "draft",
      "invoice_date": "",
      "invoice_due_date": "",
      "amount_invoice": 0,
      "amount_outstanding": 0
    },
    "updated_at": "2025-11-18T12:00:00",
    "last_activity_summary": "情報を更新"
  },
  {
    "id": "D0045",
    "title": "LP制作（45）",
    "workspace_id": "WS001",
    "company_id": "C008",
    "company_name": "株式会社C008",
    "status": "提案中",
    "owner_id": "U002",
    "owner_name": "田中",
    "amount_contract": 0,
    "next_action": {
      "text": "提案内容のすり合わせ",
      "owner_id": "U006",
      "due_date": "2025-12-13"
    },
    "invoice_planned_month": "",
    "invoice_summary": {
      "status": "draft",
      "invoice_date": "",
      "invoice_due_date": "",
      "amount_invoice": 0,
      "amount_outstanding": 0
    },
    "updated_at": "2025-12-16T12:00:00",
    "last_activity_summary": "情報を更新"
  },
  {
    "id": "D0046",
    "title": "バナー制作（46）",
    "workspace_id": "WS001",
    "company_id": "C009",
    "company_name": "株式会社C009",
    "status": "提案中",
    "owner_id": "U003",
    "owner_name": "鈴木",
    "amount_contract": 0,
    "next_action": {
      "text": "提案内容のすり合わせ",
      "owner_id": "U002",
      "due_date": "2025-12-22"
    },
    "invoice_planned_month": "",
    "invoice_summary": {
      "status": "draft",
      "invoice_date": "",
      "invoice_due_date": "",
      "amount_invoice": 0,
      "amount_outstanding": 0
    },
    "updated_at": "2025-10-24T12:00:00",
    "last_activity_summary": "情報を更新"
  },
  {
    "id": "D0047",
    "title": "UIリニューアル（47）",
    "workspace_id": "WS001",
    "company_id": "C010",
    "company_name": "株式会社J 御中",
    "status": "契約",
    "owner_id": "U005",
    "owner_name": "伊藤",
    "amount_contract": 1362000,
    "next_action": {
      "text": "キックオフ調整",
      "owner_id": "U006",
      "due_date": "2026-01-05"
    },
    "invoice_planned_month": "",
    "invoice_summary": {
      "status": "draft",
      "invoice_date": "",
      "invoice_due_date": "",
      "amount_invoice": 0,
      "amount_outstanding": 0
    },
    "updated_at": "2025-12-14T12:00:00",
    "last_activity_summary": "情報を更新"
  },
  {
    "id": "D0048",
    "title": "UX改善（48）",
    "workspace_id": "WS001",
    "company_id": "C019",
    "company_name": "株式会社S 御中",
    "status": "見込み",
    "owner_id": "U001",
    "owner_name": "佐藤",
    "amount_contract": 0,
    "next_action": {
      "text": "初回連絡",
      "owner_id": "U005",
      "due_date": "2025-12-17"
    },
    "invoice_planned_month": "",
    "invoice_summary": {
      "status": "draft",
      "invoice_date": "",
      "invoice_due_date": "",
      "amount_invoice": 0,
      "amount_outstanding": 0
    },
    "updated_at": "2025-11-17T12:00:00",
    "last_activity_summary": "情報を更新"
  },
  {
    "id": "D0049",
    "title": "フォーム最適化（49）",
    "workspace_id": "WS001",
    "company_id": "C016",
    "company_name": "株式会社P 御中",
    "status": "見込み",
    "owner_id": "U001",
    "owner_name": "佐藤",
    "amount_contract": 0,
    "next_action": {
      "text": "初回連絡",
      "owner_id": "U006",
      "due_date": "2025-12-14"
    },
    "invoice_planned_month": "",
    "invoice_summary": {
      "status": "draft",
      "invoice_date": "",
      "invoice_due_date": "",
      "amount_invoice": 0,
      "amount_outstanding": 0
    },
    "updated_at": "2025-12-16T12:00:00",
    "last_activity_summary": "情報を更新"
  },
  {
    "id": "D0050",
    "title": "GA4設定（50）",
    "workspace_id": "WS001",
    "company_id": "C009",
    "company_name": "株式会社I 御中",
    "status": "入金済み",
    "owner_id": "U005",
    "owner_name": "伊藤",
    "amount_contract": 1841000,
    "next_action": {
      "text": "完了の確認（必要なら）",
      "owner_id": "U003",
      "due_date": "2025-12-19"
    },
    "invoice_planned_month": "2026-01",
    "invoice_summary": {
      "status": "paid",
      "invoice_date": "2025-11-29",
      "invoice_due_date": "2025-12-31",
      "amount_invoice": 1841000,
      "amount_outstanding": 0
    },
    "updated_at": "2025-11-13T12:00:00",
    "last_activity_summary": "情報を更新"
  }
];
