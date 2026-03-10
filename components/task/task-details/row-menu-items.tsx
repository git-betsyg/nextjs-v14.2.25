import { type Row } from "@tanstack/react-table"
import Link from "next/link"
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import { type GetTaskDetailsData } from "@/pages/api/subtasks"


import { DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { ContextMenuItem } from "@/components/ui/context-menu"
import router from "next/router"

interface RowMenuItemsProps<TData> {
  row: Row<TData>
  variant: "dropdown" | "context"
}

export function RowMenuItems<TData>({
  row,
  variant,
}: RowMenuItemsProps<TData>) {
  const { tid } = router.query
  const taskDetails = row.original as GetTaskDetailsData


  const MenuItem = variant === "dropdown" ? DropdownMenuItem : ContextMenuItem

  return (
    <>
      <Link href={`/task/${tid}/${taskDetails.id}`}>
        <MenuItem>Details</MenuItem>
      </Link>
    </>
  )
}
