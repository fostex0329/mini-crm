import type { DemoState, DealRecord, UserRef, CompanyRef, ActivityRecord } from "@/types/crm";

const users: UserRef[] = [
  { id: "user_sato", displayName: "佐藤 恵" },
  { id: "user_tanaka", displayName: "田中 太郎" },
  { id: "user_suzuki", displayName: "鈴木 一郎" },
  { id: "user_takahashi", displayName: "高橋 京子" },
  { id: "user_ito", displayName: "伊藤 優" },
];

const companies: CompanyRef[] = [
  { id: "company_a", name: "A社" },
  { id: "company_b", name: "B社" },
  { id: "company_c", name: "C社" },
  { id: "company_d", name: "D社" },
  { id: "company_e", name: "E社" },
  { id: "company_f", name: "F社" },
  { id: "company_g", name: "G社" },
  { id: "company_h", name: "H社" },
];

const activity = (id: string, body: string, createdBy: UserRef, createdAt: string): ActivityRecord => ({
  id,
  type: "note",
  body,
  createdBy,
  createdAt,
});

const deals: DealRecord[] = [
  {
    id: "D1",
    title: "LP制作",
    status: "請求済み",
    owner: users[0],
    company: companies[0],
    amountExpected: 300000,
    amountContract: 300000,
    nextAction: {
      text: "入金確認（遅延対応）",
      owner: users[0],
      dueDate: "2025-12-16",
    },
    invoicePlannedMonth: "2025-12",
    billingToName: "A社 経理部",
    invoice: {
      status: "issued",
      invoiceDate: "2025-12-05",
      invoiceDueDate: "2025-12-15",
      amountInvoice: 300000,
    },
    links: [],
    updatedAt: "2025-12-16",
    activities: [
      activity("act_d1_1", "請求書を送付しました。", users[0], "2025-12-05"),
    ],
  },
  {
    id: "D2",
    title: "動画編集",
    status: "請求済み",
    owner: users[1],
    company: companies[1],
    amountExpected: 180000,
    amountContract: 180000,
    nextAction: {
      text: "入金予定の確認",
      owner: users[1],
      dueDate: "2025-12-19",
    },
    invoicePlannedMonth: "2025-12",
    billingToName: "B社 経理チーム",
    invoice: {
      status: "issued",
      invoiceDate: "2025-12-08",
      invoiceDueDate: "2025-12-22",
      amountInvoice: 180000,
    },
    links: [],
    updatedAt: "2025-12-18",
    activities: [
      activity("act_d2_1", "請求準備を完了しました。", users[1], "2025-12-08"),
    ],
  },
  {
    id: "D3",
    title: "運用改善",
    status: "請求準備",
    owner: users[2],
    company: companies[2],
    amountExpected: 250000,
    amountContract: 250000,
    nextAction: {
      text: "請求書の作成・発行",
      owner: users[2],
      dueDate: "2025-12-16",
    },
    invoicePlannedMonth: "2025-12",
    billingToName: "C社 経理部",
    invoice: {
      status: "draft",
    },
    links: [],
    updatedAt: "2025-12-15",
    activities: [
      activity("act_d3_1", "契約内容を最終確認しました。", users[2], "2025-12-10"),
    ],
  },
  {
    id: "D4",
    title: "バナー修正",
    status: "契約",
    owner: users[3],
    company: companies[3],
    amountExpected: 120000,
    amountContract: 120000,
    nextAction: {
      text: "次の一手を更新",
      owner: users[3],
      dueDate: "2025-12-14",
    },
    invoicePlannedMonth: undefined,
    invoice: {
      status: "none",
    },
    links: [],
    updatedAt: "2025-12-14",
    activities: [
      activity("act_d4_1", "契約締結済み。請求条件の確認を待っています。", users[3], "2025-12-05"),
    ],
  },
  {
    id: "D5",
    title: "サイト改修",
    status: "契約",
    owner: users[0],
    company: companies[4],
    amountExpected: 450000,
    amountContract: 450000,
    nextAction: {
      text: "要件確定ミーティング",
      owner: users[0],
      dueDate: "2025-12-23",
    },
    invoicePlannedMonth: "2026-01",
    invoice: {
      status: "none",
    },
    links: [],
    updatedAt: "2025-12-12",
    activities: [
      activity("act_d5_1", "初回打ち合わせの議事録を共有しました。", users[0], "2025-12-09"),
    ],
  },
  {
    id: "D6",
    title: "記事制作",
    status: "入金済み",
    owner: users[4],
    company: companies[5],
    amountExpected: 120000,
    amountContract: 120000,
    nextAction: {
      text: "完了の確認（必要なら）",
      owner: users[4],
      dueDate: "2025-12-18",
    },
    invoicePlannedMonth: "2025-12",
    invoice: {
      status: "paid",
      invoiceDate: "2025-12-01",
      invoiceDueDate: "2025-12-10",
      amountInvoice: 120000,
      amountPaid: 120000,
      paidDate: "2025-12-10",
    },
    links: [],
    updatedAt: "2025-12-11",
    activities: [
      activity("act_d6_1", "入金を確認しました。", users[4], "2025-12-10"),
    ],
  },
  {
    id: "D7",
    title: "EC運用",
    status: "請求済み",
    owner: users[1],
    company: companies[6],
    amountExpected: 240000,
    amountContract: 240000,
    nextAction: {
      text: "次の一手を更新",
      owner: users[1],
      dueDate: "2025-12-15",
    },
    invoicePlannedMonth: "2025-12",
    billingToName: "G社 管理部",
    invoice: {
      status: "issued",
      invoiceDate: "2025-12-07",
      invoiceDueDate: "2025-12-21",
      amountInvoice: 240000,
    },
    links: [],
    updatedAt: "2025-12-15",
    activities: [
      activity("act_d7_1", "請求書を発行しました。", users[1], "2025-12-07"),
    ],
  },
  {
    id: "D8",
    title: "SNS運用",
    status: "請求準備",
    owner: users[2],
    company: companies[7],
    amountExpected: 200000,
    amountContract: 200000,
    nextAction: {
      text: "請求書の作成・発行",
      owner: users[2],
      dueDate: "2025-12-13",
    },
    invoicePlannedMonth: "2025-12",
    invoice: {
      status: "draft",
    },
    links: [],
    updatedAt: "2025-12-13",
    activities: [
      activity("act_d8_1", "クリエイティブ確認待ちです。", users[2], "2025-12-12"),
    ],
  },
];

const clone = <T,>(value: T): T => JSON.parse(JSON.stringify(value));

export const demoSeed: DemoState = {
  deals,
  users,
  companies,
  quickFilter: "none",
  activeNav: "dashboard",
  updatedAt: "2025-12-17",
};

export const createInitialState = (): DemoState => clone(demoSeed);
