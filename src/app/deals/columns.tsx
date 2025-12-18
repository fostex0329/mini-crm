"use client";

import type { ColumnDef } from "@tanstack/react-table";

import { AlertsTooltip } from "@/components/yohaku/base/alerts-tooltip";

import type { DealRow } from "./data";

const statusColorMap: Record<DealRow["status"], string> = {
  見込み: "bg-slate-400 text-white",
  提案中: "bg-blue-500 text-white",
  契約: "bg-green-500 text-white",
  請求準備: "bg-yellow-500 text-slate-900",
  請求済み: "bg-orange-500 text-white",
  入金済み: "bg-purple-500 text-white",
};

export const columns: ColumnDef<DealRow>[] = [
  {
    accessorKey: "alerts",
    header: "Alerts",
    cell: ({ row }) => {
      const alerts = row.original.alerts;
      if (!alerts.length) {
        return <span className="text-xs text-muted-foreground">ー</span>;
      }
      return <AlertsTooltip alerts={alerts} />;
    },
  },
  {
    accessorKey: "dealName",
    header: "案件名",
  },
  {
    accessorKey: "companyName",
    header: "クライアント",
  },
  {
    accessorKey: "amount",
    header: "金額",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));
      const formatted = new Intl.NumberFormat("ja-JP", {
        style: "currency",
        currency: "JPY",
      }).format(amount);
      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "status",
    header: "ステータス",
    cell: ({ row }) => {
      const status = row.getValue("status") as DealRow["status"];
      const badgeClass =
        statusColorMap[status] ?? "bg-slate-100 text-slate-800 border border-slate-200";
      return (
        <span
          className={`inline-flex items-center justify-center rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] ${badgeClass}`}
        >
          {status}
        </span>
      );
    },
  },
  {
    accessorKey: "owner",
    header: "担当者",
    cell: ({ row }) => (
      <span className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
        {row.getValue("owner")}
      </span>
    ),
  },
  {
    accessorKey: "nextActionText",
    header: "次アクション",
  },
  {
    accessorKey: "nextActionOwner",
    header: "次アクション担当",
  },
  {
    accessorKey: "nextActionDue",
    header: "期限",
  },
  {
    accessorKey: "invoicePlannedMonth",
    header: "請求予定月",
  },
  {
    accessorKey: "invoiceStatus",
    header: "請求状態",
  },
  {
    accessorKey: "invoiceDueDate",
    header: "入金期日",
  },
  {
    accessorKey: "amountInvoice",
    header: "請求金額",
    cell: ({ row }) => {
      const amount = row.getValue("amountInvoice") as number | undefined;
      return amount ? `¥${amount.toLocaleString()}` : "—";
    },
  },
  {
    accessorKey: "amountOutstanding",
    header: "未回収額",
    cell: ({ row }) => {
      const amount = row.getValue("amountOutstanding") as number | undefined;
      return amount != null ? `¥${amount.toLocaleString()}` : "—";
    },
  },
  {
    accessorKey: "updatedAt",
    header: "最終更新日",
  },
];
