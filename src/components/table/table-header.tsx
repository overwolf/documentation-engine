import React from 'react';
import TableCell, { TableCellProps, TableCellVariants } from './table-cell';
import { MarkOptional } from '../../utils/renderer/general/mark-optional';

type TableHeaderProps = MarkOptional<
  Omit<TableCellProps, 'as' | 'subgrid'>,
  'y'
>;

function TableHeader(props: TableHeaderProps) {
  return (
    <TableCell
      {...{
        // Default values
        y: 0,
        // Props
        ...props,
      }}
      variant={props.variant ?? TableCellVariants.HEADER}
    />
  );
}

export default TableHeader;
