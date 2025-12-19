## Sample Code

```javascript
import React, { useState, useEffect, useMemo } from 'react';
import { 
  LayoutDashboard, 
  Briefcase, 
  FileText, 
  Plus, 
  Search, 
  Bell, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  MoreHorizontal, 
  X,
  ChevronRight,
  Filter,
  ArrowUpRight
} from 'lucide-react';

/* --- 1. Utilities (Date & Logic) --- */

const formatDate = (dateString) => {
  if (!dateString) return '';
  const d = new Date(dateString);
  return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}`;
};

const formatDateTime = (dateString) => {
  if (!dateString) return '';
  const d = new Date(dateString);
  return `${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
};

const formatCurrency = (amount) => {
  if (amount === undefined || amount === null) return '-';
  return new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(amount);
};

// 営業日計算（土日除外）
const isWeekend = (date) => {
  const day = date.getDay();
  return day === 0 || day === 6; // 0:Sun, 6:Sat
};

const addDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

// 実効期日（土日の場合は翌月曜）
const getEffectiveDueDate = (dateString) => {
  if (!dateString) return null;
  const date = new Date(dateString);
  if (date.getDay() === 6) return addDays(date, 2); // Sat -> Mon
  if (date.getDay() === 0) return addDays(date, 1); // Sun -> Mon
  return date;
};

// アラート判定ロジック
const calculateAlerts = (deal, today = new Date('2025-12-17')) => {
  const alerts = [];
  
  // 1. 未入金（遅延）
  if (deal.invoice_summary.status === 'issued' && deal.invoice_summary.invoice_due_date) {
    const effectiveDate = getEffectiveDueDate(deal.invoice_summary.invoice_due_date);
    const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const effectiveDateObj = new Date(effectiveDate.getFullYear(), effectiveDate.getMonth(), effectiveDate.getDate());
    
    // 遅延
    if (todayDate > effectiveDateObj) {
      const diffTime = Math.abs(todayDate - effectiveDateObj);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      alerts.push({ type: 'overdue', priority: 1, label: '未入金（遅延）', diffDays });
    }
    
    // 2. 入金期限まもなく（簡易実装：5日以内）
    if (todayDate <= effectiveDateObj) {
        const diffTime = Math.abs(effectiveDateObj - todayDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays <= 5) {
           alerts.push({ type: 'due_soon', priority: 2, label: '入金期限まもなく', diffDays });
        }
    }
  }

  // 3. 今月：未請求
  const currentMonthStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
  if (deal.invoice_planned_month === currentMonthStr && deal.invoice_summary.status !== 'issued' && deal.invoice_summary.status !== 'paid') {
     alerts.push({ type: 'unbilled_this_month', priority: 3, label: '今月：未請求' });
  }

  // 4. 対応期限切れ
  if (deal.next_action && deal.next_action.due_date) {
      const nextActionDate = new Date(deal.next_action.due_date);
      const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      if (todayDate > nextActionDate) {
          const diffTime = Math.abs(todayDate - nextActionDate);
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          alerts.push({ type: 'action_overdue', priority: 4, label: '対応期限切れ', diffDays });
      }
  }

  alerts.sort((a, b) => a.priority - b.priority);
  return alerts;
};


/* --- 2. Data & Store (Seed & SessionStorage) --- */
// Generated from mini_crm_deals_seed_50.csv and mini_crm_invoices_seed_50.csv

const SEED_DEALS = [
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
    "company_name": "株式会社F",
    "status": "契約",
    "owner_id": "U005",
    "owner_name": "伊藤",
    "amount_contract": 1137000,
    "next_action": {
      "text": "要件定義書送付",
      "owner_id": "U004",
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
    "updated_at": "2025-12-12T12:00:00",
    "last_activity_summary": "情報を更新"
  },
  {
    "id": "D0004",
    "title": "バナー修正（4）",
    "workspace_id": "WS001",
    "company_id": "C010",
    "company_name": "株式会社C010",
    "status": "請求準備",
    "owner_id": "U004",
    "owner_name": "高橋",
    "amount_contract": 757000,
    "next_action": {
      "text": "請求書発行",
      "owner_id": "U003",
      "due_date": "2026-01-01"
    },
    "invoice_planned_month": "2025-12",
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
    "id": "D0005",
    "title": "運用改善（5）",
    "workspace_id": "WS001",
    "company_id": "C002",
    "company_name": "株式会社B",
    "status": "請求準備",
    "owner_id": "U002",
    "owner_name": "田中",
    "amount_contract": 617000,
    "next_action": {
      "text": "請求書発行",
      "owner_id": "U003",
      "due_date": "2025-12-25"
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
    "title": "記事制作（6）",
    "workspace_id": "WS001",
    "company_id": "C019",
    "company_name": "株式会社C019",
    "status": "入金済み",
    "owner_id": "U005",
    "owner_name": "伊藤",
    "amount_contract": 463000,
    "next_action": {
      "text": "次回提案",
      "owner_id": "U002",
      "due_date": "2025-12-19"
    },
    "invoice_planned_month": "2025-12",
    "invoice_summary": {
      "status": "paid",
      "invoice_date": "2025-11-17",
      "invoice_due_date": "2025-12-28",
      "amount_invoice": 463000,
      "amount_outstanding": 0
    },
    "updated_at": "2025-12-07T12:00:00",
    "last_activity_summary": "情報を更新"
  },
  {
    "id": "D0007",
    "title": "EC運用（7）",
    "workspace_id": "WS001",
    "company_id": "C003",
    "company_name": "株式会社C",
    "status": "請求済み",
    "owner_id": "U002",
    "owner_name": "田中",
    "amount_contract": 1150000,
    "next_action": {
      "text": "入金確認",
      "owner_id": "U003",
      "due_date": "2025-12-17"
    },
    "invoice_planned_month": "2025-12",
    "invoice_summary": {
      "status": "issued",
      "invoice_date": "2025-11-15",
      "invoice_due_date": "2025-12-15",
      "amount_invoice": 1150000,
      "amount_outstanding": 1150000
    },
    "updated_at": "2025-11-18T12:00:00",
    "last_activity_summary": "情報を更新"
  },
  {
    "id": "D0008",
    "title": "SNS運用（8）",
    "workspace_id": "WS001",
    "company_id": "C017",
    "company_name": "株式会社C017",
    "status": "契約",
    "owner_id": "U003",
    "owner_name": "鈴木",
    "amount_contract": 1395000,
    "next_action": {
      "text": "定例MTG",
      "owner_id": "U003",
      "due_date": "2025-12-25"
    },
    "invoice_planned_month": "2025-12",
    "invoice_summary": {
      "status": "draft",
      "invoice_date": "",
      "invoice_due_date": "",
      "amount_invoice": 0,
      "amount_outstanding": 0
    },
    "updated_at": "2025-11-10T12:00:00",
    "last_activity_summary": "情報を更新"
  },
  {
    "id": "D0009",
    "title": "デザイン監修（9）",
    "workspace_id": "WS001",
    "company_id": "C006",
    "company_name": "株式会社F",
    "status": "請求済み",
    "owner_id": "U004",
    "owner_name": "高橋",
    "amount_contract": 913000,
    "next_action": {
      "text": "入金確認",
      "owner_id": "U003",
      "due_date": "2026-01-01"
    },
    "invoice_planned_month": "2025-12",
    "invoice_summary": {
      "status": "issued",
      "invoice_date": "2025-12-14",
      "invoice_due_date": "2025-12-25",
      "amount_invoice": 913000,
      "amount_outstanding": 913000
    },
    "updated_at": "2025-12-07T12:00:00",
    "last_activity_summary": "情報を更新"
  },
  {
    "id": "D0010",
    "title": "動画編集（10）",
    "workspace_id": "WS001",
    "company_id": "C015",
    "company_name": "株式会社C015",
    "status": "請求済み",
    "owner_id": "U002",
    "owner_name": "田中",
    "amount_contract": 1284000,
    "next_action": {
      "text": "入金確認",
      "owner_id": "U003",
      "due_date": "2025-12-23"
    },
    "invoice_planned_month": "2025-12",
    "invoice_summary": {
      "status": "issued",
      "invoice_date": "2025-11-20",
      "invoice_due_date": "2025-12-22",
      "amount_invoice": 1284000,
      "amount_outstanding": 1284000
    },
    "updated_at": "2025-12-08T12:00:00",
    "last_activity_summary": "情報を更新"
  },
  {
    "id": "D0011",
    "title": "LP制作（11）",
    "workspace_id": "WS001",
    "company_id": "C011",
    "company_name": "株式会社C011",
    "status": "請求済み",
    "owner_id": "U001",
    "owner_name": "佐藤",
    "amount_contract": 444000,
    "next_action": {
      "text": "入金確認",
      "owner_id": "U003",
      "due_date": "2025-12-25"
    },
    "invoice_planned_month": "2025-12",
    "invoice_summary": {
      "status": "issued",
      "invoice_date": "2025-11-24",
      "invoice_due_date": "2025-12-24",
      "amount_invoice": 444000,
      "amount_outstanding": 444000
    },
    "updated_at": "2025-12-04T12:00:00",
    "last_activity_summary": "情報を更新"
  },
  {
    "id": "D0012",
    "title": "UIリニューアル（12）",
    "workspace_id": "WS001",
    "company_id": "C001",
    "company_name": "株式会社A",
    "status": "入金済み",
    "owner_id": "U001",
    "owner_name": "佐藤",
    "amount_contract": 1046000,
    "next_action": {
      "text": "次回提案",
      "owner_id": "U001",
      "due_date": "2025-12-21"
    },
    "invoice_planned_month": "2025-12",
    "invoice_summary": {
      "status": "paid",
      "invoice_date": "2025-11-20",
      "invoice_due_date": "2025-12-11",
      "amount_invoice": 1046000,
      "amount_outstanding": 0
    },
    "updated_at": "2025-12-16T12:00:00",
    "last_activity_summary": "情報を更新"
  },
  {
    "id": "D0013",
    "title": "採用ページ制作（13）",
    "workspace_id": "WS001",
    "company_id": "C017",
    "company_name": "株式会社C017",
    "status": "請求済み",
    "owner_id": "U005",
    "owner_name": "伊藤",
    "amount_contract": 948000,
    "next_action": {
      "text": "入金確認",
      "owner_id": "U003",
      "due_date": "2025-12-24"
    },
    "invoice_planned_month": "2025-12",
    "invoice_summary": {
      "status": "issued",
      "invoice_date": "2025-12-11",
      "invoice_due_date": "2025-12-22",
      "amount_invoice": 948000,
      "amount_outstanding": 948000
    },
    "updated_at": "2025-11-13T12:00:00",
    "last_activity_summary": "情報を更新"
  },
  {
    "id": "D0014",
    "title": "バナー修正（14）",
    "workspace_id": "WS001",
    "company_id": "C015",
    "company_name": "株式会社C015",
    "status": "請求済み",
    "owner_id": "U004",
    "owner_name": "高橋",
    "amount_contract": 917000,
    "next_action": {
      "text": "入金確認",
      "owner_id": "U003",
      "due_date": "2025-12-24"
    },
    "invoice_planned_month": "2025-12",
    "invoice_summary": {
      "status": "issued",
      "invoice_date": "2025-11-14",
      "invoice_due_date": "2025-12-22",
      "amount_invoice": 917000,
      "amount_outstanding": 917000
    },
    "updated_at": "2025-12-12T12:00:00",
    "last_activity_summary": "情報を更新"
  },
  {
    "id": "D0015",
    "title": "運用改善（15）",
    "workspace_id": "WS001",
    "company_id": "C017",
    "company_name": "株式会社C017",
    "status": "請求準備",
    "owner_id": "U002",
    "owner_name": "田中",
    "amount_contract": 1109000,
    "next_action": {
      "text": "請求書発行",
      "owner_id": "U003",
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
    "updated_at": "2025-11-20T12:00:00",
    "last_activity_summary": "情報を更新"
  },
  {
    "id": "D0016",
    "title": "記事制作（16）",
    "workspace_id": "WS001",
    "company_id": "C001",
    "company_name": "株式会社A",
    "status": "請求済み",
    "owner_id": "U005",
    "owner_name": "伊藤",
    "amount_contract": 1461000,
    "next_action": {
      "text": "入金確認",
      "owner_id": "U003",
      "due_date": "2025-12-25"
    },
    "invoice_planned_month": "2025-12",
    "invoice_summary": {
      "status": "issued",
      "invoice_date": "2025-11-09",
      "invoice_due_date": "2025-12-22",
      "amount_invoice": 1461000,
      "amount_outstanding": 1461000
    },
    "updated_at": "2025-11-27T12:00:00",
    "last_activity_summary": "情報を更新"
  },
  {
    "id": "D0017",
    "title": "EC運用（17）",
    "workspace_id": "WS001",
    "company_id": "C017",
    "company_name": "株式会社C017",
    "status": "請求済み",
    "owner_id": "U002",
    "owner_name": "田中",
    "amount_contract": 444000,
    "next_action": {
      "text": "入金確認",
      "owner_id": "U003",
      "due_date": "2026-01-04"
    },
    "invoice_planned_month": "2025-12",
    "invoice_summary": {
      "status": "issued",
      "invoice_date": "2025-11-29",
      "invoice_due_date": "2026-01-01",
      "amount_invoice": 444000,
      "amount_outstanding": 444000
    },
    "updated_at": "2025-11-02T12:00:00",
    "last_activity_summary": "情報を更新"
  },
  {
    "id": "D0018",
    "title": "SNS運用（18）",
    "workspace_id": "WS001",
    "company_id": "C005",
    "company_name": "株式会社E",
    "status": "請求済み",
    "owner_id": "U003",
    "owner_name": "鈴木",
    "amount_contract": 1361000,
    "next_action": {
      "text": "入金確認",
      "owner_id": "U003",
      "due_date": "2025-12-23"
    },
    "invoice_planned_month": "2025-12",
    "invoice_summary": {
      "status": "issued",
      "invoice_date": "2025-11-19",
      "invoice_due_date": "2025-12-21",
      "amount_invoice": 1361000,
      "amount_outstanding": 1361000
    },
    "updated_at": "2025-12-07T12:00:00",
    "last_activity_summary": "情報を更新"
  },
  {
    "id": "D0019",
    "title": "デザイン監修（19）",
    "workspace_id": "WS001",
    "company_id": "C008",
    "company_name": "株式会社C008",
    "status": "契約",
    "owner_id": "U004",
    "owner_name": "高橋",
    "amount_contract": 870000,
    "next_action": {
      "text": "定例MTG",
      "owner_id": "U004",
      "due_date": "2025-12-28"
    },
    "invoice_planned_month": "2025-12",
    "invoice_summary": {
      "status": "draft",
      "invoice_date": "",
      "invoice_due_date": "",
      "amount_invoice": 0,
      "amount_outstanding": 0
    },
    "updated_at": "2025-12-06T12:00:00",
    "last_activity_summary": "情報を更新"
  },
  {
    "id": "D0020",
    "title": "動画編集（20）",
    "workspace_id": "WS001",
    "company_id": "C010",
    "company_name": "株式会社C010",
    "status": "契約",
    "owner_id": "U002",
    "owner_name": "田中",
    "amount_contract": 845000,
    "next_action": {
      "text": "動画初稿提出",
      "owner_id": "U002",
      "due_date": "2026-01-02"
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
    "id": "D0030",
    "title": "動画編集（30）",
    "workspace_id": "WS001",
    "company_id": "C016",
    "company_name": "株式会社C016",
    "status": "請求済み",
    "owner_id": "U002",
    "owner_name": "田中",
    "amount_contract": 1162000,
    "next_action": {
      "text": "入金確認",
      "owner_id": "U003",
      "due_date": "2025-12-25"
    },
    "invoice_planned_month": "2025-12",
    "invoice_summary": {
      "status": "issued",
      "invoice_date": "2025-11-20",
      "invoice_due_date": "2025-12-22",
      "amount_invoice": 1162000,
      "amount_outstanding": 1162000
    },
    "updated_at": "2025-11-04T12:00:00",
    "last_activity_summary": "情報を更新"
  },
  {
    "id": "D0033",
    "title": "採用ページ制作（33）",
    "workspace_id": "WS001",
    "company_id": "C003",
    "company_name": "株式会社C",
    "status": "請求済み",
    "owner_id": "U005",
    "owner_name": "伊藤",
    "amount_contract": 587000,
    "next_action": {
      "text": "入金確認",
      "owner_id": "U003",
      "due_date": "2025-12-28"
    },
    "invoice_planned_month": "2025-12",
    "invoice_summary": {
      "status": "issued",
      "invoice_date": "2025-12-17",
      "invoice_due_date": "2026-01-31",
      "amount_invoice": 587000,
      "amount_outstanding": 587000
    },
    "updated_at": "2025-12-13T12:00:00",
    "last_activity_summary": "情報を更新"
  },
  {
    "id": "D0034",
    "title": "バナー修正（34）",
    "workspace_id": "WS001",
    "company_id": "C011",
    "company_name": "株式会社C011",
    "status": "入金済み",
    "owner_id": "U004",
    "owner_name": "高橋",
    "amount_contract": 1527000,
    "next_action": {
      "text": "次回提案",
      "owner_id": "U004",
      "due_date": "2025-12-21"
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
    "id": "D0039",
    "title": "デザイン監修（39）",
    "workspace_id": "WS001",
    "company_id": "C005",
    "company_name": "株式会社E",
    "status": "請求準備",
    "owner_id": "U004",
    "owner_name": "高橋",
    "amount_contract": 794000,
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
    "company_name": "株式会社N",
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
      "status": "draft",
      "invoice_date": "",
      "invoice_due_date": "",
      "amount_invoice": 0,
      "amount_outstanding": 0
    },
    "updated_at": "2025-12-15T12:00:00",
    "last_activity_summary": "情報を更新"
  },
  {
    "id": "D0042",
    "title": "運用改善（42）",
    "workspace_id": "WS001",
    "company_id": "C015",
    "company_name": "株式会社C015",
    "status": "請求済み",
    "owner_id": "U002",
    "owner_name": "田中",
    "amount_contract": 1362000,
    "next_action": {
      "text": "入金予定の確認",
      "owner_id": "U005",
      "due_date": "2025-12-25"
    },
    "invoice_planned_month": "2025-12",
    "invoice_summary": {
      "status": "draft",
      "invoice_date": "",
      "invoice_due_date": "",
      "amount_invoice": 0,
      "amount_outstanding": 0
    },
    "updated_at": "2025-11-20T12:00:00",
    "last_activity_summary": "情報を更新"
  }
];

/* --- 3. UI Components (Atomic: Theme=Sky, Radius=Small) --- */

const Button = ({ children, variant = 'default', size = 'default', className = '', ...props }) => {
  const baseStyles = "inline-flex items-center justify-center whitespace-nowrap rounded text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";
  const variants = {
    default: "bg-slate-900 text-slate-50 hover:bg-slate-900/90",
    outline: "border border-slate-200 bg-white hover:bg-slate-100 hover:text-slate-900",
    ghost: "hover:bg-slate-100 hover:text-slate-900",
    secondary: "bg-slate-100 text-slate-900 hover:bg-slate-100/80",
    link: "text-sky-600 underline-offset-4 hover:underline",
    danger: "bg-red-500 text-white hover:bg-red-600"
  };
  const sizes = {
    default: "h-9 px-4 py-2", 
    sm: "h-8 rounded px-3 text-xs",
    icon: "h-9 w-9",
  };
  
  return (
    <button className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {children}
    </button>
  );
};

const Badge = ({ children, variant = 'default', className = '' }) => {
  const variants = {
    default: "border-transparent bg-slate-900 text-slate-50 hover:bg-slate-900/80",
    secondary: "border-transparent bg-slate-100 text-slate-900 hover:bg-slate-100/80",
    outline: "text-slate-950 border-slate-200",
    danger: "border-transparent bg-red-500 text-slate-50 hover:bg-red-500/80",
    success: "border-transparent bg-emerald-500 text-slate-50 hover:bg-emerald-500/80",
    warning: "border-transparent bg-amber-500 text-white hover:bg-amber-500/80",
    sky: "border-transparent bg-sky-500 text-white hover:bg-sky-500/80",
  };
  return (
    <div className={`inline-flex items-center rounded-sm border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${variants[variant]} ${className}`}>
      {children}
    </div>
  );
};

const Card = ({ children, className = '' }) => (
  <div className={`rounded border bg-card text-card-foreground shadow-sm bg-white ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ children, className = '' }) => (
  <div className={`flex flex-col space-y-1.5 p-6 ${className}`}>{children}</div>
);

