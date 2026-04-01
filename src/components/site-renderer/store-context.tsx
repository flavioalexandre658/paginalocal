"use client";

import { createContext, useContext } from "react";

interface StoreContextValue {
  storeId: string | null;
}

const StoreContext = createContext<StoreContextValue>({ storeId: null });

export function StoreProvider({
  storeId,
  children,
}: {
  storeId: string | null;
  children: React.ReactNode;
}) {
  return (
    <StoreContext.Provider value={{ storeId }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStoreId(): string | null {
  return useContext(StoreContext).storeId;
}
