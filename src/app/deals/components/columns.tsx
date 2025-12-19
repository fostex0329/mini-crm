"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Deal } from "@/lib/constants"
import { calculateAlerts, formatCurrency, formatDate, formatMonth } from "@/lib/utils"
// import { Badge } from "@/components/yohaku/ui/badge" // unused
import { Input } from "@/components/yohaku/ui/input"
import { Button } from "@/components/yohaku/ui/button"
import { ArrowUpDown, CircleAlert } from "lucide-react"
import { DataTableColumnHeader } from "@/components/yohaku/ui/data-table-column-header"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  SelectPill,
  SelectPillContent,
  SelectPillItem,
  SelectPillTrigger,
  SelectPillValue,
} from "@/components/yohaku/ui/select-pill"
import { cn } from "@/lib/utils"

export type DealsTableMeta = {
  onDealClick: (deal: Deal) => void;
  onDealUpdate?: (dealId: string, updater: (deal: Deal) => Deal) => void;
  ownerMap: Map<string, string>;
}

export const columns: ColumnDef<Deal>[] = [
  {
    accessorKey: "alerts",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="アラート" />
    ),
    enableSorting: false,
    cell: ({ row }) => {
      const deal = row.original
      const alerts = calculateAlerts(deal)
      const topAlert = alerts[0]
      if (!topAlert) return null

      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="inline-flex items-center gap-2 rounded-full border border-transparent bg-destructive/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-destructive-foreground shadow-lg shadow-destructive/30 transition cursor-default">
              <CircleAlert className="size-4 text-destructive-foreground/90" />
              <span className="flex-1 text-center truncate min-w-[100px] max-w-[140px]">
                {topAlert.label}
                {alerts.length > 1 && (
                  <span className="ml-2 text-[9px] font-semibold tracking-[0.4em] text-destructive-foreground/80">
                    +{alerts.length - 1}
                  </span>
                )}
              </span>
            </span>
          </TooltipTrigger>
          <TooltipContent
            align="start"
            sideOffset={0}
            className="max-w-xs space-y-3 rounded-2xl border border-destructive/40 bg-destructive/80 px-4 py-3 text-xs text-destructive-foreground backdrop-blur-sm shadow-2xl shadow-destructive/20"
          >
            {alerts.map((alert, index) => (
              <div key={index} className="space-y-1">
                <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-destructive-foreground">
                  {alert.label}
                </p>
                <p className="text-[12px] leading-5 text-destructive-foreground/80">
                  {alert.message || alert.label}
                </p>
                {index < alerts.length - 1 ? (
                  <hr className="border-white/40" />
                ) : null}
              </div>
            ))}
          </TooltipContent>
        </Tooltip>
      )
    },
    size: 140,
  },
  {
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="案件名" />
    ),
    cell: ({ row, table }) => {
      const deal = row.original
      // @ts-ignore
      const meta = table.options.meta as DealsTableMeta
      return (
        <div 
          className="font-medium text-slate-900 cursor-pointer hover:underline hover:text-primary transition-colors truncate min-w-[200px] max-w-[320px]"
          onClick={(e) => {
            e.stopPropagation()
            meta.onDealClick(deal)
          }}
        >
          {deal.title}
        </div>
      )
    },
    enableSorting: true,
  },
  {
    accessorFn: (row) => row.company.name,
    id: "company",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="取引先" />
    ),
    cell: ({ row }) => <div className="truncate text-slate-600 min-w-[140px] max-w-[240px]">{row.original.company?.name || "—"}</div>,
    enableSorting: true,
  },
  {
    accessorKey: "amount_contract",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="金額" />
    ),
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount_contract") || "0")
      return <div className="font-mono text-slate-600">{formatCurrency(amount)}</div>
    },
    enableSorting: true,
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ステータス" />
    ),
    cell: ({ row, table }) => {
        const deal = row.original
        // @ts-ignore
        const meta = table.options.meta as DealsTableMeta
        
        return (
          <div onClick={(e) => e.stopPropagation()}>
             <SelectPill 
                value={deal.status} 
                onValueChange={(value) => {
                   if (meta.onDealUpdate) {
                     meta.onDealUpdate(deal.id, (old) => ({ ...old, status: value as any }))
                   }
                }}
             >
              <SelectPillTrigger 
                className={cn(
                  "w-fit border-0 px-2.5 py-0.5 text-[11px] font-semibold h-6",
                  {
                    "bg-blue-50 text-blue-700": deal.status === "見込み",
                    "bg-indigo-50 text-indigo-700": deal.status === "提案中",
                    "bg-emerald-50 text-emerald-700": deal.status === "契約",
                    "bg-amber-50 text-amber-700": deal.status === "請求準備",
                    "bg-orange-50 text-orange-700": deal.status === "請求済み",
                    "bg-purple-50 text-purple-700": deal.status === "入金済み",
                    "bg-slate-100 text-slate-600": deal.status === "完了/保守",
                    "bg-slate-50 text-slate-400 border-dashed border-slate-300": !deal.status || deal.status === "unselected",
                  }
                )}
              >
                <SelectPillValue placeholder="未設定">
                   {!deal.status ? "未設定" : (deal.status === "unselected" ? "未設定" : deal.status)}
                </SelectPillValue>
              </SelectPillTrigger>
              <SelectPillContent>
                <SelectPillItem value="unselected">未設定</SelectPillItem>
                <SelectPillItem value="見込み">見込み</SelectPillItem>
                <SelectPillItem value="提案中">提案中</SelectPillItem>
                <SelectPillItem value="契約">契約</SelectPillItem>
                <SelectPillItem value="請求準備">請求準備</SelectPillItem>
                <SelectPillItem value="請求済み">請求済み</SelectPillItem>
                <SelectPillItem value="入金済み">入金済み</SelectPillItem>
                <SelectPillItem value="完了/保守">完了/保守</SelectPillItem>
              </SelectPillContent>
            </SelectPill>
          </div>
        )
    },
    enableSorting: true,
  },
  {
    accessorFn: (row) => row.owner.display_name,
    id: "owner",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="担当" />
    ),
    cell: ({ row }) => <div className="text-slate-600">{row.original.owner?.display_name || "—"}</div>,
    enableSorting: true,
  },
  {
    accessorFn: (row) => row.next_action.text,
    id: "next_action",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="次アクション" />
    ),
    cell: ({ row, table }) => {
        const deal = row.original
        // @ts-ignore
        const meta = table.options.meta as DealsTableMeta

        return (
            <div onClick={(e) => e.stopPropagation()}>
                <Input 
                    defaultValue={row.original.next_action.text}
                    className="h-7 text-xs border-transparent bg-transparent hover:bg-slate-50 hover:border-slate-200 focus-visible:bg-white focus-visible:border-slate-300 w-full min-w-[200px]"
                    onBlur={(e) => {
                        const newValue = e.target.value;
                        if (newValue !== deal.next_action.text) {
                            if (meta.onDealUpdate) {
                                meta.onDealUpdate(deal.id, (old) => ({
                                    ...old,
                                    next_action: { ...old.next_action, text: newValue }
                                }))
                            }
                        }
                    }}
                />
            </div>
        )
    },
    enableSorting: false, // Usually text search, but sorting is OK too if needed. MVP defaults to no sort for free text usually.
  },
  {
    accessorFn: (row) => row.next_action?.owner_id,
    id: "next_action_owner",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="次対応者" />
    ),
    cell: ({ row, table }) => {
        // @ts-ignore
      const meta = table.options.meta as DealsTableMeta
      const ownerId = row.original.next_action?.owner_id
      const ownerName = meta?.ownerMap?.get(ownerId || '') || ownerId
      return <div className="text-slate-600 truncate min-w-[100px] max-w-[140px]">{ownerName}</div>
    },
    enableSorting: true,
    size: 100,
  },
  {
    accessorFn: (row) => row.next_action?.due_date,
    id: "next_action_due_date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="期限" />
    ),
    cell: ({ row }) => {
       const deal = row.original
       const isOverdue = calculateAlerts(deal).some(a=>a.type==='action_overdue')
       return <div className={`whitespace-nowrap ${isOverdue ? 'text-red-600 font-medium' : 'text-slate-600'}`}>{formatDate(deal.next_action?.due_date)}</div>
    },
    enableSorting: true,
    size: 120,
  },
  {
      accessorKey: "invoice_planned_month",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="請求予定" />
      ),
      cell: ({ row }) => <div className="text-slate-600 whitespace-nowrap">{formatMonth(row.getValue("invoice_planned_month"))}</div>,
      enableSorting: true,
      size: 100,
  },
  {
    accessorFn: (row) => row.invoice_summary.invoice_due_date,
    id: "invoice_due_date",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="px-0 hover:bg-transparent"
        >
          入金期日
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
        const deal = row.original
        const isOverdue = calculateAlerts(deal).some(a=>a.type==='overdue')
        return (
            <div className="whitespace-nowrap">
                {deal.invoice_summary.status === 'issued' ? (
                  <span className={isOverdue ? 'text-red-600 font-bold' : 'text-slate-600'}>
                      {formatDate(deal.invoice_summary.invoice_due_date)}
                  </span>
                ) : <span className="text-slate-600">-</span>}
            </div>
        )
    },
    size: 120,
    enableSorting: true,
  },
  {
    accessorFn: (row) => row.invoice_summary.amount_outstanding,
    id: "amount_outstanding",
    header: ({ column }) => (
        <DataTableColumnHeader column={column} title="未回収" />
    ),
    cell: ({ row }) => <div className="text-right text-slate-600 font-mono whitespace-nowrap">{formatCurrency(row.original.invoice_summary.amount_outstanding)}</div>,
    enableSorting: true,
    size: 100,
  },
]
