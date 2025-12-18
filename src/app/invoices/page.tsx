"use client";

import * as React from "react";

import { useDemoData } from "@/lib/demo-store";
import { toDealViewModel } from "@/lib/view-models";
import {
  YohakuTable,
  YohakuTableBody,
  YohakuTableCell,
  YohakuTableHead,
  YohakuTableHeader,
  YohakuTableRow,
} from "@/components/yohaku/base/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

const invoiceStatusOptions = [
  { value: "all", label: "すべて" },
  { value: "issued", label: "請求済み" },
  { value: "paid", label: "入金済み" },
];

export default function InvoicesPage() {
  const { state } = useDemoData();
  const deals = React.useMemo(() => state.deals.map((deal) => toDealViewModel(deal)), [state.deals]);
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [ownerFilter, setOwnerFilter] = React.useState("all");
  const [searchTerm, setSearchTerm] = React.useState("");

  const invoices = deals.filter((deal) => deal.invoice && deal.invoice.status !== "none");

  const filtered = invoices.filter((deal) => {
    if (statusFilter !== "all" && deal.invoice?.status !== statusFilter) return false;
    if (ownerFilter !== "all" && deal.owner.id !== ownerFilter) return false;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      if (
        !deal.title.toLowerCase().includes(term) &&
        !deal.company.name.toLowerCase().includes(term)
      ) {
        return false;
      }
    }
    return true;
  });

  return (
    <div className="flex flex-1 flex-col gap-6 px-4 py-10">
      <header className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow">
        <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">請求</p>
            <h1 className="text-3xl font-semibold text-slate-900">Invoices</h1>
          </div>
          <div className="flex flex-wrap gap-3">
            <Input
              placeholder="案件名や取引先で検索"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className="w-60 rounded-2xl border-slate-200 bg-slate-50 text-sm"
            />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40 rounded-2xl border-slate-200 bg-slate-50 text-sm">
                <SelectValue placeholder="ステータス" />
              </SelectTrigger>
              <SelectContent>
                {invoiceStatusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={ownerFilter} onValueChange={setOwnerFilter}>
              <SelectTrigger className="w-40 rounded-2xl border-slate-200 bg-slate-50 text-sm">
                <SelectValue placeholder="担当" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">すべて</SelectItem>
                {state.users.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.displayName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </header>

      <section className="space-y-3">
        <p className="text-sm text-muted-foreground">
          {filtered.length} 件 / 全 {invoices.length} 件
        </p>
        <YohakuTable>
          <YohakuTableHeader>
            <YohakuTableRow>
              <YohakuTableHead>案件名</YohakuTableHead>
              <YohakuTableHead>取引先</YohakuTableHead>
              <YohakuTableHead>担当</YohakuTableHead>
              <YohakuTableHead>請求日</YohakuTableHead>
              <YohakuTableHead>入金期日</YohakuTableHead>
              <YohakuTableHead>請求金額</YohakuTableHead>
              <YohakuTableHead>未回収額</YohakuTableHead>
              <YohakuTableHead>ステータス</YohakuTableHead>
            </YohakuTableRow>
          </YohakuTableHeader>
          <YohakuTableBody>
            {filtered.map((deal) => (
              <YohakuTableRow key={deal.id}>
                <YohakuTableCell>{deal.title}</YohakuTableCell>
                <YohakuTableCell>{deal.company.name}</YohakuTableCell>
                <YohakuTableCell>{deal.owner.displayName}</YohakuTableCell>
                <YohakuTableCell>{deal.invoice?.invoiceDate ?? "—"}</YohakuTableCell>
                <YohakuTableCell>{deal.invoice?.invoiceDueDate ?? "—"}</YohakuTableCell>
                <YohakuTableCell>
                  {deal.invoice?.amountInvoice
                    ? `¥${deal.invoice.amountInvoice.toLocaleString()}`
                    : "—"}
                </YohakuTableCell>
                <YohakuTableCell>
                  {deal.invoiceSummary.amountOutstanding != null
                    ? `¥${deal.invoiceSummary.amountOutstanding.toLocaleString()}`
                    : "—"}
                </YohakuTableCell>
                <YohakuTableCell>{deal.invoice?.status ?? "none"}</YohakuTableCell>
              </YohakuTableRow>
            ))}
          </YohakuTableBody>
        </YohakuTable>
      </section>
    </div>
  );
}
