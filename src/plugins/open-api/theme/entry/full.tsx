import React, { PropsWithChildren } from 'react';
import { OpenAPISpec } from '../../core/open-api';
import Path from '../components/path';

function Full({
  data,
  children,
}: PropsWithChildren<{ data: OpenAPISpec<any> }>) {
  // ---------------------------------------------------------------------------

  return (
    <>
      <div className="info">
        <h1 className="title">{data.info.title} - Specification</h1>
        <p className="description">{children || data.info.description}</p>
      </div>
      <ul className="endpoints">
        {Object.keys(data.paths).map((path: string) => (
          <Path key={path} path={path} pathObject={data.paths[path]} />
        ))}
      </ul>
    </>
  );
}

export default Full;
