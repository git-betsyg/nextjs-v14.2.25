import { type Table } from "@tanstack/react-table";
import { X } from "lucide-react";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableViewOptions } from "@/components/data-table-view-options";
import { useTaskStore } from "@/providers/task-store-provider";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const { filters, pagination, setFilters, resetFilters, columnVisibility, setColumnVisibility } = useTaskStore(
    (state) => state,
  );

  const { keyword } = filters;
  const isFiltered = Object.values(filters).some(Boolean);
  
  // Monitor changes to filters and pagination, and reset the checkboxes.
  useEffect(() => {
    table.resetRowSelection();
  }, [filters, pagination, table]);

  const handleReset = () => {
    resetFilters();
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center gap-2">
        <Input
          placeholder="Search..."
          value={keyword}
          onChange={(event) => setFilters({ keyword: event.target.value })}
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {isFiltered && (
          <Button variant="ghost" size="sm" onClick={handleReset}>
            Reset
            <X />
          </Button>
        )}
      </div>
      <div className="flex items-center gap-2">
        <DataTableViewOptions table={table} columnVisibility={columnVisibility} onColumnVisibilityChange={setColumnVisibility} />
      </div>
    </div>
  );
}