import React, { PropsWithChildren } from 'react';
import './table.scss';
import {
  classNamer,
  DefaultVariants,
  StandardProps,
} from '../../utils/renderer/props/standard';
import { MarkOptional } from '../../utils/renderer/general/mark-optional';

// export const enum TableVariants {}
export type TableVariants = never;

type TableProps = MarkOptional<
  StandardProps<
    {
      incompleteTable?: boolean;
    },
    TableVariants
  >,
  'variant'
>;

function Table({
  incompleteTable,
  style,
  children,
  variant = DefaultVariants.DEFAULT,
  extraClassNames,
}: PropsWithChildren<TableProps>) {
  return (
    <ul
      role={incompleteTable ? 'presentation' : undefined}
      className={classNamer({
        classNames: 'position-table',
        variant,
        extraClassNames,
      })}
      style={style}
    >
      {children}
    </ul>
  );
}

export default Table;
