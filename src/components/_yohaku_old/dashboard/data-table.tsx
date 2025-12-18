"use client";

import * as React from "react";
import { addMonths, format as formatDate } from "date-fns";
import {
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DraggableAttributes,
  type SyntheticListenerMap,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  type ColumnDef,
  type ColumnFiltersState,
  type Row,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  ChevronsUpDown,
  ArrowUpIcon,
  ArrowDownIcon,
  EyeOffIcon,
  GripVerticalIcon,
  MoreVerticalIcon,
  CopyIcon,
  PencilIcon,
  StarIcon,
  Trash2Icon,
} from "lucide-react";

import { YohakuButton } from "@/components/yohaku/base/button";
import { YohakuInput } from "@/components/yohaku/base/input";
import { YohakuDatePickerButton } from "@/components/yohaku/dashboard/date-picker-field";
import {
  YohakuSheet,
  YohakuSheetBody,
  YohakuSheetClose,
  YohakuSheetContent,
  YohakuSheetFooter,
  YohakuSheetForm,
  YohakuSheetSection,
} from "@/components/yohaku/base/sheet";
import {
  YohakuSelect,
  YohakuSelectContent,
  YohakuSelectItem,
  YohakuSelectTrigger,
  YohakuSelectValue,
} from "@/components/yohaku/base/select";
import {
  YohakuTable,
  YohakuTableBody,
  YohakuTableCell,
  YohakuTableHead,
  YohakuTableHeader,
  YohakuTableRow,
} from "@/components/yohaku/base/table";
import {
  DataTableToolbar,
  type DataTableSearchConfig,
  type FacetedFilterConfig,
} from "@/components/yohaku/dashboard/data-table-toolbar";
import {
  YohakuDropdownMenu,
  YohakuDropdownMenuContent,
  YohakuDropdownMenuItem,
  YohakuDropdownMenuSeparator,
  YohakuDropdownMenuTrigger,
} from "@/components/yohaku/base/dropdown-menu";
import { YohakuCheckbox } from "@/components/yohaku/base/checkbox";
import { cn } from "@/lib/utils";
import {
  DASHBOARD_TABLE_MIN_WIDTH,
  dashboardColumnLayout,
} from "@/components/yohaku/dashboard/data/column-layout";

const dealStatuses = [
  { label: "見込み", value: "見込み" },
  { label: "提案中", value: "提案中" },
  { label: "契約", value: "契約" },
  { label: "請求準備", value: "請求準備" },
  { label: "請求済み", value: "請求済み" },
  { label: "入金済み", value: "入金済み" },
] as const;

const ownerOptions = ["佐藤 恵", "田中 太郎", "鈴木 一郎"];

const statusColorMap: Record<string, string> = {
  見込み: "bg-slate-400 text-white",
  提案中: "bg-blue-500 text-white",
  契約: "bg-green-500 text-white",
  請求準備: "bg-yellow-500 text-black",
  請求済み: "bg-orange-500 text-white",
  入金済み: "bg-purple-500 text-white",
};

const sheetFieldLabelClass =
  "text-[10px] font-semibold uppercase tracking-[0.3em] text-muted-foreground";

const pillBaseClass =
  "inline-flex items-center justify-center gap-2 rounded-full border px-6 py-1 text-[11px] font-semibold uppercase tracking-[0.25em]";
const pillIconHiddenClass = "gap-0 text-xs [&>svg]:hidden";
const pillDateButtonClass =
  "inline-flex w-fit items-center justify-between gap-2 rounded-full border border-slate-200 bg-white px-4 py-1 text-xs font-semibold text-slate-700 shadow-sm transition hover:border-slate-300";
const statusStyleMap: Record<string, string> = {
  見込み: "border-slate-200 bg-slate-50 text-slate-800",
  提案中: "border-slate-200 bg-blue-50 text-blue-700",
  契約: "border-slate-200 bg-green-50 text-green-700",
  請求準備: "border-slate-200 bg-yellow-50 text-yellow-700",
  請求済み: "border-slate-200 bg-orange-50 text-orange-700",
  入金済み: "border-slate-200 bg-purple-50 text-purple-700",
};

const MONTH_PICKER_MONTHS = 18;

type MonthPickerOption = {
  value: string;
  label: string;
};

const buildMonthPickerOptions = (months: number): MonthPickerOption[] => {
  const options: MonthPickerOption[] = [];
  let cursor = new Date();
  for (let index = 0; index < months; index += 1) {
    options.push({
      value: formatDate(cursor, "yyyy-MM"),
      label: formatDate(cursor, "yyyy/MM"),
    });
    cursor = addMonths(cursor, 1);
  }
  return options;
};

