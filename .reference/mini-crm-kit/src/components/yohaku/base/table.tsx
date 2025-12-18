import * as React from "react";

import {
  Table as ShadcnTable,
  TableBody as ShadcnTableBody,
  TableCaption as ShadcnTableCaption,
  TableCell as ShadcnTableCell,
  TableFooter as ShadcnTableFooter,
  TableHead as ShadcnTableHead,
  TableHeader as ShadcnTableHeader,
  TableRow as ShadcnTableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

type ColumnWidths = Record<string, number>;

type TableResizeContextValue = {
  enabled: boolean;
  columnWidths: ColumnWidths;
  setColumnWidth: (columnId: string, width: number) => void;
};

const TableResizeContext = React.createContext<TableResizeContextValue | null>(null);

const useTableResize = () => React.useContext(TableResizeContext);

export type YohakuTableProps = React.ComponentProps<typeof ShadcnTable> & {
  resizableColumns?: boolean;
  defaultColumnWidths?: ColumnWidths;
  onColumnWidthsChange?: (widths: ColumnWidths) => void;
};

export const YohakuTable = React.forwardRef<HTMLTableElement, YohakuTableProps>(
  (
    { className, resizableColumns = false, defaultColumnWidths, onColumnWidthsChange, ...props },
    ref
  ) => {
    const [columnWidths, setColumnWidths] = React.useState<ColumnWidths>(defaultColumnWidths ?? {});

    const setColumnWidth = React.useCallback(
      (columnId: string, width: number) => {
        setColumnWidths((prev) => {
          if (prev[columnId] === width) return prev;
          const next = { ...prev, [columnId]: width };
          onColumnWidthsChange?.(next);
          return next;
        });
      },
      [onColumnWidthsChange]
    );

    React.useEffect(() => {
      if (defaultColumnWidths) {
        setColumnWidths(defaultColumnWidths);
      }
    }, [defaultColumnWidths]);

    const contextValue = React.useMemo<TableResizeContextValue>(
      () => ({
        enabled: resizableColumns,
        columnWidths,
        setColumnWidth,
      }),
      [resizableColumns, columnWidths, setColumnWidth]
    );

    return (
      <TableResizeContext.Provider value={contextValue}>
        <div className="relative w-full overflow-hidden rounded-3xl border border-slate-100 bg-white/80 shadow-sm">
          <ShadcnTable ref={ref} className={cn("w-full table-fixed text-sm", className)} {...props} />
        </div>
      </TableResizeContext.Provider>
    );
  }
);
YohakuTable.displayName = "YohakuTable";

export const YohakuTableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.ComponentProps<typeof ShadcnTableHeader>
>(({ className, ...props }, ref) => (
  <ShadcnTableHeader
    ref={ref}
    className={cn("bg-slate-50 text-xs uppercase tracking-widest text-slate-500", className)}
    {...props}
  />
));
YohakuTableHeader.displayName = "YohakuTableHeader";

export const YohakuTableBody = ShadcnTableBody;
export const YohakuTableFooter = ShadcnTableFooter;

export const YohakuTableRow = React.forwardRef<
  HTMLTableRowElement,
  React.ComponentProps<typeof ShadcnTableRow>
>(({ className, ...props }, ref) => (
  <ShadcnTableRow
    ref={ref}
    className={cn(
      "border-b border-slate-100 last:border-0 hover:bg-slate-50 data-[state=selected]:bg-indigo-50",
      className
    )}
    {...props}
  />
));
YohakuTableRow.displayName = "YohakuTableRow";

type ColumnSizingProps = {
  columnId?: string;
  minWidth?: number;
  maxWidth?: number;
  disableResize?: boolean;
};

const useColumnWidth = (columnId?: string) => {
  const context = useTableResize();
  if (!context || !columnId) {
    return { width: undefined, setWidth: undefined, enabled: false };
  }
  return {
    width: context.columnWidths[columnId],
    setWidth: context.setColumnWidth,
    enabled: context.enabled,
  };
};

export const YohakuTableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ComponentProps<typeof ShadcnTableHead> & ColumnSizingProps
>(({ className, columnId, minWidth = 64, maxWidth, children, style, disableResize, ...props }, ref) => {
  const thRef = React.useRef<HTMLTableCellElement>(null);
  React.useImperativeHandle(ref, () => thRef.current as HTMLTableCellElement);
  const { width, setWidth, enabled } = useColumnWidth(columnId);

  const handlePointerDown = (event: React.PointerEvent) => {
    if (!enabled || !columnId || !setWidth) return;
    event.preventDefault();
    const startX = event.clientX;
    const startWidth = width ?? thRef.current?.getBoundingClientRect().width ?? minWidth;

    const onPointerMove = (moveEvent: PointerEvent) => {
      const delta = moveEvent.clientX - startX;
      let nextWidth = Math.max(minWidth, startWidth + delta);
      if (maxWidth) {
        nextWidth = Math.min(maxWidth, nextWidth);
      }
      setWidth(columnId, Math.round(nextWidth));
    };

    const onPointerUp = () => {
      document.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerup", onPointerUp);
    };

    document.addEventListener("pointermove", onPointerMove);
    document.addEventListener("pointerup", onPointerUp);
  };

  const showHandle = enabled && columnId && !disableResize;

  return (
    <ShadcnTableHead
      ref={thRef}
      style={{ width, minWidth, maxWidth, ...style }}
      className={cn("px-2 py-2 font-medium text-slate-500", className)}
      {...props}
    >
      <div className="flex items-center gap-2">
        <div className="flex-1 truncate">{children}</div>
        {showHandle ? (
          <button
            type="button"
            aria-label="列の幅を調整"
            className="relative h-6 w-3 cursor-col-resize select-none rounded-md border border-transparent focus-visible:border-slate-300 focus-visible:outline-none"
            onPointerDown={handlePointerDown}
          >
            <span className="pointer-events-none absolute left-1/2 top-1/2 block h-4 w-px -translate-x-1/2 -translate-y-1/2 bg-slate-300" />
          </button>
        ) : null}
      </div>
    </ShadcnTableHead>
  );
});
YohakuTableHead.displayName = "YohakuTableHead";

export const YohakuTableCell = React.forwardRef<
  HTMLTableCellElement,
  React.ComponentProps<typeof ShadcnTableCell> & Pick<ColumnSizingProps, "columnId">
>(({ className, columnId, style, ...props }, ref) => {
  const { width } = useColumnWidth(columnId);
  return (
    <ShadcnTableCell
      ref={ref}
      style={{ width, ...style }}
      className={cn("px-4 py-2 text-slate-600", className)}
      {...props}
    />
  );
});
YohakuTableCell.displayName = "YohakuTableCell";

export const YohakuTableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.ComponentProps<typeof ShadcnTableCaption>
>(({ className, ...props }, ref) => (
  <ShadcnTableCaption
    ref={ref}
    className={cn("px-4 pb-4 text-left text-xs text-slate-400", className)}
    {...props}
  />
));
YohakuTableCaption.displayName = "YohakuTableCaption";
