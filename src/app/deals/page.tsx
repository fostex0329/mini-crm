"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { SidebarTrigger } from "@/components/shadcn/sidebar-07/sidebar";
import { YohakuDashboardDataTable } from "@/components/yohaku/dashboard/data-table";
import type { FacetedFilterConfig } from "@/components/yohaku/dashboard/data-table-toolbar";

import { columns } from "./columns";
import { deals } from "./data";

const dealStatuses = [
  { label: "見込み", value: "見込み" },
  { label: "提案中", value: "提案中" },
  { label: "契約", value: "契約" },
  { label: "請求準備", value: "請求準備" },
  { label: "請求済み", value: "請求済み" },
  { label: "入金済み", value: "入金済み" },
];

export default function DealsPage() {
  const facetedFilters: FacetedFilterConfig[] = [
    {
      columnId: "status",
      title: "ステータス",
      options: dealStatuses,
    },
  ];

  const searchConfig = {
    placeholder: "案件名で検索...",
    columnId: "dealName",
  };

  return (
    <div className="flex flex-1 flex-col gap-10 px-4 py-10">
      <header className="flex items-center justify-between rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-[0_20px_40px_rgba(15,23,42,0.08)]">
        <div className="flex items-center gap-3">
          <SidebarTrigger className="text-muted-foreground" />
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">案件管理</p>
            <h1 className="text-3xl font-semibold text-slate-900">案件一覧</h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/">ダッシュボード</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/deals">案件一覧</BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <section className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-[0_35px_60px_rgba(15,23,42,0.15)]">
        <YohakuDashboardDataTable
          columns={columns}
          data={deals}
          facetedFilters={facetedFilters}
          search={searchConfig}
          actionLabel="新しい案件を登録"
        />
      </section>
    </div>
  );
}