const monthPickerOptions = buildMonthPickerOptions(MONTH_PICKER_MONTHS);

type DealStatus = (typeof dealStatuses)[number]["value"];

type NewDealFormState = {
  dealName: string;
  clientName: string;
  amount: string;
  status: DealStatus;
  owner: string;
  updatedAt: string;
};

const createInitialDealForm = (): NewDealFormState => ({
  dealName: "",
  clientName: "",
  amount: "",
  status: dealStatuses[0].value,
  owner: ownerOptions[0],
  updatedAt: new Date().toISOString().slice(0, 10),
});

type DealRecord = {
  dealName?: string;
  clientName?: string;
  amount?: number | string;
  status?: string;
  owner?: string;
  updatedAt?: string;
};

const isDealRecord = (value: unknown): value is DealRecord => {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (value as Record<string, unknown>).dealName === "string"
  );
};

const normalizeDealStatus = (value: unknown): DealStatus =>
  dealStatuses.some((status) => status.value === value)
    ? (value as DealStatus)
    : dealStatuses[0].value;

const normalizeOwner = (value: unknown): string => {
  if (typeof value === "string" && ownerOptions.includes(value)) {
    return value;
  }
  return ownerOptions[0];
};

const mapDealRecordToForm = (record: DealRecord): NewDealFormState => ({
  dealName: record.dealName ?? "",
  clientName: record.clientName ?? "",
  amount: record.amount != null ? String(record.amount) : "",
  status: normalizeDealStatus(record.status),
  owner: normalizeOwner(record.owner),
  updatedAt:
    typeof record.updatedAt === "string"
      ? record.updatedAt
      : new Date().toISOString().slice(0, 10),
});

type SortableRowContextValue = {
  attributes: DraggableAttributes;
  listeners?: SyntheticListenerMap;
  setActivatorNodeRef: (element: HTMLElement | null) => void;
  isDragging: boolean;
};

const SortableRowContext = React.createContext<SortableRowContextValue | null>(
  null
);

export type YohakuDashboardDataTableProps<TData, TValue> = {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  showToolbar?: boolean;
  actionLabel?: string;
  getRowId?: (row: TData, index: number) => string;
  facetedFilters?: FacetedFilterConfig[];
  search?: DataTableSearchConfig;
};

export function YohakuDashboardDataTable<
  TData extends Record<string, unknown>,
  TValue
