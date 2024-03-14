import React, { PropsWithChildren } from 'react';
import { OpenAPISpec } from '../core/open-api';
import Full from './entry/full';
import { ComponentsContextProvider } from './contexts/components';
import { ServersContextProvider } from './contexts/servers';
import './scss/open-api.scss';

const OpenApiComponent = ({
  data,
  children,
}: PropsWithChildren<{ data: OpenAPISpec<any> }>) => {
  return (
    <section className="open-api">
      <ComponentsContextProvider components={data.components}>
        <ServersContextProvider servers={data.servers}>
          <Full data={data}>{children}</Full>
        </ServersContextProvider>
      </ComponentsContextProvider>
    </section>
  );
};

export default OpenApiComponent;
