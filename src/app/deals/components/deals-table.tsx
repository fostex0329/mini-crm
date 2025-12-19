"use client";

import * as React from "react";
import { Search } from "lucide-react";

import { Input } from "@/components/yohaku/ui/input";
import { DataTable } from "@/components/yohaku/ui/data-table";
import { columns, DealsTableMeta } from "./columns";

import { calculateAlerts } from "@/lib/utils";
import { Deal, DEMO_TODAY } from "@/lib/constants";
import { QuickFilterKey } from "@/types/crm";

export const DealsTable = ({ 
  deals, 
  onDealClick, 
  onDealSelect,
  onDealUpdate,
  selectedDealId,
  filter 
}: { 
  deals: Deal[];
  onDealClick: (deal: Deal) => void;
  onDealSelect?: (deal: Deal) => void;
  onDealUpdate?: (dealId: string, updater: (deal: Deal) => Deal) => void;
  selectedDealId?: string | null;
  filter: QuickFilterKey;
}) => {
  const [searchTerm, setSearchTerm] = React.useState('');

  const ownerMap = React.useMemo(() => {
    const map = new Map<string, string>();
    deals.forEach(d => {
      map.set(d.owner_id, d.owner_name);
    });
    return map;
  }, [deals]);

  const filteredDeals = React.useMemo(() => {
      let result = deals;

      // 1. Quick Filters
      if (filter !== 'none' && filter !== undefined) {
          const today = new Date(DEMO_TODAY);
          result = result.filter(deal => {
              const alerts = calculateAlerts(deal, today);
              if (filter === 'overdue') return alerts.some(a => a.type === 'overdue');
              if (filter === 'due_soon') return alerts.some(a => a.type === 'due_soon');
              if (filter === 'unbilled_this_month') return alerts.some(a => a.type === 'unbilled_this_month');
              if (filter === 'action_overdue') return alerts.some(a => a.type === 'action_overdue');
              if (filter === 'planned_this_month') return deal.invoice_planned_month === '2025-12';
              return true;
          });
      }

      // 2. Search
      if (searchTerm) {
          const lower = searchTerm.toLowerCase();
          result = result.filter(deal => 
              deal.title.toLowerCase().includes(lower) || 
              deal.company_name.toLowerCase().includes(lower) ||
              deal.owner_name.toLowerCase().includes(lower)
          );
      }

      return result;
  }, [deals, filter, searchTerm]);

  // Handle Meta for columns access
  const tableMeta: DealsTableMeta = {
      onDealClick,
      onDealUpdate,
      ownerMap
  };

  return (
      <div className="space-y-4">
          <div className="flex items-center gap-2">
               <div className="relative flex-1 max-w-sm">
                   <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                   <Input 
                       placeholder="案件名、取引先、担当者で検索..." 
                       value={searchTerm}
                       onChange={(e) => setSearchTerm(e.target.value)}
                       className="pl-9 bg-white"
                   />
               </div>
               <div className="text-sm text-slate-500 ml-auto">
                   {filteredDeals.length} 件
               </div>
          </div>

          <DataTable 
            columns={columns} 
            data={filteredDeals} 
            meta={tableMeta}
            onRowClick={onDealSelect}
            rowClassName={(deal) => `cursor-pointer hover:bg-slate-50 ${selectedDealId === deal.id ? 'bg-sky-50 hover:bg-sky-100' : ''}`}
          />
      </div>
  );
};
