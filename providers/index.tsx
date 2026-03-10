import type { ReactNode } from "react";
import { TaskStoreProvider } from "./task-store-provider";
import { PortStoreProvider } from "./port-store-provider";
import { TaskDetailsStoreProvider } from "./task-details-store-provider";

// Re-export all providers and hooks
export { TaskStoreProvider, useTaskStore } from "./task-store-provider";
export { PortStoreProvider, usePortStore } from "./port-store-provider";
export { TaskDetailsStoreProvider, useTaskDetailsStore } from "./task-details-store-provider";

interface StoreProvidersProps {
  children: ReactNode;
}

/**
 * Combined store providers wrapper
 * Wraps all store providers in a single component for cleaner usage
 */
export const StoreProviders = ({ children }: StoreProvidersProps) => {
  return (
    <TaskStoreProvider>
      <TaskDetailsStoreProvider>
        <PortStoreProvider>
          
              {children}
           
        </PortStoreProvider>
      </TaskDetailsStoreProvider>
    </TaskStoreProvider>
  );
};
