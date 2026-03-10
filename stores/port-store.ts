import { createStore } from "zustand/vanilla";
import { persist, createJSONStorage } from "zustand/middleware";
import type { PaginationState, VisibilityState } from "@tanstack/react-table";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import type { GetPortListParams } from "@/pages/api/task/[tid]/[stid]/port";
import { DEFAULT_PAGINATION } from "./constants";

export type PortFilterState = {
  filters: GetPortListParams;
  pagination: PaginationState;
  columnVisibility: VisibilityState;
};

export type PortFilterActions = {
  setFilter: <K extends keyof GetPortListParams>(key: K, value: GetPortListParams[K]) => void;
  setFilters: (filters: Partial<GetPortListParams>) => void;
  setPagination: (value: PaginationState | ((prev: PaginationState) => PaginationState)) => void;
  setColumnVisibility: (value: VisibilityState | ((prev: VisibilityState) => VisibilityState)) => void;
  resetFilters: () => void;
};

export type PortStore = PortFilterState & PortFilterActions;

export const defaultFilters: GetPortListParams = {
  keyword: "",
  productType: "",
};

export const defaultInitState: PortFilterState = {
  filters: defaultFilters,
  pagination: DEFAULT_PAGINATION,
  columnVisibility: {},
};

export const createPortStore = (
  initState: PortFilterState = defaultInitState
) => {
  return createStore<PortStore>()(
    persist(
      (set, get) => ({
        ...initState,
        setFilter: (key, value) =>
          set({
            filters: { ...get().filters, [key]: value },
            pagination: defaultInitState.pagination,
          }),
        setFilters: (filters) =>
          set({
            filters: { ...get().filters, ...filters },
            pagination: defaultInitState.pagination,
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
        resetFilters: () => set(defaultInitState),
      }),
      {
        name: "port-column-visibility",
        storage: createJSONStorage(() => localStorage),
        // Only persist columnVisibility
        partialize: (state) => ({ columnVisibility: state.columnVisibility }),
        // Skip the initial hydration in Next.js to avoid SSR mismatch issues.
        skipHydration: true,
      }
    )
  );
};
