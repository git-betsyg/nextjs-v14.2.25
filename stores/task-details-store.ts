import { createStore } from "zustand/vanilla";
import { persist, createJSONStorage } from "zustand/middleware";
import type { PaginationState, VisibilityState } from "@tanstack/react-table";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import type { GetTaskDetailsParams } from "@/pages/api/subtasks";
import { DEFAULT_PAGINATION } from "./constants";

export type TaskDetailsFilterState = {
  filters: GetTaskDetailsParams;
  pagination: PaginationState;
  columnVisibility: VisibilityState;
};

export type TaskDetailsFilterActions = {
  setFilter: <K extends keyof GetTaskDetailsParams>(key: K, value: GetTaskDetailsParams[K]) => void;
  setFilters: (filters: Partial<GetTaskDetailsParams>) => void;
  setPagination: (value: PaginationState | ((prev: PaginationState) => PaginationState)) => void;
  setColumnVisibility: (value: VisibilityState | ((prev: VisibilityState) => VisibilityState)) => void;
  resetFilters: () => void;
};

export type TaskDetailsStore = TaskDetailsFilterState & TaskDetailsFilterActions;

export const defaultTaskDetailsFilters: GetTaskDetailsParams = {
  keyword: "",
};

export const defaultTaskDetailsInitState: TaskDetailsFilterState = {
  filters: defaultTaskDetailsFilters,
  pagination: DEFAULT_PAGINATION,
  columnVisibility: {},
};

export const createTaskDetailsStore = (
  initState: TaskDetailsFilterState = defaultTaskDetailsInitState
) => {
  return createStore<TaskDetailsStore>()(
    persist(
      (set, get) => ({
        ...initState,
        setFilter: (key, value) =>
          set({
            filters: { ...get().filters, [key]: value },
            pagination: defaultTaskDetailsInitState.pagination,
          }),
        setFilters: (filters) =>
          set({
            filters: { ...get().filters, ...filters },
            pagination: defaultTaskDetailsInitState.pagination,
          }),
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
        resetFilters: () => set(defaultTaskDetailsInitState),
      }),
      {
        name: "task-details-column-visibility",
        storage: createJSONStorage(() => localStorage),
        // Only persist columnVisibility
        partialize: (state) => ({ columnVisibility: state.columnVisibility }),
        // Skip the initial hydration in Next.js to avoid SSR mismatch issues.
        skipHydration: true,
      }
    )
  );
};
