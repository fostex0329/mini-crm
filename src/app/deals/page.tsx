"use client";

import * as React from "react";
import { Plus, X } from "lucide-react";

import { useDemoData } from "@/lib/demo-store";
import { QuickFilterKey } from "@/types/crm";
import { Deal } from "@/lib/constants";

import { Button } from "@/components/yohaku/ui/button";
import { Badge } from "@/components/yohaku/ui/badge";

import { DealsTable } from "./components/deals-table";
import { DealInspector } from "./components/deal-inspector";

export default function DealsPage() {
  const { state, setQuickFilter, addDeal, updateDeal } = useDemoData();
  const filter = state.quickFilter;
  const deals = state.deals;

  const [selectedDealId, setSelectedDealId] = React.useState<string | null>(null);
  const [isInspectorOpen, setIsInspectorOpen] = React.useState(false);

  const selectedDeal = React.useMemo(() => {
    return deals.find(d => d.id === selectedDealId) || null;
  }, [deals, selectedDealId]);

  const handleCreateDeal = () => {
    const newDeal: Deal = {
        id: `D${Date.now()}`,
        title: "新規案件",
        workspace_id: "WS001",
        company_id: "",
        company_name: "新規取引先",
        status: "見込み",
        owner_id: "U001",
        owner_name: "未設定",
        amount_contract: 0,
        next_action: { text: "", owner_id: "", due_date: "" },
        invoice_planned_month: "",
        invoice_summary: { status: "none", invoice_date: "", invoice_due_date: "", amount_invoice: 0, amount_outstanding: 0 },
        updated_at: new Date().toISOString(),
        last_activity_summary: "作成"
    };
    addDeal(newDeal);
    setSelectedDealId(newDeal.id);
    setIsInspectorOpen(true);
  };

  return (
    <div className="space-y-6">
        <header className="flex items-center justify-between">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                案件一覧
            </h1>
            <div className="flex items-center gap-4">
                <Button size="sm" className="hidden md:flex gap-2" onClick={handleCreateDeal}>
                    <Plus className="h-4 w-4" /> 新規案件
                </Button>
            </div>
        </header>

        <main>
            <div className="space-y-4">
                {filter !== 'none' && filter !== undefined && (
                    <div className="flex items-center gap-2 mb-4">
                        <span className="text-sm text-slate-500">Active Filter:</span>
                        <Badge variant="secondary" className="px-3 py-1 text-sm flex gap-2 items-center">
                            {filter === 'overdue' && '未入金（遅延）'}
                            {filter === 'due_soon' && '入金期限まもなく'}
                            {filter === 'unbilled_this_month' && '今月：未請求'}
                            {filter === 'action_overdue' && '対応期限切れ'}
                            <X className="h-3 w-3 cursor-pointer hover:text-slate-900" onClick={() => setQuickFilter('none')} />
                        </Badge>
                    </div>
                )}
                
                <DealsTable 
                    deals={deals} 
                    filter={filter}
                    selectedDealId={selectedDealId}
                    onDealSelect={(deal) => setSelectedDealId(deal.id)}
                    onDealClick={(deal) => {
                        setSelectedDealId(deal.id);
                        setIsInspectorOpen(true);
                    }}
                    onDealUpdate={(dealId, updater) => updateDeal(dealId, updater)}
                />
            </div>
        </main>

        <DealInspector 
            deal={selectedDeal} 
            isOpen={isInspectorOpen} 
            onClose={() => setIsInspectorOpen(false)} 
        />
    </div>
  );
}
