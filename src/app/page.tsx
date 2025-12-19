"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { 
  AlertCircle, 
  Briefcase, 
  Clock, 
  FileText, 
  LayoutDashboard, 
  Plus 
} from "lucide-react";

import { useDemoData } from "@/lib/demo-store";
import { calculateAlerts, formatDateTime, formatCurrency } from "@/lib/utils";
import { SEED_DEALS, DEMO_TODAY, Deal } from "@/lib/constants";
import { QuickFilterKey } from "@/types/crm";

import { Button } from "@/components/yohaku/ui/button";
import { Badge } from "@/components/yohaku/ui/badge";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/yohaku/ui/card";
import { DataTable } from "@/components/yohaku/ui/data-table";
import { columns } from "@/app/dashboard-columns";

const KPICard = ({ 
  title, 
  count, 
  colorClass, 
  onClick, 
  icon: Icon 
}: { 
  title: string; 
  count: number; 
  colorClass: string; 
  onClick: () => void; 
  icon: React.ElementType 
}) => (
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

const RecentActivityTable = ({ deals, onDealClick, onDealUpdate }: { 
  deals: Deal[], 
  onDealClick: (deal: Deal) => void,
  onDealUpdate: (dealId: string, updater: (deal: Deal) => Deal) => void
}) => {
  const recentDeals = React.useMemo(() => {
      const today = new Date(DEMO_TODAY);
      const sevenDaysAgo = new Date(today);
      sevenDaysAgo.setDate(today.getDate() - 7);

      return deals
          .filter(deal => {
              const updated = new Date(deal.updated_at);
              return updated >= sevenDaysAgo && updated <= today;
          })
          .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
  }, [deals]);

  return (
      <DataTable 
        columns={columns} 
        data={recentDeals} 
        onRowClick={onDealClick}
        containerClassName="max-h-[400px]"
        rowClassName={(row) => "cursor-pointer hover:bg-slate-50"}
        meta={{ onDealUpdate }}
      />
  );
};

export default function DashboardPage() {
const router = useRouter();
const { state, setQuickFilter, setActiveNav, updateDeal } = useDemoData();
const deals = state.deals;

const today = new Date(DEMO_TODAY);
const alerts = deals.flatMap(d => calculateAlerts(d, today));

const countOverdue = alerts.filter(a => a.type === 'overdue').length;
const countDueSoon = alerts.filter(a => a.type === 'due_soon').length;
const countUnbilled = alerts.filter(a => a.type === 'unbilled_this_month').length;
const countActionOverdue = alerts.filter(a => a.type === 'action_overdue').length;

const monthlyEstimate = React.useMemo(() => {
  const today = new Date(DEMO_TODAY);
  const currentMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
  return deals
    .filter((d) => d.invoice_planned_month === currentMonth)
    .reduce((sum, d) => sum + (d.amount_expected ?? d.amount_contract ?? 0), 0);
}, [deals]);

const handleNavigateToFilter = (filter: QuickFilterKey) => {
    setQuickFilter(filter);
    setActiveNav('deals');
    router.push('/deals');
};

const handleDealClick = (deal: Deal) => {
    // For now navigate to deals page, later maybe open inspector or deal detail page
    // Using query param to open inspector on deals page might be good, 
    // but simply going to deals page finding the deal is okay for now.
    // Or we can just go to /deals?id=...
    router.push(`/deals?id=${deal.id}`);
};

return (
    <div className="space-y-6">
        <header className="flex items-center justify-between">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Dashboard</h1>
            <div className="flex items-center gap-4">
                <Button size="sm" className="hidden md:flex gap-2">
                    <Plus className="h-4 w-4" /> 新規案件
                </Button>
            </div>
        </header>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <KPICard 
                title="未入金（遅延）" 
                count={countOverdue} 
                colorClass="text-red-600" 
                icon={AlertCircle}
                onClick={() => handleNavigateToFilter('overdue')}
            />
            <KPICard 
                title="入金期限まもなく" 
                count={countDueSoon} 
                colorClass="text-amber-500" 
                icon={Clock}
                onClick={() => handleNavigateToFilter('due_soon')}
            />
            <KPICard 
                title="今月：未請求" 
                count={countUnbilled} 
                colorClass="text-sky-500" 
                icon={FileText}
                onClick={() => handleNavigateToFilter('unbilled_this_month')}
            />
            <KPICard 
                title="対応期限切れ" 
                count={countActionOverdue} 
                colorClass="text-slate-600" 
                icon={Clock}
                onClick={() => handleNavigateToFilter('action_overdue')}
            />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
             <Card className="col-span-2">
                 <CardHeader>
                     <CardTitle>Recent Activity</CardTitle>
                 </CardHeader>
                 <CardContent>
                     <RecentActivityTable deals={deals} onDealClick={handleDealClick} onDealUpdate={updateDeal} />
                 </CardContent>
             </Card>

             <Card>
                <CardHeader>
                    <CardTitle>今月の見込み</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-bold text-slate-900 tracking-tight">
                      {formatCurrency(monthlyEstimate)}
                    </div>
                    <div className="text-sm text-slate-500 mt-1">請求予定総額</div>
                </CardContent>
             </Card>
        </div>
    </div>
);
}
