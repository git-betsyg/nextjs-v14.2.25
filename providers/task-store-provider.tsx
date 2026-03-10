

import { type ReactNode, createContext, useState, useContext, useEffect } from "react";
import { useStore } from "zustand";

import { type TaskStore, createTaskStore } from "@/stores/task-store";

export type TaskStoreApi = ReturnType<typeof createTaskStore>;

export const TaskStoreContext = createContext<TaskStoreApi | undefined>(
  undefined
);

export interface TaskStoreProviderProps {
  children: ReactNode;
}

export const TaskStoreProvider = ({ children }: TaskStoreProviderProps) => {
  const [store] = useState(() => createTaskStore());

  // Manually trigger rehydrate after mounting on the client side to avoid SSR hydration mismatch issues.
  useEffect(() => {
    store.persist.rehydrate();
  }, [store]);

  return (
    <TaskStoreContext.Provider value={store}>
      {children}
    </TaskStoreContext.Provider>
  );
};

export const useTaskStore = <T,>(selector: (store: TaskStore) => T): T => {
  const taskStoreContext = useContext(TaskStoreContext);
  if (!taskStoreContext) {
    throw new Error(`useTaskStore must be used within TaskStoreProvider`);
  }

  return useStore(taskStoreContext, selector);
};
