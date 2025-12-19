"use client";

import * as React from "react";
import Link from "next/link";

import { AppSidebar } from "@/components/shadcn/sidebar-07/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/shadcn/sidebar-07/sidebar";
import { Button } from "@/components/ui/button";
import { MonthPicker } from "@/components/_yohaku_old/base/month-picker";
import { DateTimePicker } from "@/components/_yohaku_old/base/date-time-picker";
import { AlertsTooltip, type AlertRecord } from "@/components/_yohaku_old/base/alerts-tooltip";

const demoAlerts: AlertRecord[] = [
  {
    label: "未入金（遅延）",
    reason: "実効期日（2025/12/17）を 1 日超過しています。",
  },
  {
    label: "入金期限まもなく",
    reason: "あと 2 営業日で 2025/12/18 に期日到来します。",
  },
  {
    label: "今月：未請求",
    reason: "請求予定月が 2025-12 のまま、まだ請求済みではありません。",
  },
];

export default function ComponentPreviewPage() {
  const [selectedMonth, setSelectedMonth] = React.useState<string>();
  const [selectedDateTime, setSelectedDateTime] = React.useState<string>();

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="flex flex-col gap-6 bg-slate-50 p-6">
        <header className="flex flex-col gap-3 rounded-3xl border border-slate-200 bg-white/90 p-6 shadow">
          <div className="flex items-center gap-3">
            <SidebarTrigger className="text-muted-foreground" />
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">Components</p>
              <h1 className="text-2xl font-semibold text-slate-900">Preview</h1>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            新規に追加した Yohaku ベースの MonthPicker / DateTimePicker / AlertsTooltip を確認できます。
          </p>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" asChild>
              <Link href="/sample">Sample Overview</Link>
            </Button>
            <Button asChild>
              <Link href="/">Back to Dashboard</Link>
            </Button>
          </div>
        </header>

        <section className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4 rounded-3xl border border-slate-200 bg-white/90 p-6 shadow">
            <h2 className="text-lg font-semibold text-slate-900">請求予定月</h2>
            <MonthPicker
              label="請求予定月"
              value={selectedMonth}
              onChange={setSelectedMonth}
              placeholder="希望の月を選択"
            />
            <p className="text-sm text-muted-foreground">
              選択中：{selectedMonth ?? "未設定"}
            </p>
          </div>
          <div className="space-y-4 rounded-3xl border border-slate-200 bg-white/90 p-6 shadow">
            <h2 className="text-lg font-semibold text-slate-900">請求/入金の日付</h2>
            <DateTimePicker
              label="請求日・入金期日"
              value={selectedDateTime}
              onChange={setSelectedDateTime}
              placeholder="任意の日付・時刻を選択"
            />
            <p className="text-sm text-muted-foreground">
              ISO：{selectedDateTime ?? "未設定"}
            </p>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow">
          <h2 className="text-lg font-semibold text-slate-900">Alerts Tooltip</h2>
          <p className="text-sm text-muted-foreground">Hover もしくは focus で内容を確認できます。</p>
          <div className="mt-4">
            <AlertsTooltip alerts={demoAlerts} />
          </div>
        </section>
      </SidebarInset>
    </SidebarProvider>
  );
}
