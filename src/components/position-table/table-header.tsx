import React, { PropsWithChildren } from 'react';
import TableCell from './table-cell';

type TableHeaderProps = {
  empty: boolean;
  x: number;
  xSize?: number;
};

function TableHeader({
  children,
  empty,
  x,
  xSize = 1,
}: PropsWithChildren<TableHeaderProps>) {
  return (
    <TableCell
      empty={empty}
      extraClass="table-header"
      x={x}
      xSize={xSize}
      y={1}
    >
      {children}
    </TableCell>
  );
}

export default TableHeader;