const CardTitle = ({ children, className = '' }) => (
  <h3 className={`text-lg font-semibold leading-none tracking-tight ${className}`}>{children}</h3>
);

const CardContent = ({ children, className = '' }) => (
  <div className={`p-6 pt-0 ${className}`}>{children}</div>
);

const Input = ({ className = '', ...props }) => (
  <input className={`flex h-9 w-full rounded border border-slate-200 bg-white px-3 py-1 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`} {...props} />
);

/* --- Table Components (Shadcn UI style) --- */

const Table = ({ className, children, ...props }) => (
  <div className="relative w-full overflow-auto">
    <table className={`w-full caption-bottom text-sm ${className}`} {...props}>
        {children}
    </table>
  </div>
);

const TableHeader = ({ className, children, ...props }) => (
  <thead className={`[&_tr]:border-b ${className}`} {...props}>
      {children}
  </thead>
);

const TableBody = ({ className, children, ...props }) => (
  <tbody className={`[&_tr:last-child]:border-0 ${className}`} {...props}>
      {children}
  </tbody>
);

const TableRow = ({ className, children, ...props }) => (
  <tr className={`border-b transition-colors hover:bg-slate-50/50 data-[state=selected]:bg-muted ${className}`} {...props}>
      {children}
  </tr>
);

