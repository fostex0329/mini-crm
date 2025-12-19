"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Deal } from "@/lib/constants"
import { calculateAlerts, formatCurrency, formatDate, formatDateTime } from "@/lib/utils"
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

interface InvoicesTableMeta {
  onDealUpdate: (dealId: string, updater: (deal: Deal) => Deal) => void;
}

export const columns: ColumnDef<Deal>[] = [
  {
    accessorKey: "alerts",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="アラート" />
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
    size: 140,
  },
  {
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="px-0 hover:bg-transparent"
        >
          案件名
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="font-medium text-slate-900 truncate min-w-[180px] max-w-[300px]">{row.getValue("title")}</div>,
    minSize: 200,
  },
  {
    accessorKey: "company_name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="px-0 hover:bg-transparent"
        >
          取引先
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="text-slate-600 truncate min-w-[140px] max-w-[240px]">{row.getValue("company_name")}</div>,
    minSize: 140,
  },
  {
    accessorKey: "owner_name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="px-0 hover:bg-transparent"
        >
          担当
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="text-slate-600 truncate max-w-[100px]">{row.getValue("owner_name")}</div>,
    size: 100,
  },
  {
    accessorFn: (row) => row.invoice_summary.invoice_date,
    id: "invoice_date",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="px-0 hover:bg-transparent"
        >
          請求日
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="whitespace-nowrap">{formatDate(row.original.invoice_summary.invoice_date) || "—"}</div>,
    size: 120,
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
        return <div className={`whitespace-nowrap ${isOverdue ? 'text-red-600 font-bold' : ''}`}>{formatDate(deal.invoice_summary.invoice_due_date) || "—"}</div>
    },
    size: 120,
  },
  {
    accessorFn: (row) => row.invoice_summary.amount_invoice,
    id: "amount_invoice",
    header: ({ column }) => {
      return (
        <div className="text-right">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="px-0 hover:bg-transparent"
          >
            請求金額
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )
    },
    cell: ({ row }) => <div className="text-right font-mono text-slate-600">{row.original.invoice_summary.amount_invoice ? formatCurrency(row.original.invoice_summary.amount_invoice) : "—"}</div>,
    size: 120,
  },
  {
      accessorFn: (row) => row.invoice_summary.amount_outstanding,
      id: "amount_outstanding",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="未回収" />
      ),
      cell: ({ row }) => <div className="text-right font-mono text-slate-600">{row.original.invoice_summary.amount_outstanding != null ? formatCurrency(row.original.invoice_summary.amount_outstanding) : "—"}</div>,
      size: 120,
  },
  {
    accessorFn: (row) => row.invoice_summary.paid_date,
    id: "paid_date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="入金日" />
    ),
    cell: ({ row }) => <div className="whitespace-nowrap">{row.original.invoice_summary.paid_date ? formatDate(row.original.invoice_summary.paid_date) : "—"}</div>,
    size: 120,
  },

  {
    accessorFn: (row) => row.invoice_summary.status,
    id: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ステータス" />
    ),
    cell: ({ row, table }) => {
        const deal = row.original
        const status = deal.invoice_summary.status
        // @ts-ignore
        const meta = table.options.meta as InvoicesTableMeta
        
        return (
          <div onClick={(e) => e.stopPropagation()}>
             <SelectPill 
                value={status === "none" ? "unselected" : status} 
                onValueChange={(value) => {
                   if (meta.onDealUpdate) {
                     // Update invoice_summary.status
                     // If "unselected" mapped to "none"
                     const newStatus = value === "unselected" ? "none" : value
                     meta.onDealUpdate(deal.id, (old) => ({ 
                       ...old, 
                       invoice_summary: { ...old.invoice_summary, status: newStatus as any }
                     }))
                   }
                }}
             >
              <SelectPillTrigger 
                className={cn(
                  "w-fit border-0 px-2.5 py-0.5 text-[11px] font-semibold h-6",
                  {
                    "bg-slate-50 text-slate-400 border-dashed border-slate-300": !status || status === "none" || status === "draft",
                    "bg-orange-50 text-orange-700": status === "issued",
                    "bg-purple-50 text-purple-700": status === "paid",
                    "bg-red-50 text-red-700": status === "overdue",
                  }
                )}
              >
                <SelectPillValue placeholder="未設定">
                   {(() => {
                     const s = status as string
                     const statusMap: Record<string, string> = {
                       "draft": "下書き",
                       "issued": "請求済み",
                       "paid": "入金済み",
                       "overdue": "期限切れ",
                       "none": "未設定"
                     }
                     return statusMap[s] || "未設定"
                   })()}
                </SelectPillValue>
              </SelectPillTrigger>
              <SelectPillContent>
                <SelectPillItem value="unselected">未設定</SelectPillItem>
                <SelectPillItem value="draft">下書き</SelectPillItem>
                <SelectPillItem value="issued">請求済み</SelectPillItem>
                <SelectPillItem value="paid">入金済み</SelectPillItem>
              </SelectPillContent>
            </SelectPill>
          </div>
        )
    },
  },
  {
    accessorKey: "updated_at",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="更新日" />
    ),
    cell: ({ row }) => <div className="text-xs text-slate-500 font-mono whitespace-nowrap">{formatDateTime(row.getValue("updated_at"))}</div>,
    size: 140,
  },
]
