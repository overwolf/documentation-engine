import React, { useContext } from 'react';
import { OpenAPISpec, PathObject, RequestTypes } from '../../core/open-api';
import clsx from 'clsx';
import {
  BodyParametersTableTabRenderer,
  ParametersTableTabRenderer,
  ResponsesTableTabRenderer,
} from '../utils/parameters-table';
import componentFromRef from '../../core/ref';
import { ComponentsContext } from '../contexts/components';
import { ServersContext } from '../contexts/servers';
import Tabs, { TabsVariants } from '../../../../components/tabs/tabs';

function PathRequest<Request extends RequestTypes>({
  path,
  requestType,
  pathObject,
}: {
  path: string;
  requestType: Request;
  pathObject: PathObject<Request, any, any>;
}) {
  const components = useContext(ComponentsContext);
  const servers = useContext(ServersContext) as any;
  const params = pathObject.parameters?.map((param) =>
    componentFromRef(param, components),
  );
  const queryParams = params?.filter((param) => param.in === 'query') ?? [];
  const headerParams = params?.filter((param) => param.in === 'header') ?? [];
  const pathParams = params?.filter((param) => param.in === 'path') ?? [];
  const bodyParams = pathObject?.requestBody?.content ?? {};
  return (
    <article className="path">
      <h3 className="request-info">
        <div className={clsx('request-type', requestType)}>
          {requestType.toUpperCase()}
        </div>
        <div className="request-path">{path}</div>
      </h3>
      <p className="description">{pathObject.description}</p>

      <pre className="path">
        {servers.servers[servers.selected].url}
        {path /* .replace(pathParams => pathValues) */}
        {/* Query params + values */}
      </pre>
      <Tabs
        stretchLabels
        variant={TabsVariants.OPEN_API_PARAMS}
        fillContent
        renderers={[
          ParametersTableTabRenderer({
            type: 'header',
            allowRequired: true,
            hideExamples: false,
            params: headerParams,
          }),
          ParametersTableTabRenderer({
            type: 'path',
            allowRequired: true,
            hideExamples: false,
            params: pathParams,
          }),
          ParametersTableTabRenderer({
            type: 'query',
            allowRequired: true,
            hideExamples: false,
            params: queryParams,
          }),
          BodyParametersTableTabRenderer({
            hideExamples: false,
            content: bodyParams,
          }),
          ResponsesTableTabRenderer({
            responses: pathObject.responses ?? {},
          }),
        ]}
      />
    </article>
  );
}

function Path({
  path,
  pathObject,
}: {
  path: string;
  pathObject: OpenAPISpec<any>['paths'][string];
}) {
  // ---------------------------------------------------------------------------
  return (
    <>
      {Object.keys(pathObject).map((key: RequestTypes) => (
        <PathRequest
          key={key}
          path={path}
          requestType={key}
          pathObject={pathObject[key]}
        />
      ))}
    </>
  );
}

export default Path;
