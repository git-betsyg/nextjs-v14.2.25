import { type ColumnDef } from "@tanstack/react-table"
import { type GetTaskDetailsData } from "@/pages/api/subtasks"
import { Checkbox } from "@/components/ui/checkbox"
import { DataTableColumnHeader } from "@/components/data-table-column-header"
import { DataTableRowActions } from "@/components/data-table-row-actions"
import { RowMenuItems } from "./row-menu-items"
import { Badge } from "@/components/ui/badge"

const statusStyles: Record<string, string> = {
  Done: "bg-green-500 text-white hover:bg-green-500/80",
  Running: "bg-blue-500 text-white hover:bg-blue-500/80",
  Failed: "bg-red-500 text-white hover:bg-red-500/80",
  Created: "bg-gray-500 text-white hover:bg-gray-500/80",
}

export const columns: ColumnDef<GetTaskDetailsData>[] = [
  {
    id: "select",
    size: 50,
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),

    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
    meta: { pinned: "left" },
  },
  
  {
    accessorKey: "taskId",
    size: 80,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Task ID" />
    ),
    cell: ({ row }) => row.getValue("taskId"),
    enableSorting: false,
    meta: { pinned: "left" },
  },
 
  {
    accessorKey: "triggerTime",
    size: 160,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Trigger Time" />
    ),
    cell: ({ row }) => {
      const value = row.getValue("triggerTime") as string;
      return value ? new Date(value).toLocaleString() : "-";
    },
    enableSorting: false,
  },
  {
    accessorKey: "startTime",
    size: 160,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Start Time" />
    ),
    cell: ({ row }) => {
      const value = row.getValue("startTime") as string;
      return value ? new Date(value).toLocaleString() : "-";
    },
    enableSorting: false,
  },
  {
    accessorKey: "endTime",
    size: 160,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="End Time" />
    ),
    cell: ({ row }) => {
      const value = row.getValue("endTime") as string;
      return value ? new Date(value).toLocaleString() : "-";
    },
    enableSorting: false,
  },
  {
    accessorKey: "result",
    size: 200,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Result" />
    ),
    cell: ({ row }) => row.getValue("result") ?? "-",
    enableSorting: false,
  },
  {
    accessorKey: "errorMessage",
    size: 200,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Error Message" />
    ),
    cell: ({ row }) => row.getValue("errorMessage") ?? "-",
    enableSorting: false,
  },
  {
    accessorKey: "createdAt",
    size: 160,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created At" />
    ),
    cell: ({ row }) => {
      const value = row.getValue("createdAt") as string;
      return value ? new Date(value).toLocaleString() : "-";
    },
    enableSorting: false,
  },
  {
    accessorKey: "status",
    size: 100,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge className={statusStyles[status] ?? "bg-gray-500 text-white"}>
          {status}
        </Badge>
      );
    },
    enableSorting: false,
  },

  {
    id: "actions",
    size: 80,
    cell: ({ row }) => <DataTableRowActions row={row} MenuItems={RowMenuItems} />,
    meta: { pinned: "right" },
  },
]
