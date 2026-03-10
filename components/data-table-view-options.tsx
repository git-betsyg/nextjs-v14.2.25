import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu"
import { type Table, type VisibilityState } from "@tanstack/react-table"
import { Settings2 } from "lucide-react"
import { useEffect } from "react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"

interface DataTableViewOptionsProps<TData> {
  table: Table<TData>
  columnVisibility?: VisibilityState
  onColumnVisibilityChange?: (visibility: VisibilityState) => void
}

export function DataTableViewOptions<TData>({
  table,
  columnVisibility,
  onColumnVisibilityChange,
}: DataTableViewOptionsProps<TData>) {
  const isControlled = columnVisibility !== undefined && onColumnVisibilityChange !== undefined

  // Synchronize controlled columnVisibility to table
  useEffect(() => {
    if (isControlled) {
      table.setColumnVisibility(columnVisibility)
    }
  }, [isControlled, columnVisibility, table])

  const getIsVisible = (columnId: string) => {
    if (isControlled) {
      return columnVisibility[columnId] ?? true
    }
    return table.getColumn(columnId)?.getIsVisible() ?? true
  }

  const handleCheckedChange = (columnId: string, checked: boolean) => {
    if (isControlled) {
      onColumnVisibilityChange({
        ...columnVisibility,
        [columnId]: checked,
      })
    } else {
      table.getColumn(columnId)?.toggleVisibility(checked)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="ml-auto hidden h-8 lg:flex"
        >
          <Settings2 />
          View
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[150px]">
        <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {table
          .getAllColumns()
          .filter(
            (column) =>
              typeof column.accessorFn !== "undefined" && column.getCanHide()
          )
          .map((column) => {
            return (
              <DropdownMenuCheckboxItem
                key={column.id}
                className="capitalize"
                checked={getIsVisible(column.id)}
                onCheckedChange={(value) => handleCheckedChange(column.id, !!value)}
              >
                {column.id}
              </DropdownMenuCheckboxItem>
            )
          })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
