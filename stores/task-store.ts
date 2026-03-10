import { createStore } from "zustand/vanilla";
import { persist, createJSONStorage } from "zustand/middleware";
import type { PaginationState, VisibilityState } from "@tanstack/react-table";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import type { GetTaskListParams } from "@/pages/api/task";
import { DEFAULT_PAGINATION } from "./constants";

export type TaskFilterState = {
  filters: GetTaskListParams;
  pagination: PaginationState;
  columnVisibility: VisibilityState;
};

export type TaskFilterActions = {
  setFilters: (value: Partial<GetTaskListParams> | ((prev: GetTaskListParams) => GetTaskListParams)) => void;
  setPagination: (value: PaginationState | ((prev: PaginationState) => PaginationState)) => void;
  setColumnVisibility: (value: VisibilityState | ((prev: VisibilityState) => VisibilityState)) => void;
  resetFilters: () => void;
};

export type TaskStore = TaskFilterState & TaskFilterActions;

const defaultFilters: GetTaskListParams = {
  keyword: "",
};

export const defaultInitState: TaskFilterState = {
  filters: defaultFilters,
  pagination: DEFAULT_PAGINATION,
  columnVisibility: {},
};

export const createTaskStore = (
  initState: TaskFilterState = defaultInitState
) => {
  return createStore<TaskStore>()(
    persist(
      (set, get) => ({
        ...initState,
        setFilters: (value) => {
          if (typeof value === "function") {
            set({ filters: value(get().filters), pagination: defaultInitState.pagination });
          } else {
            set({ filters: { ...get().filters, ...value }, pagination: defaultInitState.pagination });
          }
        },
        setPagination: (value) => {
          if (typeof value === "function") {
            set({ pagination: value(get().pagination) });
          } else {
            set({ pagination: value });
          }
        },
        setColumnVisibility: (value) => {
          if (typeof value === "function") {
            set({ columnVisibility: value(get().columnVisibility) });
          } else {
            set({ columnVisibility: value });
          }
        },
        resetFilters: () => set(defaultInitState),
      }),
      {
        name: "task-column-visibility",
        storage: createJSONStorage(() => localStorage),
        // Only persist columnVisibility
        partialize: (state) => ({ columnVisibility: state.columnVisibility }),
        // Skip the initial hydration in Next.js to avoid SSR mismatch issues.
        skipHydration: true,
      }
    )
  );
};
