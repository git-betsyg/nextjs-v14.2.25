import { type ColumnDef } from "@tanstack/react-table"
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import { type GetTaskListData } from "@/pages/api/task"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { DataTableColumnHeader } from "@/components/data-table-column-header"
import { DataTableRowActions } from "@/components/data-table-row-actions"
import { RowMenuItems } from "./row-menu-items"

const statusStyles: Record<string, string> = {
  Done: "bg-green-500 text-white hover:bg-green-500/80",
  Running: "bg-blue-500 text-white hover:bg-blue-500/80",
  Failed: "bg-red-500 text-white hover:bg-red-500/80",
  Created: "bg-gray-500 text-white hover:bg-gray-500/80",
}

export const columns: ColumnDef<GetTaskListData>[] = [
  {
    id: "select",
    size: 50,
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
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
    accessorKey: "name",
    size: 150,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Task" />
    ),
    cell: ({ row }) => row.getValue("name"),
    enableSorting: false,
    meta: { pinned: "left" },
  },
  {
    accessorKey: "sld",
    size: 80,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="SLD" />
    ),
    cell: ({ row }) => row.getValue("sld"),
    enableSorting: false,
  },
  {
    accessorKey: "subDomainsHistory",
    size: 180,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="SubDomains" />
    ),
    cell: ({ row }) =>
      `${row.original.subDomainsNow} / ${row.original.subDomainsHistory}`,
    enableSorting: false,
  },

  {
    accessorKey: "ipsHistory",
    size: 100,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="IPs" />
    ),
    cell: ({ row }) => `${row.original.ipsNow} / ${row.original.ipsHistory}`,
    enableSorting: false,
  },
  {
    accessorKey: "taskType",
    size: 100,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Task Type" />
    ),
    cell: ({ row }) => row.getValue("taskType"),
    enableSorting: false,
  },
  {
    accessorKey: "scans",
    size: 80,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Scans" />
    ),
    cell: ({ row }) => row.getValue("scans"),
    enableSorting: false,
  },
  {
    accessorKey: "lastScan",
    size: 220,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Last Scan" />
    ),
    cell: ({ row }) => row.getValue("lastScan"),
    enableSorting: false,
  },
  {
    accessorKey: "nexExection",
    size: 180,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Next Execution" />
    ),
    cell: ({ row }) => row.getValue("nexExection"),
    enableSorting: false,
  },
  {
    accessorKey: "createdAt",
    size: 220,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created At" />
    ),
    cell: ({ row }) => row.getValue("createdAt"),
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
      if (!status) return null;
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
    cell: ({ row }) => (
      <DataTableRowActions row={row} MenuItems={RowMenuItems} />
    ),
    meta: { pinned: "right" },
  },
];