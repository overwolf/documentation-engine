/* eslint-disable @docusaurus/no-untranslated-text */
import React, { PropsWithChildren, useContext } from 'react';
import { ParsedSchemaType } from '../../core/schema';
import Schema from '../components/schema';
import {
  Content,
  ParameterType,
  Response,
  Responses,
} from '../../core/open-api';
import componentFromRef from '../../core/ref';
import { ComponentsContext } from '../contexts/components';
import TableHeader from '../../../../components/table/table-header';
import Table from '../../../../components/table/table';
import TableCell from '../../../../components/table/table-cell';
import TableSubCell from '../../../../components/table/table-sub-cell';
import Tabs, { TabsVariants } from '../../../../components/tabs/tabs';
import {
  TabItemLabelVariants,
  TabItemRenderers,
} from '../../../../components/tabs/tab-item';
import { GridTemplate } from '../../../../utils/renderer/grid/style';

type TableTypes = 'query' | 'response' | 'header' | 'path' | 'body';
const titles: { [type in TableTypes]: string } = {
  body: 'BODY',
  header: 'HEADER',
  path: 'PATH',
  query: 'QUERY',
  response: 'RESPONSES',
};

const FIRST_CONTENT_ROW = 2;
const paramsCount = 'params-count';
const paramsLabel = 'params-label';

function ParametersTable({
  type,
  hideExamples,
  children,
}: PropsWithChildren<{ type: TableTypes; hideExamples: boolean }>) {
  const isResponse = type === 'response';

  return (
    <Table
      style={GridTemplate({ columnCount: hideExamples && !isResponse ? 2 : 3 })}
    >
      <>
        <TableHeader x={1} y={1}>
          {isResponse ? 'Status Code' : 'Parameter Name'}
        </TableHeader>
        <TableHeader x={2} xSize={isResponse ? 2 : 1} y={1}>
          {isResponse ? 'Response Value' : 'Parameter Type'}
        </TableHeader>
        {!hideExamples && !isResponse && (
          <TableHeader x={3} y={1}>
            {isResponse ? '' : 'More Details'}
          </TableHeader>
        )}
      </>
      <>{children}</>
    </Table>
  );
}

type TableChildProps = {
  index: number;
  name: string;
  description: string;
  required: boolean;
};

function TableChild({
  name,
  description,
  required,
  index,
  children,
}: PropsWithChildren<TableChildProps>) {
  return (
    <TableCell
      x={1}
      xSize={-1}
      y={FIRST_CONTENT_ROW + index * 2}
      ySize={2}
      subgrid
    >
      <>
        <TableSubCell x={1} xSize={-1} y={1} extraClassNames={['comment']}>
          {'//  '}
          {description}
          {/* {'  //'} */}
        </TableSubCell>
      </>
      <>
        <TableSubCell x={1} y={2} extraClassNames={['name']}>
          {name}
          {required && <span className="required">*</span>}
        </TableSubCell>
        {children}
      </>
    </TableCell>
  );
}

export function ParametersTableChild({
  name,
  description,
  required,
  index,
  hideExample = false,
  schema,
}: {
  name: string;
  description: string;
  required: boolean;
  hideExample?: boolean;
  schema: ParsedSchemaType;
  index: number;
}) {
  const inputId = `${name}-${index}-input`;
  return (
    <TableChild
      index={index}
      name={name}
      description={description}
      required={required}
    >
      <TableSubCell
        x={2}
        xSize={hideExample ? -1 : 1}
        y={2}
        extraClassNames={['schema']}
      >
        <Schema data={schema} />
      </TableSubCell>
      {!hideExample && (
        <TableSubCell x={3} y={2} extraClassNames={['example']}>
          <input
            id={inputId}
            required={required}
            className="input"
            aria-label={`${name} input`}
            name={name}
            type={'text'}
            placeholder={schema?.examples?.[0] ?? 'Placeholder'}
          />
          <label htmlFor={inputId} className="hint">
            {schema.description}
          </label>
        </TableSubCell>
      )}
    </TableChild>
  );
}

