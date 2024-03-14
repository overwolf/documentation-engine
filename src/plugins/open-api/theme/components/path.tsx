import React, { useContext } from 'react';
import {
  OpenAPISpec,
  PathObject,
  RequestTypes,
  Response,
} from '../../core/open-api';
import clsx from 'clsx';
import ParametersTable, {
  ParametersTableChild,
  ResponseTableChild,
} from '../utils/parameters-table';
import componentFromRef from '../../core/ref';
import { ComponentsContext } from '../contexts/components';
import Schema from './schema';
import { ServersContext } from '../contexts/servers';

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
  const queryParams = params?.filter((param) => param.in === 'query');
  const headerParams = params?.filter((param) => param.in === 'header');
  const pathParams = params?.filter((param) => param.in === 'path');
  const bodyParams = pathObject?.requestBody?.content ?? {};
  return (
    <li className="path">
      <h3 className="request-info">
        <div className={clsx('request-type', requestType)}>
          {requestType.toUpperCase()}
        </div>
        <div className="request-path">{path}</div>
      </h3>
      <p className="description">{pathObject.description}</p>

      <pre className="path">
        {servers.servers[servers.selected].url}
        {path}
      </pre>

      {!!headerParams?.length && (
        <ParametersTable type="header">
          {headerParams.map((param) => (
            <ParametersTableChild
              key={param.name}
              name={param.name}
              description={param.description}
              required={param.required}
              schema={componentFromRef(param.schema, components)}
            />
          ))}
        </ParametersTable>
      )}
      {!!pathParams?.length && (
        <ParametersTable type="path">
          {pathParams.map((param) => (
            <ParametersTableChild
              key={param.name}
              name={param.name}
              description={param.description}
              required={param.required}
              schema={componentFromRef(param.schema, components)}
            />
          ))}
        </ParametersTable>
      )}
      {!!queryParams?.length && (
        <ParametersTable type="query">
          {queryParams.map((param) => (
            <ParametersTableChild
              key={param.name}
              name={param.name}
              description={param.description}
              required={param.required}
              schema={componentFromRef(param.schema, components)}
            />
          ))}
        </ParametersTable>
      )}
      {!!bodyParams && (
        <div className="body">
          {Object.keys(bodyParams).map((contentType) => {
            const schema = componentFromRef<'schemas'>(
              bodyParams[contentType].schema,
              components,
            );
            return (
              <div key={contentType} className="parameters-table">
                <h4 className="title">REQUEST BODY</h4>

                <div className="content">
                  <div className="item">
                    <div className="field">
                      <div className="data">
                        <div className="response-data">
                          <div className="content-type">{contentType}</div>
                          <Schema data={schema} />
                          {/* <ParametersTable type="body">
                  {scheme.type === 'object' && scheme.properties}
                  <div className="content-type">{contentType}</div>
                  <ParametersTableChild
                    key={contentType}
                    name={param.name}
                    description={param.description}
                    required={param.required}
                    schema={componentFromRef(param.schema, components)} />
                  <Schema
                    key={contentType}
                    data= />
                </ParametersTable> */}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      <div className="response">
        <ParametersTable type="response">
          {Object.keys(pathObject.responses).map((code) => {
            const response = componentFromRef<'responses'>(
              pathObject.responses[code],
              components,
            );
            return (
              <ResponseTableChild
                key={code}
                name={code}
                description={response.description}
                response={response}
              />
            );
          })}
        </ParametersTable>
      </div>
    </li>
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
