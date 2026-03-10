import { useState } from "react"
import { type Row } from "@tanstack/react-table"
import Link from "next/link"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { type GetTaskListData } from "@/pages/api/task"
import { request } from "@/lib/request"

import { DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { ContextMenuItem } from "@/components/ui/context-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

async function deleteTask(taskId: number) {
  return request.delete(`/api/task/${taskId}`)
}

async function executeTask(taskId: number) {
  return request.post(`/api/task/${taskId}/execute`)
}

interface RowMenuItemsProps<TData> {
  row: Row<TData>
  variant: "dropdown" | "context"
}

export function RowMenuItems<TData>({
  row,
  variant,
}: RowMenuItemsProps<TData>) {
  const task = row.original as GetTaskListData
  const isRunning = task.status === "Running"
  const isCreated = task.status === "Created"
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [executeDialogOpen, setExecuteDialogOpen] = useState(false)
  const queryClient = useQueryClient()

  const executeMutation = useMutation({
    mutationFn: () => executeTask(task.taskId),
    onSuccess: () => {
      toast.success("Task execution started")
      queryClient.invalidateQueries({ queryKey: ["task"] })
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to execute task"
      )
    },
  })

  const deleteMutation = useMutation({
    mutationFn: () => deleteTask(task.taskId),
    onSuccess: () => {
      toast.success("Task deleted successfully")
      queryClient.invalidateQueries({ queryKey: ["task"] })
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete task"
      )
    },
  })

  const MenuItem = variant === "dropdown" ? DropdownMenuItem : ContextMenuItem

  return (
    <>
      <Link href={`/task/${task.taskId}`}>
        <MenuItem>Details</MenuItem>
      </Link>
      <MenuItem
        disabled={!isCreated}
        onSelect={(e) => {
          e.preventDefault()
          if (isCreated) setExecuteDialogOpen(true)
        }}
      >
        Start
      </MenuItem>
      <MenuItem
        className="text-destructive focus:text-destructive"
        disabled={isRunning}
        onSelect={(e) => {
          e.preventDefault()
          if (!isRunning) setDeleteDialogOpen(true)
        }}
      >
        Delete
      </MenuItem>

      <AlertDialog open={executeDialogOpen} onOpenChange={setExecuteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Execute</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to execute task &quot;{task.name}&quot;
              immediately?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={executeMutation.isPending}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={executeMutation.isPending}
              onClick={() => executeMutation.mutate()}
            >
              {executeMutation.isPending ? "Starting..." : "Start"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Delete</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete task &quot;{task.name}&quot;? This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteMutation.isPending}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deleteMutation.isPending}
              onClick={() => deleteMutation.mutate()}
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
