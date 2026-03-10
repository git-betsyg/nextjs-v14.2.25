import { type ReactNode, createContext, useState, useContext, useEffect } from "react";
import { useStore } from "zustand";

import { type PortStore, createPortStore } from "@/stores/port-store";

export type PortStoreApi = ReturnType<typeof createPortStore>;

export const PortStoreContext = createContext<PortStoreApi | undefined>(
  undefined
);

export interface PortStoreProviderProps {
  children: ReactNode;
}

export const PortStoreProvider = ({ children }: PortStoreProviderProps) => {
  const [store] = useState(() => createPortStore());

  // Manually trigger rehydrate after mounting on the client side to avoid SSR hydration mismatch issues.
 useEffect(() => {
    store.persist.rehydrate();
  }, [store]);

  return (
    <PortStoreContext.Provider value={store}>
      {children}
    </PortStoreContext.Provider>
  );
};

export const usePortStore = <T,>(selector: (store: PortStore) => T): T => {
  const portStoreContext = useContext(PortStoreContext);
  if (!portStoreContext) {
    throw new Error(`usePortStore must be used within PortStoreProvider`);
  }

  return useStore(portStoreContext, selector);
};
