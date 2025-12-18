"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, ArrowRight, CalendarClock, ClipboardList, Coins } from "lucide-react";

import { useDemoData } from "@/lib/demo-store";
import { toDealViewModel } from "@/lib/view-models";
import { matchesQuickFilter, quickFilterDefinitions } from "@/lib/quick-filters";
import { DEMO_TODAY } from "@/lib/constants";
import {
  YohakuTable,
  YohakuTableBody,
  YohakuTableCell,
  YohakuTableHead,
  YohakuTableHeader,
  YohakuTableRow,
} from "@/components/yohaku/base/table";
import { Button } from "@/components/ui/button";

type AlertCard = {
  key: keyof typeof alertCardMap;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  quickFilter: (typeof quickFilterDefinitions)[number]["key"];
};

const alertCardMap: Record<string, AlertCard> = {
  overdue: {
    key: "overdue",
    label: "未入金（遅延）",
    icon: AlertTriangle,
    quickFilter: "overdue",
  },
  dueSoon: {
    key: "dueSoon",
    label: "入金期限まもなく",
    icon: CalendarClock,
    quickFilter: "dueSoon",
  },
  unbilled: {
    key: "unbilled",
    label: "今月：未請求",
    icon: ClipboardList,
    quickFilter: "unbilledThisMonth",
  },
  outstanding: {
    key: "outstanding",
    label: "未回収額",
    icon: Coins,
    quickFilter: "none",
  },
};

export default function DashboardPage() {
  const router = useRouter();
  const { state, setQuickFilter } = useDemoData();
  const deals = React.useMemo(() => state.deals.map((deal) => toDealViewModel(deal)), [state.deals]);

  const overdue = deals.filter((deal) => matchesQuickFilter(deal, "overdue"));
  const dueSoon = deals.filter((deal) => matchesQuickFilter(deal, "dueSoon"));
  const unbilled = deals.filter((deal) => matchesQuickFilter(deal, "unbilledThisMonth"));
  const outstandingTotal = deals.reduce(
    (total, deal) => total + (deal.invoiceSummary.amountOutstanding ?? 0),
    0
  );

  const activityRows = deals
    .map((deal) => ({
      id: deal.id,
      title: deal.title,
      company: deal.company.name,
      status: deal.status,
      owner: deal.owner.displayName,
      updatedAt: deal.updatedAt,
      alert: deal.alerts[0]?.label ?? "ー",
      activity: deal.activities.at(-1)?.body ?? "更新",
    }))
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    .slice(0, 7);

  const handleNavigate = (filterKey: typeof quickFilterDefinitions[number]["key"]) => {
    setQuickFilter(filterKey);
    router.push("/deals");
  };

  return (
    <div className="flex flex-1 flex-col gap-6 px-4 py-10">
      <header className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow">
        <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">ダッシュボード</p>
        <h1 className="text-3xl font-semibold text-slate-900">今日やるべきこと</h1>
        <p className="mt-2 text-sm text-muted-foreground">デモ日付: {DEMO_TODAY}</p>
      </header>

      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <AlertCard
          icon={alertCardMap.overdue.icon}
          title={alertCardMap.overdue.label}
          value={`${overdue.length} 件`}
          description="最優先で対応"
          onClick={() => handleNavigate("overdue")}
        />
        <AlertCard
          icon={alertCardMap.dueSoon.icon}
          title={alertCardMap.dueSoon.label}
          value={`${dueSoon.length} 件`}
          description="3営業日以内"
          onClick={() => handleNavigate("dueSoon")}
        />
        <AlertCard
          icon={alertCardMap.unbilled.icon}
          title={alertCardMap.unbilled.label}
          value={`${unbilled.length} 件`}
          description="請求漏れ防止"
          onClick={() => handleNavigate("unbilledThisMonth")}
        />
        <AlertCard
          icon={alertCardMap.outstanding.icon}
          title="未回収額"
          value={`¥${outstandingTotal.toLocaleString()}`}
          description="issued - paid"
          onClick={() => handleNavigate("none")}
        />
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">最近の活動</h2>
            <p className="text-sm text-muted-foreground">直近7日間に更新された案件</p>
          </div>
          <Button variant="outline" onClick={() => router.push("/deals")}>
            案件一覧へ
          </Button>
        </div>
        <div className="mt-6">
          <YohakuTable>
            <YohakuTableHeader>
              <YohakuTableRow>
                <YohakuTableHead>更新日</YohakuTableHead>
                <YohakuTableHead>案件名</YohakuTableHead>
                <YohakuTableHead>取引先</YohakuTableHead>
                <YohakuTableHead>ステータス</YohakuTableHead>
                <YohakuTableHead>担当</YohakuTableHead>
                <YohakuTableHead>Alerts</YohakuTableHead>
                <YohakuTableHead>最新ログ</YohakuTableHead>
              </YohakuTableRow>
            </YohakuTableHeader>
            <YohakuTableBody>
              {activityRows.map((row) => (
                <YohakuTableRow key={row.id}>
                  <YohakuTableCell>{row.updatedAt}</YohakuTableCell>
                  <YohakuTableCell>{row.title}</YohakuTableCell>
                  <YohakuTableCell>{row.company}</YohakuTableCell>
                  <YohakuTableCell>{row.status}</YohakuTableCell>
                  <YohakuTableCell>{row.owner}</YohakuTableCell>
                  <YohakuTableCell>{row.alert}</YohakuTableCell>
                  <YohakuTableCell>{row.activity}</YohakuTableCell>
                </YohakuTableRow>
              ))}
            </YohakuTableBody>
          </YohakuTable>
        </div>
      </section>
    </div>
  );
}

const AlertCard = ({
  icon: Icon,
  title,
  value,
  description,
  onClick,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  value: string;
  description: string;
  onClick: () => void;
}) => (
  <button
    type="button"
    onClick={onClick}
    className="flex flex-col gap-2 rounded-3xl border border-slate-200 bg-white/90 p-5 text-left shadow transition hover:-translate-y-1 hover:shadow-xl"
  >
    <Icon className="size-5 text-slate-500" />
    <p className="text-sm font-semibold text-slate-500">{title}</p>
    <p className="text-3xl font-semibold text-slate-900">{value}</p>
    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-indigo-600">
      {description}
      <ArrowRight className="size-3" />
    </div>
  </button>
);