>({
  columns,
  data,
  showToolbar = true,
  actionLabel = "Add Task",
  getRowId,
  facetedFilters,
  search,
}: YohakuDashboardDataTableProps<TData, TValue>) {
  const resolveRowId = React.useCallback(
    (row: TData, index: number) => {
      if (typeof getRowId === "function") {
        return getRowId(row, index);
      }
      const candidate = (row as { id?: string | number })?.id;
      return candidate != null ? String(candidate) : `${index}`;
    },
    [getRowId]
  );
  const [tableData, setTableData] = React.useState<TData[]>(() => data);
  React.useEffect(() => {
    setTableData(data);
  }, [data]);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [isCreateSheetOpen, setIsCreateSheetOpen] = React.useState(false);
  const [newDealForm, setNewDealForm] = React.useState<NewDealFormState>(createInitialDealForm);
  const [editingRowId, setEditingRowId] = React.useState<string | null>(null);

  const resetCreateForm = React.useCallback(() => {
    setNewDealForm(createInitialDealForm);
    setEditingRowId(null);
  }, []);

  const handleAddDeal = React.useCallback(() => {
    resetCreateForm();
    setIsCreateSheetOpen(true);
  }, [resetCreateForm]);

  const handleCreateSheetChange = React.useCallback(
    (open: boolean) => {
      setIsCreateSheetOpen(open);
      if (!open) {
        resetCreateForm();
      }
    },
    [resetCreateForm]
  );

  const handleCreateChange = React.useCallback(
    (field: keyof NewDealFormState, value: string) => {
      setNewDealForm((previous) => ({ ...previous, [field]: value }));
    },
    []
  );

  const handleCreateSubmit = React.useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const createdDeal = {
        id: `DEAL-${Date.now()}`,
        dealName: newDealForm.dealName.trim(),
        clientName: newDealForm.clientName.trim(),
        amount: Number(newDealForm.amount) || 0,
        status: newDealForm.status,
        owner: newDealForm.owner,
        updatedAt: newDealForm.updatedAt,
      } as unknown as TData;
      setTableData((previous) => {
        if (editingRowId) {
          return previous.map((row, index) =>
            resolveRowId(row, index) === editingRowId ? createdDeal : row
          );
        }
        return [...previous, createdDeal];
      });
      setIsCreateSheetOpen(false);
      resetCreateForm();
    },
    [newDealForm, resetCreateForm, editingRowId, resolveRowId]
  );

  const canSubmitDeal =
    newDealForm.dealName.trim().length > 0 &&
    newDealForm.clientName.trim().length > 0 &&
    newDealForm.amount.trim().length > 0;
  const sheetSubmitLabel = editingRowId ? "変更を保存" : "案件を追加";
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 150, tolerance: 5 },
    }),
    useSensor(KeyboardSensor)
  );
  const sortableId = React.useId();

  const dataIds = React.useMemo(
    () => tableData.map((item, index) => resolveRowId(item, index)),
    [tableData, resolveRowId]
  );

  const handleDealNameClick = React.useCallback(
    (row: Row<TData>) => {
      if (!isDealRecord(row.original)) {
        return;
      }
      const rowId = resolveRowId(row.original, row.index);
      setNewDealForm(mapDealRecordToForm(row.original));
      setEditingRowId(rowId);
      setIsCreateSheetOpen(true);
    },
    [resolveRowId]
  );

  const handleDuplicateRow = React.useCallback(
    (row: Row<TData>) => {
      const base = row.original as TData;
      const duplicate = { ...base } as TData;
      (duplicate as Record<string, unknown>).id = `DEAL-${Date.now()}`;
      setTableData((previous) => [...previous, duplicate]);
    },
    []
  );

  const handleDeleteRow = React.useCallback(
    (row: Row<TData>) => {
      setTableData((previous) =>
        previous.filter((item, index) => row.id !== resolveRowId(item, index))
      );
    },
    [resolveRowId]
  );

  const handleDragEnd = React.useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (active?.id && over?.id && active.id !== over.id) {
        setTableData((previous) => {
          const oldIndex = dataIds.indexOf(String(active.id));
          const newIndex = dataIds.indexOf(String(over.id));
          if (oldIndex === -1 || newIndex === -1) {
            return previous;
          }
          return arrayMove(previous, oldIndex, newIndex);
        });
      }
    },
    [dataIds]
  );
  const dragColumn = React.useMemo<ColumnDef<TData, TValue>>(
    () => ({
      id: "drag",
      header: () => null,
      cell: () => (
        <div className="flex w-7 justify-center">
          <DragHandleButton />
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
      size: 28,
      meta: { minWidth: 28 },
    }),
    []
  );

  const selectionColumn = React.useMemo<ColumnDef<TData, TValue>>(
    () => ({
      id: "select",
      header: ({ table }) => (
        <div className="flex w-7 items-center justify-center pr-2 pl-4">
          <YohakuCheckbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label="Select all rows"
          />
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex w-7 items-center justify-center pr-2 pl-4">
          <YohakuCheckbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
      size: 28,
      meta: { align: "center", minWidth: 28 },
    }),
    []
  );

  const actionColumn = React.useMemo<ColumnDef<TData, TValue>>(
    () => ({
      id: "actions",
      header: () => null,
      cell: ({ row }) => (
        <YohakuDropdownMenu>
          <YohakuDropdownMenuTrigger asChild>
            <YohakuButton
              variant="ghost"
              size="icon"
              className="size-8 text-slate-500"
            >
              <MoreVerticalIcon className="size-4" />
              <span className="sr-only">アクションを開く</span>
            </YohakuButton>
          </YohakuDropdownMenuTrigger>
          <YohakuDropdownMenuContent align="end" className="w-44">
            <YohakuDropdownMenuItem
              onSelect={(event) => {
                event.preventDefault();
                handleDealNameClick(row);
              }}
            >
              <PencilIcon className="mr-2 size-4" /> 編集
            </YohakuDropdownMenuItem>
            <YohakuDropdownMenuItem
              onSelect={(event) => {
                event.preventDefault();
                handleDuplicateRow(row);
              }}
            >
              <CopyIcon className="mr-2 size-4" /> 複製
            </YohakuDropdownMenuItem>
            <YohakuDropdownMenuSeparator />
            <YohakuDropdownMenuItem
              className="text-red-600 focus:text-red-600"
              onSelect={(event) => {
                event.preventDefault();
                handleDeleteRow(row);
              }}
            >
              <Trash2Icon className="mr-2 size-4" /> 削除
            </YohakuDropdownMenuItem>
          </YohakuDropdownMenuContent>
        </YohakuDropdownMenu>
      ),
      enableSorting: false,
      enableHiding: false,
      size: 60,
    }),
    [handleDealNameClick, handleDuplicateRow, handleDeleteRow]
  );

  const mergedColumns = React.useMemo(() => {
    return [dragColumn, selectionColumn, ...columns, actionColumn];
  }, [actionColumn, columns, dragColumn, selectionColumn]);

  const table = useReactTable({
    data: tableData,
    columns: mergedColumns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    enableRowSelection: true,
    getRowId: (row, index) => resolveRowId(row as TData, index),
  });

  const fixedWidthColumns = React.useMemo(
    () => new Set(["drag", "select"]),
    []
  );

  const computedMinWidths = React.useMemo(() => {
    const result: Record<string, number> = {};
    const dataset = tableData as Record<string, unknown>[];

    const estimateTextWidth = (text: string, charWidth: number) =>
      [...text].length * charWidth;

    const getMaxCellLength = (columnId: string) => {
      let longest = 0;
      for (const row of dataset) {
        const value = row[columnId];
        if (value == null) continue;
        const text = String(value);
        longest = Math.max(longest, [...text].length);
      }
      return longest;
    };

    const registerColumn = (
      columnId: string,
      layout?: (typeof dashboardColumnLayout)[string]
    ) => {
      if (!layout) {
        return;
      }
      const charWidth = layout.charWidth ?? 14;
      const headerText = layout.label ?? columnId;
      const headerWidth =
        estimateTextWidth(headerText, charWidth) +
        (layout.headerPadding ?? 32) +
        (layout.headerIconWidth ?? 0);
      const cellWidth =
        getMaxCellLength(columnId) * charWidth +
        (layout.cellPadding ?? 32);
      const finalWidth = Math.max(layout.minWidth, headerWidth, cellWidth);
      result[columnId] = Math.ceil(finalWidth);
    };

    const headerPaddingFallback = 32;
    const cellPaddingFallback = 32;
    const charWidthFallback = 12;

    ["drag", "select", "actions"].forEach((columnId) => {
      const layout = dashboardColumnLayout[columnId];
      if (layout) {
        result[columnId] = layout.minWidth;
      }
    });

    columns.forEach((column) => {
      const columnId =
        (column as { id?: string })?.id ??
        (column.accessorKey as string | undefined);
      if (!columnId) return;
      const layout = dashboardColumnLayout[columnId];
      if (!layout) {
        const headerText =
          (typeof column.header === "string" ? column.header : columnId) ?? columnId;
        const headerWidth =
          estimateTextWidth(headerText, charWidthFallback) + headerPaddingFallback;
        const cellWidth =
          getMaxCellLength(columnId) * charWidthFallback + cellPaddingFallback;
        const fallbackMinWidth =
          (column.meta?.minWidth as number | undefined) ?? 0;
        result[columnId] = Math.ceil(
          Math.max(fallbackMinWidth, headerWidth, cellWidth)
        );
        return;
      }
      registerColumn(columnId, layout);
    });

    return result;
  }, [columns, tableData]);

  const defaultColumnWidths = React.useMemo(() => {
    const resolved: Record<string, number> = {};
    let remainingWidth = DASHBOARD_TABLE_MIN_WIDTH;
    let flexColumnId: string | null = null;

    const subtractWidth = (value: number) => {
      remainingWidth = Math.max(remainingWidth - value, 0);
    };

    const registerFixedColumn = (columnId: string) => {
      const width = computedMinWidths[columnId];
      if (!width) return;
      resolved[columnId] = width;
      subtractWidth(width);
    };

    ["drag", "select", "actions"].forEach(registerFixedColumn);

    columns.forEach((column) => {
      const columnId =
        (column as { id?: string })?.id ??
        (column.accessorKey as string | undefined);
      if (!columnId) return;
      const layout = dashboardColumnLayout[columnId];
      if (!layout) {
        registerFixedColumn(columnId);
        return;
      }
      if (layout.flex && flexColumnId === null) {
        flexColumnId = columnId;
        return;
      }
      registerFixedColumn(columnId);
    });

    if (flexColumnId) {
      const base = computedMinWidths[flexColumnId] ?? 0;
      const flexWidth = Math.max(base, remainingWidth);
      resolved[flexColumnId] = flexWidth;
    }

    return resolved;
  }, [columns, computedMinWidths]);

  const handleInlineChange = React.useCallback(
    (rowId: string, columnId: string, value: unknown) => {
      setTableData((previous) =>
        previous.map((row, index) =>
          rowId === resolveRowId(row, index)
            ? ({ ...row, [columnId]: value } as TData)
            : row
        )
      );
    },
    [resolveRowId]
  );

  return (
    <>
      <YohakuSheet open={isCreateSheetOpen} onOpenChange={handleCreateSheetChange}>
        <YohakuSheetContent side="right" className="sm:max-w-xl">
          <YohakuSheetBody>
            <YohakuSheetForm className="text-sm" onSubmit={handleCreateSubmit}>
              <YohakuSheetSection>
                <div className="space-y-4">
                  <div>
                    <span className={sheetFieldLabelClass}>案件名</span>
                    <YohakuInput
                      value={newDealForm.dealName}
                      onChange={(event) => handleCreateChange("dealName", event.target.value)}
                      placeholder="案件名を入力"
                    />
                  </div>
                  <div>
                    <span className={sheetFieldLabelClass}>クライアント</span>
                    <YohakuInput
                      value={newDealForm.clientName}
                      onChange={(event) =>
                        handleCreateChange("clientName", event.target.value)
                      }
                      placeholder="クライアント名を入力"
                    />
                  </div>
                </div>
              </YohakuSheetSection>
              <YohakuSheetSection>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <span className={sheetFieldLabelClass}>金額（円）</span>
                    <YohakuInput
                      type="number"
                      value={newDealForm.amount}
                      onChange={(event) => handleCreateChange("amount", event.target.value)}
                      placeholder="¥0"
                    />
                  </div>
                  <div>
                    <span className={sheetFieldLabelClass}>ステータス</span>
                    <YohakuSelect
                      value={newDealForm.status}
                      onValueChange={(value) =>
                        handleCreateChange("status", value as DealStatus)
                      }
                    >
                      <YohakuSelectTrigger
                        className={cn(
                          pillBaseClass,
                          pillIconHiddenClass,
                          statusStyleMap[newDealForm.status] ?? "border-slate-200 bg-slate-50 text-slate-700",
                          "w-full"
                        )}
                      >
                        <YohakuSelectValue placeholder="ステータス" />
                      </YohakuSelectTrigger>
                      <YohakuSelectContent align="start">
                        {dealStatuses.map((status) => (
                          <YohakuSelectItem key={status.value} value={status.value}>
                            {status.label}
                          </YohakuSelectItem>
                        ))}
                      </YohakuSelectContent>
                    </YohakuSelect>
                  </div>
                  <div>
                    <span className={sheetFieldLabelClass}>担当者</span>
                    <YohakuSelect
                      value={newDealForm.owner}
                      onValueChange={(value) => handleCreateChange("owner", value)}
                    >
                      <YohakuSelectTrigger
                        className={cn(
                          pillBaseClass,
                          pillIconHiddenClass,
                          "border-slate-200 bg-slate-50 text-slate-600 w-full"
                        )}
                      >
                        <YohakuSelectValue placeholder="担当者" />
                      </YohakuSelectTrigger>
                      <YohakuSelectContent align="start">
                        {ownerOptions.map((owner) => (
                          <YohakuSelectItem key={owner} value={owner}>
                            {owner}
                          </YohakuSelectItem>
                        ))}
                      </YohakuSelectContent>
                    </YohakuSelect>
                  </div>
                </div>
              </YohakuSheetSection>
              <YohakuSheetSection>
                <div>
                  <span className={sheetFieldLabelClass}>最終更新日</span>
                  <YohakuDatePickerButton
                    value={newDealForm.updatedAt}
                    onChange={(value) => handleCreateChange("updatedAt", value ?? "")}
                    displayFormat="yyyy/MM/dd"
                    buttonClassName="w-full justify-between"
                    calendarProps={{ captionLayout: "dropdown" }}
                  />
                </div>
              </YohakuSheetSection>
              <YohakuSheetFooter>
                <YohakuSheetClose asChild>
                  <YohakuButton variant="outline">キャンセル</YohakuButton>
                </YohakuSheetClose>
                <YohakuButton type="submit" disabled={!canSubmitDeal}>
                  {sheetSubmitLabel}
                </YohakuButton>
              </YohakuSheetFooter>
            </YohakuSheetForm>
          </YohakuSheetBody>
        </YohakuSheetContent>
      </YohakuSheet>
      <div className="space-y-4">
        {showToolbar ? (
          <DataTableToolbar
            table={table}
            actionLabel={actionLabel}
            onAction={handleAddDeal}
            facetedFilters={facetedFilters}
            search={search}
          />
        ) : null}
      <div className="overflow-x-auto">
        <DndContext
          id={sortableId}
          sensors={sensors}
          collisionDetection={closestCenter}
          modifiers={[restrictToVerticalAxis]}
          onDragEnd={handleDragEnd}
        >
          <YohakuTable
            resizableColumns
            className="min-w-[960px]"
            defaultColumnWidths={defaultColumnWidths}
          >
            <YohakuTableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <YohakuTableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header, headerIndex) => (
                    <YohakuTableHead
                      key={header.id}
                      columnId={header.column.id}
                      disableResize={
                        headerIndex === headerGroup.headers.length - 1 ||
                        fixedWidthColumns.has(header.column.id)
                      }
                      className={cn(
                        "whitespace-nowrap",
                        fixedWidthColumns.has(header.column.id) &&
                          (header.column.id === "drag" ? "px-2" : "px-0")
                      )}
                      minWidth={
                        computedMinWidths[header.column.id] ??
                        (header.column.columnDef.meta?.minWidth as
                          | number
                          | undefined)
                      }
                      maxWidth={
                        header.column.columnDef.meta?.maxWidth as
                          | number
                          | undefined
                      }
                    >
                      {header.isPlaceholder ? null : (
                        <div className="flex w-full items-center justify-between">
                          {header.column.getCanSort() ? (
                            <YohakuDropdownMenu>
                              <YohakuDropdownMenuTrigger asChild>
                            <YohakuButton
                                  variant="ghost"
                                  size="sm"
                                  className="flex items-center gap-2 px-2 text-sm font-semibold text-[var(--color-text)] focus-visible:ring-0 focus-visible:outline-none"
                                >
                                  {(() => {
                                    const sortState = header.column.getIsSorted();
                                    const SortIcon =
                                      sortState === "asc"
                                        ? ArrowUpIcon
                                        : sortState === "desc"
                                          ? ArrowDownIcon
                                          : ChevronsUpDown;
                                    return (
                                      <React.Fragment>
                                        <span>
                                          {flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                          )}
                                        </span>
                                        <SortIcon className="size-4" />
                                      </React.Fragment>
                                    );
                                  })()}
                                  <span className="sr-only">ソートと表示</span>
                                </YohakuButton>
                              </YohakuDropdownMenuTrigger>
                              <YohakuDropdownMenuContent
                                align="start"
                                className="w-40"
                              >
                                <YohakuDropdownMenuItem
                                  onSelect={(event) => {
                                    event.preventDefault();
                                    header.column.clearSorting();
                                    header.column.toggleSorting(false);
                                  }}
                                >
                                  <ArrowUpIcon className="mr-2 size-4" /> 昇順
                                </YohakuDropdownMenuItem>
                                <YohakuDropdownMenuItem
                                  onSelect={(event) => {
                                    event.preventDefault();
                                    header.column.toggleSorting(true);
                                  }}
                                >
                                  <ArrowDownIcon className="mr-2 size-4" /> 降順
                                </YohakuDropdownMenuItem>
                                <YohakuDropdownMenuSeparator />
                                <YohakuDropdownMenuItem
                                  onSelect={(event) => {
                                    event.preventDefault();
                                    header.column.toggleVisibility(false);
                                  }}
                                >
                                  <EyeOffIcon className="mr-2 size-4" /> 非表示
                                </YohakuDropdownMenuItem>
                              </YohakuDropdownMenuContent>
                            </YohakuDropdownMenu>
                          ) : (
                            <span className="text-sm font-semibold text-[var(--color-text)]">
                              {flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                            </span>
                          )}
                        </div>
                      )}
                    </YohakuTableHead>
                  ))}
                </YohakuTableRow>
              ))}
            </YohakuTableHeader>
            <YohakuTableBody>
              {table.getRowModel().rows.length ? (
                <SortableContext
                  items={table.getRowModel().rows.map((row) => row.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {table.getRowModel().rows.map((row) => (
                    <DraggableRow
                      key={row.id}
                      row={row}
                      fixedWidthColumns={fixedWidthColumns}
                      computedMinWidths={computedMinWidths}
                      onDealNameClick={handleDealNameClick}
                      onInlineChange={handleInlineChange}
                    />
                  ))}
                </SortableContext>
              ) : (
                <YohakuTableRow>
                  <YohakuTableCell
                    colSpan={table.getVisibleLeafColumns().length}
                    className="py-10 text-center text-sm text-muted-foreground"
                  >
                    No results.
                  </YohakuTableCell>
                </YohakuTableRow>
              )}
            </YohakuTableBody>
          </YohakuTable>
        </DndContext>
      </div>
      <div className="flex flex-col gap-3 rounded-2xl border border-[var(--color-border)] bg-white/70 p-4 text-sm text-muted-foreground lg:flex-row lg:items-center lg:justify-between">
        <div>
          {table.getFilteredSelectedRowModel().rows.length} /{" "}
          {table.getFilteredRowModel().rows.length} rows selected
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <YohakuSelect
            value={String(table.getState().pagination.pageSize)}
            onValueChange={(value) => table.setPageSize(Number(value))}
          >
            <YohakuSelectTrigger className="h-9 w-28">
              <YohakuSelectValue placeholder="Rows" />
            </YohakuSelectTrigger>
            <YohakuSelectContent>
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <YohakuSelectItem key={pageSize} value={String(pageSize)}>
                  {pageSize} rows
                </YohakuSelectItem>
              ))}
            </YohakuSelectContent>
          </YohakuSelect>
          <div className="font-medium text-[var(--color-text)]">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount() || 1}
          </div>
          <div className="flex items-center gap-2">
            <YohakuButton
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Prev
            </YohakuButton>
            <YohakuButton
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </YohakuButton>
          </div>
        </div>
      </div>
      </div>
    </>
  );
}

