import { type Row } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"
import { type ComponentType } from "react"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface MenuItemsProps<TData> {
    row: Row<TData>
    variant: "dropdown" | "context"
}

interface DataTableRowActionsProps<TData> {
    row: Row<TData>
    MenuItems: ComponentType<MenuItemsProps<TData>>
}

export function DataTableRowActions<TData>({
    row,
    MenuItems,
}: DataTableRowActionsProps<TData>) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="data-[state=open]:bg-muted size-8"
                >
                    <MoreHorizontal />
                    <span className="sr-only">Open menu</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[160px]">
                <MenuItems row={row} variant="dropdown" />
            </DropdownMenuContent>
        </DropdownMenu>
    )
}