const TableHead = ({ className, children, ...props }) => (
  <th className={`h-10 px-4 text-left align-middle font-medium text-slate-500 [&:has([role=checkbox])]:pr-0 ${className}`} {...props}>
      {children}
  </th>
);

const TableCell = ({ className, children, ...props }) => (
  <td className={`p-4 align-middle [&:has([role=checkbox])]:pr-0 ${className}`} {...props}>
      {children}
  </td>
);


/* --- 4. Main Views --- */

const DealInspector = ({ deal, isOpen, onClose }) => {
  if (!isOpen || !deal) return null;

  const alerts = calculateAlerts(deal);
  const topAlert = alerts.length > 0 ? alerts[0] : null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40 transition-opacity" onClick={onClose} />
      
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white shadow-lg border-l border-slate-200 transform transition-transform duration-300 ease-in-out flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100">
           <div className="flex items-center gap-2">
             <h2 className="text-base font-semibold text-slate-900">案件詳細</h2>
             {topAlert && (
                 <Badge variant="danger" className="animate-pulse">{topAlert.label}</Badge>
             )}
           </div>
           <Button variant="ghost" size="icon" onClick={onClose}><X className="h-4 w-4" /></Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Title Block */}
            <div className="space-y-1">
                <div className="text-sm text-slate-500 flex items-center gap-2">
                    {deal.company_name}
                    <Badge variant="outline">{deal.status}</Badge>
                </div>
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">{deal.title}</h1>
            </div>

            {/* Recommendation (Dynamic) */}
            {topAlert && (
                <div className="bg-red-50 border border-red-100 rounded p-4 flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 shrink-0" />
                    <div className="flex-1">
                         <p className="text-sm text-red-800 font-medium mb-2 leading-relaxed">
                             {topAlert.type === 'overdue' && `👉 まだ未入金のようです。入金予定を確認して、必要ならご連絡しておきましょう`}
                             {topAlert.type === 'due_soon' && `👉 入金期限が近いです。念のため、入金予定の確認をお願いします`}
                             {topAlert.type === 'unbilled_this_month' && `👉 今月分が未請求のようです。請求書の作成→発行まで進めておきましょう`}
                             {topAlert.type === 'action_overdue' && `👉 対応期限が過ぎています。次の一手（内容/担当/期限）を更新しておきましょう`}
                         </p>
                         <Button size="sm" variant="outline" className="bg-white border-red-200 text-red-700 hover:bg-red-50">次アクションにセット</Button>
                    </div>
                </div>
            )}

            {/* Basic Info Form */}
            <div className="space-y-4">
                <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">基本情報</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-slate-500">担当者</label>
                        <Input defaultValue={deal.owner_name} />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-slate-500">ステータス</label>
                        <select className="flex h-9 w-full rounded border border-slate-200 bg-white px-3 py-1 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500" defaultValue={deal.status}>
                            <option>見込み</option>
                            <option>提案中</option>
                            <option>契約</option>
                            <option>請求準備</option>
                            <option>請求済み</option>
                            <option>入金済み</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Next Action */}
            <div className="space-y-4">
                 <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                     <Clock className="h-3.5 w-3.5" /> 次アクション
                 </h3>
                 <div className="p-4 bg-slate-50 rounded space-y-3 border border-slate-100">
                     <div className="space-y-1.5">
                         <label className="text-xs font-medium text-slate-500">内容</label>
                         <Input defaultValue={deal.next_action?.text} />
                     </div>
                     <div className="grid grid-cols-2 gap-4">
                         <div className="space-y-1.5">
                             <label className="text-xs font-medium text-slate-500">担当</label>
                             <Input defaultValue={deal.owner_name} />
                         </div>
                         <div className="space-y-1.5">
                             <label className="text-xs font-medium text-slate-500">期限</label>
                             <Input type="date" defaultValue={deal.next_action?.due_date} />
                         </div>
                     </div>
                 </div>
            </div>

            {/* Billing Info */}
            <div className="space-y-4">
                 <div className="flex items-center justify-between">
                    <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                        <FileText className="h-3.5 w-3.5" /> 請求・入金
                    </h3>
                 </div>
                 
                 <div className="p-4 border border-slate-200 rounded space-y-4">
                     <div className="grid grid-cols-2 gap-4">
                         <div className="space-y-1.5">
                             <label className="text-xs font-medium text-slate-500">請求予定月</label>
                             <Input type="month" defaultValue={deal.invoice_planned_month} />
                         </div>
                         <div className="space-y-1.5">
                             <label className="text-xs font-medium text-slate-500">契約金額</label>
                             <Input defaultValue={deal.amount_contract} />
                         </div>
                     </div>

                     <div className="border-t border-slate-100 pt-4 space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">請求ステータス</span>
                            <Badge variant={deal.invoice_summary.status === 'issued' ? 'warning' : deal.invoice_summary.status === 'paid' ? 'success' : 'secondary'}>
                                {deal.invoice_summary.status === 'issued' ? '請求済み' : deal.invoice_summary.status === 'paid' ? '入金済み' : '未請求'}
                            </Badge>
                        </div>

                        {deal.invoice_summary.status === 'none' && (
                             <Button className="w-full bg-slate-800">請求済みにする</Button>
                        )}
                        
                        {deal.invoice_summary.status === 'issued' && (
                             <div className="space-y-3">
                                 <div className="grid grid-cols-2 gap-4 bg-slate-50 p-3 rounded text-sm">
                                     <div>
                                         <div className="text-xs text-slate-500">請求日</div>
                                         <div className="font-medium">{formatDate(deal.invoice_summary.invoice_date)}</div>
                                     </div>
                                     <div>
                                         <div className="text-xs text-slate-500">入金期日</div>
                                         <div className={`font-medium ${topAlert?.type === 'overdue' ? 'text-red-600 font-bold' : ''}`}>
                                             {formatDate(deal.invoice_summary.invoice_due_date)}
                                         </div>
                                     </div>
                                 </div>
                                 <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">入金済みにする</Button>
                             </div>
                        )}
                     </div>
                 </div>
            </div>

            {/* Footer Space */}
            <div className="h-12" />
        </div>
      </div>
    </>
  );
};

