import React from 'react';
import { Components, Server } from '../../core/open-api';

export const ServersContext = React.createContext({});

export function ServersContextProvider({
  servers,
  children,
}: React.PropsWithChildren<{ servers: Server[] }>) {
  return (
    <ServersContext.Provider value={{ selected: 0, servers }}>
      {children}
    </ServersContext.Provider>
  );
}
