"use client";

import * as React from "react";

import { useDemoData } from "@/lib/demo-store";
import { DataTable } from "@/components/yohaku/ui/data-table";
import { columns } from "./components/columns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

const invoiceStatusOptions = [
  { value: "all", label: "すべて" },
  { value: "issued", label: "請求済み" },
  { value: "paid", label: "入金済み" },
];

export default function InvoicesPage() {
  const { state, updateDeal } = useDemoData();
  const deals = state.deals;
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [ownerFilter, setOwnerFilter] = React.useState("all");
  const [searchTerm, setSearchTerm] = React.useState("");

  const invoices = deals.filter((deal) => deal.invoice_summary && deal.invoice_summary.status !== "none");

  // Derive owners from deals
  const owners = React.useMemo(() => {
    const uniqueOwners = new Map();
    deals.forEach(deal => {
      if (!uniqueOwners.has(deal.owner_id)) {
        uniqueOwners.set(deal.owner_id, deal.owner_name);
      }
    });
    return Array.from(uniqueOwners.entries()).map(([id, name]) => ({ id, name }));
  }, [deals]);

  const filtered = invoices.filter((deal) => {
    if (statusFilter !== "all" && deal.invoice_summary.status !== statusFilter) return false;
    if (ownerFilter !== "all" && deal.owner_id !== ownerFilter) return false;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      if (
        !deal.title.toLowerCase().includes(term) &&
        !deal.company_name.toLowerCase().includes(term)
      ) {
        return false;
      }
    }
    return true;
  });

  return (
    <div className="flex flex-1 flex-col gap-6">
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
                {owners.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.name}
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
        <DataTable columns={columns} data={filtered} containerClassName="max-h-[calc(100vh-250px)]" meta={{ onDealUpdate: updateDeal }} />
      </section>
    </div>
  );
}
