import { type ReactNode, createContext, useState, useContext, useEffect } from "react";
import { useStore } from "zustand";

import { type TaskDetailsStore, createTaskDetailsStore } from "@/stores/task-details-store";

export type TaskDetailsStoreApi = ReturnType<typeof createTaskDetailsStore>;

export const TaskDetailsStoreContext = createContext<TaskDetailsStoreApi | undefined>(
  undefined
);

export interface TaskDetailsStoreProviderProps {
  children: ReactNode;
}

export const TaskDetailsStoreProvider = ({ children }: TaskDetailsStoreProviderProps) => {
  const [store] = useState(() => createTaskDetailsStore());

  // Manually trigger rehydrate after mounting on the client side to avoid SSR hydration mismatch issues.
  useEffect(() => {
    store.persist.rehydrate();
  }, [store]);

  return (
    <TaskDetailsStoreContext.Provider value={store}>
      {children}
    </TaskDetailsStoreContext.Provider>
  );
};

export const useTaskDetailsStore = <T,>(selector: (store: TaskDetailsStore) => T): T => {
  const taskDetailsStoreContext = useContext(TaskDetailsStoreContext);
  if (!taskDetailsStoreContext) {
    throw new Error(`useTaskDetailsStore must be used within TaskDetailsStoreProvider`);
  }

  return useStore(taskDetailsStoreContext, selector);
};