type DraggableRowProps<TData> = {
  row: Row<TData>;
  fixedWidthColumns: Set<string>;
  computedMinWidths: Record<string, number>;
  onDealNameClick?: (row: Row<TData>) => void;
  onInlineChange?: (rowId: string, columnId: string, value: unknown) => void;
};

function DraggableRow<TData>({
  row,
  fixedWidthColumns,
  computedMinWidths,
  onDealNameClick,
  onInlineChange,
}: DraggableRowProps<TData>) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: row.id,
  });

  const contextValue = React.useMemo(
    () => ({ attributes, listeners, setActivatorNodeRef, isDragging }),
    [attributes, listeners, setActivatorNodeRef, isDragging]
  );

  return (
    <SortableRowContext.Provider value={contextValue}>
      <YohakuTableRow
        ref={setNodeRef}
        style={{
          transform: CSS.Transform.toString(transform),
          transition: transition ?? undefined,
        }}
        data-state={row.getIsSelected() && "selected"}
        data-dragging={isDragging || undefined}
        className={cn(
          "relative",
          isDragging && "z-10 shadow-lg ring-1 ring-indigo-200"
        )}
      >
        {row.getVisibleCells().map((cell) => {
          const cellId = cell.column.id;
          const isAmountColumn = cellId === "amount";
          const isDealNameColumn = cellId === "dealName" && !!onDealNameClick;
          const isStatusColumn = cellId === "status";
          const isOwnerColumn = cellId === "owner";
          const isNextActionDueColumn = cellId === "nextActionDue";
          const isInvoicePlannedMonthColumn = cellId === "invoicePlannedMonth";
          const isInvoiceDueDateColumn = cellId === "invoiceDueDate";
          const cellContent = flexRender(cell.column.columnDef.cell, cell.getContext());
          const rowId = row.id;

          const getCellStringValue = () => {
            const rawValue = cell.getValue();
            if (typeof rawValue === "string") {
              const trimmed = rawValue.trim();
              return trimmed.length > 0 ? trimmed : undefined;
            }
            return undefined;
          };

            const renderInlineStatus = () => {
              const currentValue = String(cell.getValue() ?? dealStatuses[0].value);
              const triggerClass = cn(
                pillBaseClass,
                pillIconHiddenClass,
                statusStyleMap[currentValue] ?? "border-slate-200 bg-slate-50 text-slate-700",
                "w-fit"
              );
            return (
              <YohakuSelect
                value={currentValue}
                onValueChange={(value) => onInlineChange?.(rowId, cellId, value)}
              >
                <YohakuSelectTrigger className={triggerClass}>
                  <YohakuSelectValue />
                </YohakuSelectTrigger>
                <YohakuSelectContent align="start">
                  {dealStatuses.map((status) => (
                    <YohakuSelectItem key={status.value} value={status.value}>
                      {status.label}
                    </YohakuSelectItem>
                  ))}
                </YohakuSelectContent>
              </YohakuSelect>
            );
          };

            const renderInlineOwner = () => {
              const currentValue = String(cell.getValue() ?? ownerOptions[0]);
              return (
                <YohakuSelect
                  value={currentValue}
                  onValueChange={(value) => onInlineChange?.(rowId, cellId, value)}
                >
                  <YohakuSelectTrigger
                    className={cn(
                      pillBaseClass,
                      pillIconHiddenClass,
                      "border-slate-200 bg-slate-50 text-slate-600",
                      "w-fit"
                    )}
                  >
                    <YohakuSelectValue />
                  </YohakuSelectTrigger>
                  <YohakuSelectContent align="start">
                    {ownerOptions.map((owner) => (
                      <YohakuSelectItem key={owner} value={owner}>
                        {owner}
                      </YohakuSelectItem>
                    ))}
                  </YohakuSelectContent>
                </YohakuSelect>
              );
            };

            const renderInlineDatePicker = () => {
              const currentValue = getCellStringValue();
              return (
                <YohakuDatePickerButton
                  value={currentValue}
                  onChange={(value) => onInlineChange?.(rowId, cellId, value)}
                  displayFormat="yyyy/MM/dd"
                  buttonClassName={pillDateButtonClass}
                  calendarProps={{ captionLayout: "dropdown" }}
                />
              );
            };

            const renderInlineMonthPicker = () => {
              const currentValue = getCellStringValue();
              const options =
                currentValue &&
                !monthPickerOptions.some((option) => option.value === currentValue)
                  ? [
                      {
                        value: currentValue,
                        label: currentValue.replace("-", "/"),
                      },
                      ...monthPickerOptions,
                    ]
                  : monthPickerOptions;
              return (
                <YohakuSelect
                  value={currentValue}
                  onValueChange={(value) => onInlineChange?.(rowId, cellId, value)}
                >
                  <YohakuSelectTrigger className={cn(pillDateButtonClass, "w-fit px-4 py-1")}
                  >
                    <YohakuSelectValue placeholder="未設定" />
                  </YohakuSelectTrigger>
                  <YohakuSelectContent align="start">
                    {options.map((option) => (
                      <YohakuSelectItem key={option.value} value={option.value}>
                        {option.label}
                      </YohakuSelectItem>
                    ))}
                  </YohakuSelectContent>
                </YohakuSelect>
              );
            };

          const clickableContent = isDealNameColumn ? (
            <button
              type="button"
              onClick={() => {
                onDealNameClick?.(row);
              }}
              className="w-full text-left text-sm font-semibold leading-5 text-slate-900 transition hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2"
            >
              {cellContent}
            </button>
          ) : (
            cellContent
          );

          const innerContent = isStatusColumn
            ? renderInlineStatus()
            : isOwnerColumn
              ? renderInlineOwner()
              : isNextActionDueColumn
                ? renderInlineDatePicker()
                : isInvoicePlannedMonthColumn
                  ? renderInlineMonthPicker()
                  : isInvoiceDueDateColumn
                    ? renderInlineDatePicker()
              : clickableContent;

          return (
            <YohakuTableCell
              key={cell.id}
              columnId={cell.column.id}
              className={cn(
                "whitespace-nowrap",
                isAmountColumn ? "pl-2 pr-8" : undefined,
                isDealNameColumn ? "cursor-pointer" : undefined,
                fixedWidthColumns.has(cell.column.id) &&
                  (cell.column.id === "drag" ? "px-2" : "px-0")
              )}
              style={{
                minWidth:
                  computedMinWidths[cell.column.id] ??
                  (cell.column.columnDef.meta?.minWidth as number | undefined) ??
                  undefined,
                maxWidth:
                  (cell.column.columnDef.meta?.maxWidth as number | undefined) ??
                  undefined,
              }}
            >
              {innerContent}
            </YohakuTableCell>
          );
        })}
      </YohakuTableRow>
    </SortableRowContext.Provider>
  );
}

function DragHandleButton() {
  const context = React.useContext(SortableRowContext);

  if (!context) {
    return (
      <span className="flex h-8 w-8 items-center justify-center text-slate-300">
        <GripVerticalIcon className="size-4" />
      </span>
    );
  }

  const { attributes, listeners, setActivatorNodeRef, isDragging } = context;

  return (
    <YohakuButton
      ref={setActivatorNodeRef}
      variant="ghost"
      size="icon"
      className={cn(
        "size-7 text-slate-400 hover:bg-transparent hover:text-primary focus-visible:ring-0 focus-visible:ring-offset-0",
        isDragging && "text-indigo-500"
      )}
      {...attributes}
      {...(listeners ?? {})}
    >
      <GripVerticalIcon className="size-4" />
      <span className="sr-only">行をドラッグ</span>
    </YohakuButton>
  );
}
