"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/yohaku/ui/button"
import { ArrowUpDown, CircleAlert } from "lucide-react"
import { DataTableColumnHeader } from "@/components/yohaku/ui/data-table-column-header"
import { Deal } from "@/lib/constants"
import { calculateAlerts, formatDateTime } from "@/lib/utils"
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

interface DashboardTableMeta {
  onDealUpdate: (dealId: string, updater: (deal: Deal) => Deal) => void;
}

export const columns: ColumnDef<Deal>[] = [
  {
    accessorFn: (row) => row.updated_at,
    id: "updated_at",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="更新日" />
    ),
    cell: ({ row }) => <div className="text-xs text-slate-500 whitespace-nowrap">{formatDateTime(row.original.updated_at)}</div>,
    enableSorting: true,
    size: 120,
  },
  {
    accessorKey: "alerts",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ALERTS" />
    ),
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
    enableSorting: false,
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
      const meta = table.options.meta as DashboardTableMeta
      return (
        <div 
          className="font-medium text-slate-900 cursor-pointer hover:underline hover:text-primary transition-colors truncate min-w-[180px] max-w-[300px]"
          onClick={(e) => {
             // Dashboard might allow clicking to open deal
             // Use same pattern if meta provided
             // But spec 6.1.2 says "Click Deal Name to open Deal Inspector"
             // Assuming onDealClick hook will be similar if we want it
             // For now, simple display as recent activity
          }}
        >
          {deal.title}
        </div>
      )
    },
    enableSorting: true,
  },
  {
    accessorKey: "company_name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="取引先" />
    ),
    cell: ({ row }) => <div className="truncate text-slate-600 min-w-[140px] max-w-[200px]">{row.original.company_name || "—"}</div>,
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
        const meta = table.options.meta as DashboardTableMeta
        
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
    accessorKey: "owner_name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="担当" />
    ),
    cell: ({ row }) => <div className="text-slate-600">{row.original.owner_name || "—"}</div>,
    enableSorting: true,
  },
  {
    id: "last_update",
    header: "最終更新内容",
    cell: ({ row }) => {
        const deal = row.original
        return <div className="text-slate-600 truncate max-w-[200px]">{deal.last_activity_summary || "案件作成"}</div>
    },
    enableSorting: false,
    minSize: 200,
  }
]
