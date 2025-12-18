"use client";

import * as React from "react";
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
import {
  YohakuPopover,
  YohakuPopoverContent,
  YohakuPopoverTrigger,
} from "@/components/yohaku/base/popover";
import { YohakuCalendar } from "@/components/yohaku/base/calendar";
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
import { DataTableToolbar } from "@/components/yohaku/dashboard/data-table-toolbar";
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
import type { DashboardTask, TaskPriority } from "@/components/dashboard/columns";
import {
  categoryOptions,
  reviewerOptions,
  statusStyleMap,
  priorityStyleMap,
  pillBaseClass,
  pillIconHiddenClass,
  sheetFieldLabelClass,
} from "@/components/dashboard/columns";
import {
  dashboardPriorities,
  dashboardStatuses,
} from "@/components/yohaku/dashboard/data/task-filters";

type NewTaskFormState = Omit<DashboardTask, "id">;

const createInitialTaskForm = (): NewTaskFormState => ({
  header: "",
  type: categoryOptions[0]?.value ?? "",
  status: dashboardStatuses[0]?.value ?? "",
  target: "",
  limit: new Date().toISOString().slice(0, 10),
  reviewer: reviewerOptions[0] ?? "",
  priority: (dashboardPriorities[2]?.value as TaskPriority) ?? "medium",
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
  const [newTaskForm, setNewTaskForm] = React.useState<NewTaskFormState>(createInitialTaskForm);

  const resetCreateForm = React.useCallback(() => {
    setNewTaskForm(createInitialTaskForm);
  }, []);

  const handleAddTask = React.useCallback(() => {
    setIsCreateSheetOpen(true);
  }, []);

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
    (field: keyof NewTaskFormState, value: string) => {
      setNewTaskForm((previous) => ({ ...previous, [field]: value }));
    },
    []
  );

  const handleCreateSubmit = React.useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const createdTask = {
        id: Date.now(),
        ...newTaskForm,
      } as unknown as TData;
      setTableData((previous) => [...previous, createdTask]);
      setIsCreateSheetOpen(false);
      resetCreateForm();
    },
    [newTaskForm, resetCreateForm]
  );

  const canSubmitNewTask = newTaskForm.header.trim().length > 0;
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
            <YohakuDropdownMenuItem>
              <PencilIcon className="mr-2 size-4" /> 編集
            </YohakuDropdownMenuItem>
            <YohakuDropdownMenuItem>
              <CopyIcon className="mr-2 size-4" /> 複製
            </YohakuDropdownMenuItem>
            <YohakuDropdownMenuItem>
              <StarIcon className="mr-2 size-4" /> お気に入り
            </YohakuDropdownMenuItem>
            <YohakuDropdownMenuSeparator />
            <YohakuDropdownMenuItem className="text-red-600 focus:text-red-600">
              <Trash2Icon className="mr-2 size-4" /> 削除
            </YohakuDropdownMenuItem>
          </YohakuDropdownMenuContent>
        </YohakuDropdownMenu>
      ),
      enableSorting: false,
      enableHiding: false,
      size: 60,
    }),
    []
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
      text.length * charWidth;

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

      let longestContentLength = 0;
      for (const row of dataset) {
        const value = row[columnId];
        if (value == null) continue;
        const text = typeof value === "string" ? value : String(value);
        longestContentLength = Math.max(longestContentLength, text.length);
      }

      const cellWidth =
        longestContentLength * charWidth + (layout.cellPadding ?? 32);

      const finalWidth = Math.max(layout.minWidth, headerWidth, cellWidth);
      result[columnId] = Math.ceil(finalWidth);
    };

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
        const fallback =
          (column.columnDef.meta?.minWidth as number | undefined) ??
          (typeof column.columnDef.header === "string"
            ? (column.columnDef.header as string).length * 12 + 32
            : 120);
        result[columnId] = fallback;
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

  return (
    <>
      <YohakuSheet open={isCreateSheetOpen} onOpenChange={handleCreateSheetChange}>
        <YohakuSheetContent side="right" className="sm:max-w-xl">
          <YohakuSheetBody>
            <YohakuSheetForm className="text-sm" onSubmit={handleCreateSubmit}>
              <YohakuSheetSection>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2 sm:col-span-2">
                    <span className={sheetFieldLabelClass}>タスク名</span>
                    <textarea
                      value={newTaskForm.header}
                      onChange={(event) => handleCreateChange("header", event.target.value)}
                      rows={3}
                      className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-800 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                      placeholder="タスク名を入力"
                    />
                  </div>
                  <div className="space-y-2">
                    <span className={sheetFieldLabelClass}>ステータス</span>
                    <YohakuSelect
                      value={newTaskForm.status}
                      onValueChange={(value) => handleCreateChange("status", value)}
                    >
                      <YohakuSelectTrigger
                        className={cn(
                          pillBaseClass,
                          pillIconHiddenClass,
                          "w-full justify-start sm:max-w-xs",
                          statusStyleMap[newTaskForm.status] ??
                            "bg-slate-50 text-slate-700 border-slate-200"
                        )}
                      >
                        <YohakuSelectValue placeholder="ステータス" />
                      </YohakuSelectTrigger>
                      <YohakuSelectContent align="start">
                        {dashboardStatuses.map((status) => (
                          <YohakuSelectItem key={status.value} value={status.value}>
                            {status.label}
                          </YohakuSelectItem>
                        ))}
                      </YohakuSelectContent>
                    </YohakuSelect>
                  </div>
                  <div className="space-y-2">
                    <span className={sheetFieldLabelClass}>カテゴリ</span>
                    <YohakuSelect
                      value={newTaskForm.type}
                      onValueChange={(value) => handleCreateChange("type", value)}
                    >
                      <YohakuSelectTrigger
                        className={cn(
                          pillBaseClass,
                          pillIconHiddenClass,
                          "w-full justify-start bg-white text-slate-700 border-slate-200 sm:max-w-xs"
                        )}
                      >
                        <YohakuSelectValue placeholder="カテゴリ" />
                      </YohakuSelectTrigger>
                      <YohakuSelectContent align="start">
                        {categoryOptions.map((option) => (
                          <YohakuSelectItem key={option.value} value={option.value}>
                            {option.label}
                          </YohakuSelectItem>
                        ))}
                      </YohakuSelectContent>
                    </YohakuSelect>
                  </div>
                </div>
              </YohakuSheetSection>
              <YohakuSheetSection>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <span className={sheetFieldLabelClass}>目標</span>
                    <YohakuInput
                      value={newTaskForm.target}
                      inputMode="numeric"
                      onChange={(event) => handleCreateChange("target", event.target.value)}
                      placeholder="数値を入力"
                    />
                  </div>
                <div className="space-y-2">
                  <span className={sheetFieldLabelClass}>締切</span>
                  <YohakuDatePickerButton
                    value={newTaskForm.limit}
                    onChange={(value) => handleCreateChange("limit", value)}
                    displayFormat="yy/MM/dd"
                    buttonClassName="w-full justify-between"
                    calendarProps={{ captionLayout: "dropdown", fromYear: 2020, toYear: 2030 }}
                  />
                </div>
                </div>
              </YohakuSheetSection>
              <YohakuSheetSection>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <span className={sheetFieldLabelClass}>優先度</span>
                    <YohakuSelect
                      value={newTaskForm.priority}
                      onValueChange={(value) => handleCreateChange("priority", value)}
                    >
                      <YohakuSelectTrigger
                        className={cn(
                          pillBaseClass,
                          pillIconHiddenClass,
                          "w-full justify-start sm:max-w-xs",
                          priorityStyleMap[newTaskForm.priority]
                        )}
                      >
                        <YohakuSelectValue placeholder="優先度" />
                      </YohakuSelectTrigger>
                      <YohakuSelectContent align="start">
                        {dashboardPriorities.map((option) => (
                          <YohakuSelectItem key={option.value} value={option.value as TaskPriority}>
                            {option.label}
                          </YohakuSelectItem>
                        ))}
                      </YohakuSelectContent>
                    </YohakuSelect>
                  </div>
                  <div className="space-y-2">
                    <span className={sheetFieldLabelClass}>担当者</span>
                    <YohakuSelect
                      value={newTaskForm.reviewer}
                      onValueChange={(value) => handleCreateChange("reviewer", value)}
                    >
                      <YohakuSelectTrigger
                        className={cn(
                          pillBaseClass,
                          pillIconHiddenClass,
                          "w-full justify-start bg-white text-slate-700 border-slate-200 sm:max-w-xs"
                        )}
                      >
                        <YohakuSelectValue placeholder="担当者" />
                      </YohakuSelectTrigger>
                      <YohakuSelectContent align="start">
                        {reviewerOptions.map((reviewer) => (
                          <YohakuSelectItem key={reviewer} value={reviewer}>
                            {reviewer}
                          </YohakuSelectItem>
                        ))}
                      </YohakuSelectContent>
                    </YohakuSelect>
                  </div>
                </div>
              </YohakuSheetSection>
              <YohakuSheetFooter>
                <YohakuSheetClose asChild>
                  <YohakuButton variant="outline">キャンセル</YohakuButton>
                </YohakuSheetClose>
                <YohakuButton type="submit" disabled={!canSubmitNewTask}>
                  タスクを追加
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
            onAction={handleAddTask}
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
                                  className="flex items-center gap-2 px-2 text-sm font-semibold text-[var(--color-text)]"
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
};

function DraggableRow<TData>({
  row,
  fixedWidthColumns,
  computedMinWidths,
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
        {row.getVisibleCells().map((cell) => (
          <YohakuTableCell
            key={cell.id}
            columnId={cell.column.id}
            className={cn(
              "whitespace-nowrap",
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
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </YohakuTableCell>
        ))}
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
