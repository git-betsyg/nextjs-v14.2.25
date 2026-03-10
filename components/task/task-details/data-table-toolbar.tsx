import { useEffect, useCallback, useState } from "react";
import { type Table } from "@tanstack/react-table";
import { X, Download } from "lucide-react";
import { request } from "@/lib/request";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableViewOptions } from "@/components/data-table-view-options";
import { useTaskDetailsStore } from "@/providers/task-details-store-provider";
import { downloadFile } from "@/lib/download";
import { toast } from "sonner";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const { filters, pagination, setFilter, resetFilters, columnVisibility, setColumnVisibility } = useTaskDetailsStore(
    (state) => state,
  );

  const { keyword } = filters;
  const isFiltered = Object.values(filters).some(Boolean);
  const [downloading, setDownloading] = useState(false);

  // Monitor changes to filters and pagination, and reset the checkboxes.
  useEffect(() => {
    table.resetRowSelection();
  }, [filters, pagination, table]);

  const handleReset = () => {
    resetFilters();
  };

  const selectedRows = table.getFilteredSelectedRowModel().rows;

  const handleDownload = useCallback(async () => {
    const subTaskIds = selectedRows.map(
      (row) => (row.original as { id: number }).id
    );

    if (subTaskIds.length === 0) {
      toast.warning("Please select the data you want to download first");
      return;
    }

    setDownloading(true);
    try {
      const response = await request.post(
        "/api/export/subtasks",
        { subTaskIds },
        { responseType: "blob" }
      );
      await downloadFile(response);
    } catch {
      toast.error("Download failed, please try again");
    } finally {
      setDownloading(false);
    }
  }, [selectedRows]);

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 flex-wrap items-center gap-2">
        <Input
          placeholder="Search..."
          value={keyword}
          onChange={(event) => setFilter("keyword", event.target.value)}
          className="h-8 w-[150px] lg:w-[200px]"
        />

        {selectedRows.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            disabled={downloading}
            onClick={handleDownload}
          >
            <Download className="mr-1 h-4 w-4" />
            {downloading ? "Downloading..." : `Download (${selectedRows.length})`}
          </Button>
        )}

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
