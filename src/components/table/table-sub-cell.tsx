import React from 'react';
import TableCell, { TableCellProps } from './table-cell';
import { DefaultVariants } from '../../utils/renderer/props/standard';

function TableSubCell(props: Omit<TableCellProps, 'subgrid' | 'as'>) {
  return (
    <TableCell
      {...props}
      as="div"
      subgrid={false}
      variant={DefaultVariants.DEFAULT}
    />
  );
}

export default TableSubCell;