export function ResponseTableChild({
  index,
  name,
  response: { headers = {}, content = {}, description },
}: {
  index: number;
  name: string;
  response: Response<any, any>;
}) {
  const components = useContext(ComponentsContext);
  const realHeaders = Object.keys(headers).reduce((total, headerKey) => {
    total.push({
      name: headerKey,
      ...componentFromRef<'headers'>(headers[headerKey], components),
    });
    return total;
  }, [] as ParameterTypeProps[]);

  return (
    <TableChild
      index={index}
      name={name}
      description={description}
      required={false}
    >
      <TableSubCell x={2} xSize={2} y={2} extraClassNames={['responses']}>
        <Tabs
          fillContent
          variant={TabsVariants.OPEN_API_RESPONSE}
          stretchLabels={false}
          renderers={[
            ParametersTableTabRenderer({
              type: 'header',
              allowRequired: false,
              hideExamples: true,
              params: realHeaders,
            }),
            BodyParametersTableTabRenderer({
              hideExamples: true,
              content,
            }),
          ]}
        />
      </TableSubCell>
    </TableChild>
  );
}

type ParameterTypeProps = Omit<ParameterType, 'in'>;

export function ParametersTableTabRenderer({
  type,
  allowRequired,
  hideExamples,
  params,
}: {
  type: 'path' | 'header' | 'query';
  allowRequired: boolean;
  hideExamples: boolean;
  params: ParameterTypeProps[];
}) {
  return TabItemRenderers({
    label: `${titles[type]} PARAMS`,
    labelProps: {
      variant: hideExamples
        ? TabItemLabelVariants.OPEN_API_RESPONSE
        : TabItemLabelVariants.OPEN_API_PARAMS,
      children: hideExamples ? undefined : (
        <span className={paramsLabel}>
          {titles[type]} (<span className={paramsCount}>{params.length}</span>)
        </span>
      ),
    },
    panelProps: {
      children: (
        <FullParametersTable
          type={type}
          allowRequired={allowRequired}
          params={params}
          hideExamples={hideExamples}
        />
      ),
    },
    tabId: type,
    disabled: !params.length,
  });
}

export function BodyParametersTableTabRenderer({
  hideExamples,
  content,
}: {
  hideExamples: boolean;
  content: Content<any>;
}) {
  const components = useContext(ComponentsContext);

  return TabItemRenderers({
    label: `REQUEST ${titles.body}`,
    labelProps: {
      variant: hideExamples
        ? TabItemLabelVariants.OPEN_API_RESPONSE
        : TabItemLabelVariants.OPEN_API_PARAMS,
      children: hideExamples ? undefined : (
        <span className={paramsLabel}>
          {titles.body} (
          <span className={paramsCount}>{Object.keys(content).length}</span>)
        </span>
      ),
    },
    panelProps: {
      children: (
        <FullParametersTable
          type="body"
          allowRequired={true}
          params={Object.keys(content)
            .filter((type) => !!content[type])
            .map((type) => ({
              description: `Request body of type \`(${type})\``,
              name: `body - \`${type}\``,
              schema: componentFromRef<'schemas'>(
                content[type].schema,
                components,
              ),
              // TODO - evaluate when is the value required
              // required: false,
            }))}
          hideExamples={hideExamples}
        />
      ),
    },
    tabId: 'body',
    disabled: !Object.keys(content).length,
  });
}

export function FullParametersTable({
  type,
  allowRequired,
  hideExamples,
  params,
}: {
  type: TableTypes;
  allowRequired: boolean;
  hideExamples: boolean;
  params: ParameterTypeProps[];
}) {
  const components = useContext(ComponentsContext);
  return (
    <ParametersTable type={type} hideExamples={hideExamples}>
      {params.map(({ name, description, required, schema }, index) => (
        <ParametersTableChild
          key={name}
          index={index}
          name={name}
          description={description}
          required={allowRequired && required}
          schema={componentFromRef(schema, components)}
          hideExample={hideExamples}
        />
      ))}
    </ParametersTable>
  );
}

export function ResponsesTableTabRenderer({
  responses,
}: {
  responses: Responses;
}) {
  return TabItemRenderers({
    label: titles.response,
    labelProps: {
      variant: TabItemLabelVariants.OPEN_API_PARAMS,
      children: (
        <span className={paramsLabel}>
          {titles.response} (
          <span className={paramsCount}>{Object.keys(responses).length}</span>)
        </span>
      ),
    },
    panelProps: {
      children: <FullResponsesTable responses={responses} />,
    },
    tabId: 'response',
    disabled: false,
  });
}

export function FullResponsesTable({ responses }: { responses: Responses }) {
  const components = useContext(ComponentsContext);
  return (
    <ParametersTable type={'response'} hideExamples={true}>
      {Object.keys(responses).map((code, index) => (
        <ResponseTableChild
          key={code}
          index={index}
          name={code}
          response={componentFromRef<'responses'>(responses[code], components)}
        />
      ))}
    </ParametersTable>
  );
}

export default ParametersTable;
