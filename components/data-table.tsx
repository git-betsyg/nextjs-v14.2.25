import * as React from "react"
import type { CSSProperties } from "react"
import {
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type Column,
  type ColumnDef,
  type ColumnPinningState,
  type SortingState,
  type VisibilityState,
  type PaginationState,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
} from "@/components/ui/context-menu"

import { DataTablePagination } from "@/components/data-table-pagination"
import type { Table as TableInstance, Row } from "@tanstack/react-table"
import { cn } from "@/lib/utils"

// Helper function to get common pinning styles for sticky columns
const getCommonPinningStyles = <TData,>(
  column: Column<TData, unknown>
): CSSProperties => {
  const isPinned = column.getIsPinned()
  const isLastLeftPinnedColumn =
    isPinned === "left" && column.getIsLastColumn("left")
  const isFirstRightPinnedColumn =
    isPinned === "right" && column.getIsFirstColumn("right")

  return {
    boxShadow: isLastLeftPinnedColumn
      ? "-4px 0 4px -4px gray inset"
      : isFirstRightPinnedColumn
        ? "4px 0 4px -4px gray inset"
        : undefined,
    left: isPinned === "left" ? `${column.getStart("left")}px` : undefined,
    right: isPinned === "right" ? `${column.getAfter("right")}px` : undefined,
    position: isPinned ? "sticky" : "relative",
    width: column.getSize(),
    zIndex: isPinned ? 1 : 0,
  }
}

// Extended column meta type for pinning configuration
declare module "@tanstack/react-table" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData, TValue> {
    pinned?: "left" | "right"
  }
}

// Helper function to get initial column pinning state from column definitions
const getInitialColumnPinning = <TData, TValue>(
  columns: ColumnDef<TData, TValue>[]
): ColumnPinningState => {
  const left: string[] = []
  const right: string[] = []

  columns.forEach((column) => {
    const id = column.id || (column as { accessorKey?: string }).accessorKey
    const pinned = column.meta?.pinned
    if (id && pinned === "left") {
      left.push(id)
    } else if (id && pinned === "right") {
      right.push(id)
    }
  })

  return { left, right }
}

// Type for row menu items component
export type RowMenuItemsComponent<TData> = React.ComponentType<{
  row: Row<TData>
  variant: "dropdown" | "context"
}>

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  toolbar?: React.ComponentType<{ table: TableInstance<TData> }>
  // Server-side pagination related props
  pagination?: PaginationState
  onPaginationChange?: (pagination: PaginationState) => void
  total?: number
  isLoading?: boolean
  // Row context menu items component
  rowMenuItems?: RowMenuItemsComponent<TData>
  // Table container height: fixed value (e.g. "500px", "60vh"), or "auto" to fill remaining viewport space
  height?: string | number
  // Bottom offset (px) when height="auto", defaults to 48
  heightBottomOffset?: number
}

export function DataTable<TData, TValue>({
  columns,
  data,
  toolbar: Toolbar,
  pagination: controlledPagination,
  onPaginationChange,
  total,
  isLoading,
  rowMenuItems: RowMenuItems,
  height,
  heightBottomOffset = 48,
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = React.useState({})
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
 
  const [sorting, setSorting] = React.useState<SortingState>([])

  // Auto height: dynamically compute height to fill remaining viewport space
  const containerRef = React.useRef<HTMLDivElement>(null)
  const [autoHeight, setAutoHeight] = React.useState<number | undefined>()
  const isAutoHeight = height === "auto"

  React.useEffect(() => {
    if (!isAutoHeight) return
    const el = containerRef.current
    if (!el) return

    const update = () => {
      const top = el.getBoundingClientRect().top
      setAutoHeight(Math.max(200, window.innerHeight - top - heightBottomOffset))
    }

    update()
    window.addEventListener("resize", update)
    return () => window.removeEventListener("resize", update)
  }, [isAutoHeight, heightBottomOffset])

  const effectiveHeight = isAutoHeight ? autoHeight : height
  const hasHeight = !!effectiveHeight
  const [columnPinning, setColumnPinning] = React.useState<ColumnPinningState>(
    () => getInitialColumnPinning(columns)
  )
  const [internalPagination, setInternalPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

  // Determine whether it is server-side pagination mode.
  const isServerSide = controlledPagination !== undefined && onPaginationChange !== undefined
  const pagination = isServerSide ? controlledPagination : internalPagination

  // Calculate pageCount internally based on total and pageSize
  const pageCount = total !== undefined ? Math.ceil(total / pagination.pageSize) : -1

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnPinning,
      pagination,
    },
    ...(isServerSide
      ? {
        pageCount,
        manualPagination: true,
        onPaginationChange: (updater) => {
          const newPagination = typeof updater === 'function' ? updater(pagination) : updater
          onPaginationChange(newPagination)
        },
      }
      : {
        getPaginationRowModel: getPaginationRowModel(),
        onPaginationChange: setInternalPagination,
      }),
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    onColumnPinningChange: setColumnPinning,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })

  return (
    <div
      ref={containerRef}
      className="flex flex-col gap-4"
      style={hasHeight ? { height: effectiveHeight } : undefined}
    >
      {Toolbar && <Toolbar table={table} />}
      <div className={cn("overflow-auto rounded-md border", hasHeight && "flex-1 min-h-0")}>
          <Table className="table-fixed" wrapperClassName={hasHeight ? "!overflow-visible" : undefined}>
          <TableHeader className={hasHeight ? "sticky top-0 z-10" : undefined}>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="group">
                {headerGroup.headers.map((header) => {
                  const { column } = header
                  return (
                    <TableHead
                      key={header.id}
                      colSpan={header.colSpan}
                      style={getCommonPinningStyles(column)}
                      className={cn(
                        "bg-background group-hover:bg-muted group-data-[state=selected]:bg-muted"
                      )}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className={hasHeight ? "[&_tr:last-child]:border-b" : undefined}>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Loading...
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => {
                const rowContent = (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className="group"
                  >
                    {row.getVisibleCells().map((cell) => {
                      const { column } = cell
                      return (
                        <TableCell
                          key={cell.id}
                          style={getCommonPinningStyles(column)}
                          className={cn(
                            "bg-background group-hover:bg-muted group-data-[state=selected]:bg-muted"
                          )}
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      )
                    })}
                  </TableRow>
                )

                if (RowMenuItems) {
                  return (
                    <ContextMenu key={row.id}>
                      <ContextMenuTrigger asChild>
                        {rowContent}
                      </ContextMenuTrigger>
                      <ContextMenuContent>
                        <RowMenuItems row={row} variant="context" />
                      </ContextMenuContent>
                    </ContextMenu>
                  )
                }

                return rowContent
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} total={total} />
    </div>
  )
}