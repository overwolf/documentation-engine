import React, { PropsWithChildren, useContext } from 'react';
import { ParsedSchemaType } from '../../core/schema';
import Schema from '../components/schema';
import { Response } from '../../core/open-api';
import componentFromRef from '../../core/ref';
import { ComponentsContext } from '../contexts/components';

type TableTypes = 'query' | 'response' | 'header' | 'path' | 'body';
const titles: { [type in TableTypes]: string } = {
  body: 'REQUEST BODY',
  header: 'HEADER PARAMS',
  path: 'PATH PARAMS',
  query: 'QUERY PARAMS',
  response: 'RESPONSES',
};

function ParametersTable({
  type,
  children,
}: PropsWithChildren<{
  type: TableTypes;
}>) {
  // ---------------------------------------------------------------------------
  const isResponse = type === 'response';
  return (
    <div className="parameters-table">
      <h4 className="title">{titles[type]}</h4>
      <div className="columns">
        <div className="content">
          <div className="item">
            <div className="field">
              <h4>{isResponse ? 'Status Code' : 'Parameter Name'}</h4>
              <h4>{isResponse ? 'Response Value' : 'Parameter Type'}</h4>
              {!isResponse && <h4>More Details</h4>}
            </div>
          </div>
        </div>
      </div>

      <ul className="content">{children}</ul>
    </div>
  );
}

export function ResponseTableChild({
  name,
  description,
  response,
}: {
  name: string;
  description: string;
  response: Response<any, any>;
}) {
  const components = useContext(ComponentsContext);
  return (
    <Tablechild
      showComment={false}
      name={name}
      description={description}
      required={false}
    >
      <div className="data">
        <div className="response-headers">
          {!!Object.keys(response?.headers ?? {}).length && (
            <ParametersTable type="header">
              {Object.keys(response?.headers ?? {}).map((key) => {
                const header = componentFromRef<'headers'>(
                  response.headers[key],
                  components,
                );
                return (
                  <ParametersTableChild
                    key={key}
                    name={key}
                    description={header.description}
                    required={true}
                    schema={componentFromRef(header.schema, components)}
                  />
                );
              })}
            </ParametersTable>
          )}
        </div>
        <div className="response-data">
          {Object.keys(response?.content ?? {}).map(
            (contentType: keyof typeof response.content) => (
              <>
                <div className="content-type">{contentType}</div>
                <Schema
                  key={contentType}
                  data={componentFromRef<'schemas'>(
                    response.content[contentType].schema,
                    components,
                  )}
                />
              </>
            ),
          )}
        </div>
      </div>
    </Tablechild>
  );
}

export function ParametersTableChild({
  name,
  description,
  required,
  schema,
}: {
  name: string;
  description: string;
  required: boolean;
  schema: ParsedSchemaType;
}) {
  return (
    <Tablechild
      showComment={true}
      name={name}
      description={description}
      required={required}
    >
      <Schema data={schema} />
      <div className="input">
        {/* <input className="text" name={name} type={'text'} /> */}
        <div className="hint">{schema.description}</div>
      </div>
    </Tablechild>
  );
}

function Tablechild({
  name,
  required,
  showComment = true,
  description,
  children,
}: PropsWithChildren<{
  name: string;
  showComment: boolean;
  description: string;
  required: boolean;
}>) {
  return (
    <li className="item">
      {showComment && (
        <div className="comment">
          {'//  '}
          {description}
          {'  //'}
        </div>
      )}
      <div className="field">
        <div className="name">
          {name}
          {!showComment && (
            <>
              {' - '}
              <span className="response-description">{description}</span>
            </>
          )}
          {required && <span className="required">*</span>}
        </div>
        {children}
      </div>
    </li>
  );
}

export default ParametersTable;
