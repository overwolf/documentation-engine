import React, { useState } from 'react';

export type TabItemStateType = ReturnType<typeof useState<string>>;

export const TabItemContext = React.createContext<TabItemStateType>(undefined);

export function TabItemContextProvider({
  tabState,
  children,
}: React.PropsWithChildren<{ tabState: TabItemStateType }>) {
  return (
    <TabItemContext.Provider value={tabState}>
      {children}
    </TabItemContext.Provider>
  );
}