const RecentActivityTable = ({ deals, onDealClick }) => {
    const recentDeals = useMemo(() => {
        const today = new Date('2025-12-17');
        const sevenDaysAgo = new Date(today);
        sevenDaysAgo.setDate(today.getDate() - 7);

        return deals
            .filter(deal => {
                const updated = new Date(deal.updated_at);
                return updated >= sevenDaysAgo && updated <= today;
            })
            .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
    }, [deals]);

    return (
        <div className="rounded border border-slate-200 overflow-hidden bg-white">
            <Table>
                <TableHeader className="bg-slate-50">
                    <TableRow>
                        <TableHead className="w-[140px]">更新日</TableHead>
                        <TableHead className="w-[50px] text-center">!</TableHead>
                        <TableHead className="min-w-[180px]">案件名</TableHead>
                        <TableHead className="min-w-[140px]">取引先</TableHead>
                        <TableHead className="w-[100px]">ステータス</TableHead>
                        <TableHead className="w-[100px]">担当</TableHead>
                        <TableHead className="min-w-[200px]">最終更新内容</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {recentDeals.map(deal => {
                        const alerts = calculateAlerts(deal);
                        const topAlert = alerts[0];
                        return (
                            <TableRow 
                                key={deal.id} 
                                className="cursor-pointer hover:bg-slate-50"
                                onClick={() => onDealClick(deal)}
                            >
                                <TableCell className="font-mono text-xs text-slate-500 whitespace-nowrap">
                                    {formatDateTime(deal.updated_at)}
                                </TableCell>
                                <TableCell className="text-center p-2">
                                    {topAlert && (
                                        <div className="flex justify-center" title={topAlert.label}>
                                            <AlertCircle className={`h-4 w-4 ${topAlert.priority === 1 ? 'text-red-600' : 'text-amber-500'}`} />
                                        </div>
                                    )}
                                </TableCell>
                                <TableCell className="font-medium text-slate-900 truncate max-w-[180px]">
                                    {deal.title}
                                </TableCell>
                                <TableCell className="text-slate-600 truncate max-w-[140px]">
                                    {deal.company_name}
                                </TableCell>
                                <TableCell>
                                    <Badge variant="outline" className="text-xs font-normal bg-white whitespace-nowrap">
                                        {deal.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-slate-600 truncate max-w-[100px]">
                                    {deal.owner_name}
                                </TableCell>
                                <TableCell className="text-slate-600 text-xs truncate max-w-[200px]">
                                    {deal.last_activity_summary || '更新あり'}
                                </TableCell>
                            </TableRow>
                        );
                    })}
                    {recentDeals.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={7} className="h-24 text-center text-slate-400">
                                直近の更新はありません
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
};


const DealsTable = ({ deals, onDealClick, filter }) => {
    const filteredDeals = useMemo(() => {
        if (filter === 'all') return deals;
        const today = new Date('2025-12-17');
        return deals.filter(deal => {
            const alerts = calculateAlerts(deal, today);
            if (filter === 'overdue') return alerts.some(a => a.type === 'overdue');
            if (filter === 'due_soon') return alerts.some(a => a.type === 'due_soon');
            if (filter === 'unbilled_this_month') return alerts.some(a => a.type === 'unbilled_this_month');
            if (filter === 'action_overdue') return alerts.some(a => a.type === 'action_overdue');
            if (filter === 'planned_this_month') return deal.invoice_planned_month === '2025-12';
            return true;
        });
    }, [deals, filter]);

    return (
        <div className="rounded border border-slate-200 overflow-hidden bg-white">
            <Table>
                <TableHeader className="bg-slate-50">
                    <TableRow>
                        <TableHead className="w-[50px] text-center">!</TableHead>
                        <TableHead className="min-w-[200px]">案件名</TableHead>
                        <TableHead className="min-w-[140px]">取引先</TableHead>
                        <TableHead className="w-[100px]">ステータス</TableHead>
                        <TableHead className="w-[100px]">担当</TableHead>
                        <TableHead className="min-w-[200px]">次アクション</TableHead>
                        <TableHead className="w-[120px]">期限</TableHead>
                        <TableHead className="w-[120px]">入金期日</TableHead>
                        <TableHead className="w-[120px] text-right">金額</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredDeals.map(deal => {
                        const alerts = calculateAlerts(deal);
                        const topAlert = alerts[0];
                        return (
                            <TableRow 
                                key={deal.id} 
                                className="cursor-pointer hover:bg-slate-50"
                                onClick={() => onDealClick(deal)}
                            >
                                <TableCell className="text-center p-2">
                                    {topAlert && (
                                        <div className="flex justify-center" title={topAlert.label}>
                                            <AlertCircle className={`h-4 w-4 ${topAlert.priority === 1 ? 'text-red-600' : 'text-amber-500'}`} />
                                        </div>
                                    )}
                                </TableCell>
                                <TableCell className="font-medium text-slate-900 truncate max-w-[200px]">
                                    {deal.title}
                                </TableCell>
                                <TableCell className="text-slate-600 truncate max-w-[140px]">
                                    {deal.company_name}
                                </TableCell>
                                <TableCell>
                                    <Badge variant="outline" className="text-xs font-normal bg-white whitespace-nowrap">
                                        {deal.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-slate-600 truncate max-w-[100px]">
                                    {deal.owner_name}
                                </TableCell>
                                <TableCell className="text-slate-600 truncate max-w-[200px]">
                                    {deal.next_action?.text}
                                </TableCell>
                                <TableCell className={`whitespace-nowrap ${calculateAlerts(deal).some(a=>a.type==='action_overdue') ? 'text-red-600 font-medium' : 'text-slate-600'}`}>
                                    {formatDate(deal.next_action?.due_date)}
                                </TableCell>
                                <TableCell className="text-slate-600 whitespace-nowrap">
                                    {deal.invoice_summary.status === 'issued' ? (
                                        <span className={calculateAlerts(deal).some(a=>a.type==='overdue') ? 'text-red-600 font-bold' : ''}>
                                            {formatDate(deal.invoice_summary.invoice_due_date)}
                                        </span>
                                    ) : '-'}
                                </TableCell>
                                <TableCell className="text-right text-slate-600 font-mono whitespace-nowrap">
                                    {formatCurrency(deal.invoice_summary.amount_invoice || deal.amount_contract)}
                                </TableCell>
                            </TableRow>
                        );
                    })}
                    {filteredDeals.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={9} className="h-24 text-center text-slate-400">
                                該当する案件はありません
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
};

const DashboardView = ({ deals, onNavigateToFilter, onDealClick }) => {
    const today = new Date('2025-12-17');
    const alerts = deals.flatMap(d => calculateAlerts(d, today));
    
    const countOverdue = alerts.filter(a => a.type === 'overdue').length;
    const countDueSoon = alerts.filter(a => a.type === 'due_soon').length;
    const countUnbilled = alerts.filter(a => a.type === 'unbilled_this_month').length;
    const countActionOverdue = alerts.filter(a => a.type === 'action_overdue').length;

    const KPICard = ({ title, count, colorClass, onClick, icon: Icon }) => (
        <div 
            onClick={onClick}
            className="bg-white p-6 rounded border border-slate-200 shadow-sm cursor-pointer hover:shadow-md transition-shadow flex items-start justify-between"
        >
            <div>
                <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
                <h3 className={`text-3xl font-bold tracking-tight ${colorClass}`}>{count}</h3>
            </div>
            <div className={`p-2 rounded-full ${colorClass.replace('text-', 'bg-').replace('600', '100').replace('500', '100')}`}>
                <Icon className={`h-5 w-5 ${colorClass}`} />
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Dashboard</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <KPICard 
                    title="未入金（遅延）" 
                    count={countOverdue} 
                    colorClass="text-red-600" 
                    icon={AlertCircle}
                    onClick={() => onNavigateToFilter('overdue')}
                />
                <KPICard 
                    title="入金期限まもなく" 
                    count={countDueSoon} 
                    colorClass="text-amber-500" 
                    icon={Clock}
                    onClick={() => onNavigateToFilter('due_soon')}
                />
                <KPICard 
                    title="今月：未請求" 
                    count={countUnbilled} 
                    colorClass="text-sky-500" 
                    icon={FileText}
                    onClick={() => onNavigateToFilter('unbilled_this_month')}
                />
                <KPICard 
                    title="対応期限切れ" 
                    count={countActionOverdue} 
                    colorClass="text-slate-600" 
                    icon={Clock}
                    onClick={() => onNavigateToFilter('action_overdue')}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                 <Card className="col-span-2">
                     <CardHeader>
                         <CardTitle>Recent Activity</CardTitle>
                     </CardHeader>
                     <CardContent>
                         <RecentActivityTable deals={deals} onDealClick={onDealClick} />
                     </CardContent>
                 </Card>

                 <Card>
                    <CardHeader>
                        <CardTitle>今月の見込み</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-slate-900 tracking-tight">¥1,250,000</div>
                        <div className="text-sm text-slate-500 mt-1">請求予定総額</div>
                    </CardContent>
                 </Card>
            </div>
        </div>
    );
};

/* --- 5. Main Layout & App Shell --- */

export default function MiniCRM() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [filter, setFilter] = useState('all'); 
  const [deals, setDeals] = useState([]);
  const [selectedDeal, setSelectedDeal] = useState(null);
  const [isInspectorOpen, setIsInspectorOpen] = useState(false);

  useEffect(() => {
    const saved = sessionStorage.getItem("mini_crm_deals_v1");
    if (saved) {
        setDeals(JSON.parse(saved));
    } else {
        setDeals(SEED_DEALS);
        sessionStorage.setItem("mini_crm_deals_v1", JSON.stringify(SEED_DEALS));
    }
  }, []);

  const handleNavClick = (view, filterParam = 'all') => {
    setCurrentView(view);
    setFilter(filterParam);
  };

  const handleResetDemo = () => {
      setDeals(SEED_DEALS);
      sessionStorage.setItem("mini_crm_deals_v1", JSON.stringify(SEED_DEALS));
      window.location.reload();
  };

  const NavItem = ({ icon: Icon, label, isActive, onClick, badgeCount, badgeColor }) => (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between gap-3 px-3 py-2 text-sm font-medium rounded transition-colors ${
        isActive 
          ? "bg-sky-50 text-sky-900" 
          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
      }`}
    >
      <div className="flex items-center gap-3">
        <Icon className={`h-4 w-4 ${isActive ? "text-sky-600" : "text-slate-400"}`} />
        {label}
      </div>
      {badgeCount > 0 && (
          <span className={`px-2 py-0.5 rounded-full text-xs ${badgeColor || 'bg-slate-100 text-slate-600'}`}>
              {badgeCount}
          </span>
      )}
    </button>
  );

  const today = new Date('2025-12-17');
  const allAlerts = deals.flatMap(d => calculateAlerts(d, today));
  const countOverdue = allAlerts.filter(a => a.type === 'overdue').length;
  const countDueSoon = allAlerts.filter(a => a.type === 'due_soon').length;
  const countUnbilled = allAlerts.filter(a => a.type === 'unbilled_this_month').length;


  return (
    <div className="flex h-screen bg-white font-sans text-slate-900">
      {/* Sidebar */}
      <div className="w-64 border-r border-slate-200 bg-white flex flex-col">
        <div className="p-6">
          <div className="flex items-center gap-2 font-bold text-xl tracking-tight text-slate-900">
             {/* Theme: Sky */}
             <div className="h-8 w-8 bg-sky-500 rounded flex items-center justify-center text-white">
                 <Briefcase className="h-5 w-5" />
             </div>
             Mini CRM
          </div>
        </div>

        <div className="flex-1 px-3 space-y-1 overflow-y-auto">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-3 mb-2 mt-2">Main</div>
          <NavItem 
            icon={LayoutDashboard} 
            label="ダッシュボード" 
            isActive={currentView === 'dashboard'} 
            onClick={() => handleNavClick('dashboard')} 
          />
          <NavItem 
            icon={Briefcase} 
            label="案件一覧" 
            isActive={currentView === 'deals' && filter === 'all'} 
            onClick={() => handleNavClick('deals', 'all')} 
          />
          <NavItem 
            icon={FileText} 
            label="請求一覧" 
            isActive={currentView === 'invoices'} 
            onClick={() => handleNavClick('invoices')} 
          />

          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-3 mb-2 mt-6">Quick Filters</div>
          <NavItem 
            icon={AlertCircle} 
            label="未入金（遅延）" 
            isActive={filter === 'overdue'} 
            onClick={() => handleNavClick('deals', 'overdue')} 
            badgeCount={countOverdue}
            badgeColor="bg-red-100 text-red-700"
          />
          <NavItem 
            icon={Clock} 
            label="入金期限まもなく" 
            isActive={filter === 'due_soon'} 
            onClick={() => handleNavClick('deals', 'due_soon')}
            badgeCount={countDueSoon}
            badgeColor="bg-amber-100 text-amber-700"
          />
          <NavItem 
            icon={FileText} 
            label="今月：未請求" 
            isActive={filter === 'unbilled_this_month'} 
            onClick={() => handleNavClick('deals', 'unbilled_this_month')}
            badgeCount={countUnbilled}
            badgeColor="bg-sky-100 text-sky-700"
          />
        </div>

        <div className="p-4 border-t border-slate-200">
            <Button variant="outline" size="sm" className="w-full text-xs" onClick={handleResetDemo}>
                デモをリセット
            </Button>
            <div className="mt-4 flex items-center gap-3 px-1">
                <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-medium text-xs">
                    US
                </div>
                <div className="text-sm">
                    <div className="font-medium">User Name</div>
                    <div className="text-xs text-slate-500">admin</div>
                </div>
            </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden bg-slate-50/50">
        <header className="h-16 border-b border-slate-200 bg-white px-6 flex items-center justify-between">
            <h1 className="text-lg font-semibold capitalize text-slate-900">
                {currentView === 'dashboard' ? 'ダッシュボード' : 
                 currentView === 'deals' ? '案件一覧' : '請求一覧'}
            </h1>
            <div className="flex items-center gap-4">
                <Button size="sm" className="hidden md:flex gap-2">
                    <Plus className="h-4 w-4" /> 新規案件
                </Button>
            </div>
        </header>

        <main className="flex-1 overflow-auto p-6">
            {currentView === 'dashboard' && (
                <DashboardView 
                    deals={deals} 
                    onNavigateToFilter={(f) => handleNavClick('deals', f)} 
                    onDealClick={(deal) => {
                        setSelectedDeal(deal);
                        setIsInspectorOpen(true);
                    }}
                />
            )}
            
            {currentView === 'deals' && (
                <div className="space-y-4">
                    {filter !== 'all' && (
                        <div className="flex items-center gap-2 mb-4">
                            <span className="text-sm text-slate-500">Active Filter:</span>
                            <Badge variant="secondary" className="px-3 py-1 text-sm flex gap-2 items-center">
                                {filter === 'overdue' && '未入金（遅延）'}
                                {filter === 'due_soon' && '入金期限まもなく'}
                                {filter === 'unbilled_this_month' && '今月：未請求'}
                                {filter === 'action_overdue' && '対応期限切れ'}
                                <X className="h-3 w-3 cursor-pointer hover:text-slate-900" onClick={() => setFilter('all')} />
                            </Badge>
                        </div>
                    )}
                    
                    <DealsTable 
                        deals={deals} 
                        filter={filter}
                        onDealClick={(deal) => {
                            setSelectedDeal(deal);
                            setIsInspectorOpen(true);
                        }}
                    />
                </div>
            )}

            {currentView === 'invoices' && (
                <div className="flex items-center justify-center h-64 text-slate-400 bg-white rounded border border-dashed border-slate-300">
                    請求一覧ページ（実装予定）
                </div>
            )}
        </main>
      </div>

      <DealInspector 
        deal={selectedDeal} 
        isOpen={isInspectorOpen} 
        onClose={() => setIsInspectorOpen(false)} 
      />
    </div>
  );
}
```
