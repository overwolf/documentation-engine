import React from 'react';
import { Components } from '../../core/open-api';

export const ComponentsContext = React.createContext({});

export function ComponentsContextProvider({
  components,
  children,
}: React.PropsWithChildren<{ components: Components }>) {
  return (
    <ComponentsContext.Provider value={components}>
      {children}
    </ComponentsContext.Provider>
  );
}
