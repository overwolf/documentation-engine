import React, { PropsWithChildren } from 'react';
import { PlaceOnGrid } from '../../../../src/theme/OWSidebar/sidebar-grid/utils';
import clsx from 'clsx';

type TableCellProps = {
  empty: boolean;
  extraClass: string;
  x: number;
  y: number;
  xSize?: number;
  ySize?: number;
};

function TableCell({
  children,
  empty = false,
  extraClass,
  x,
  y,
  xSize = 1,
  ySize = 1,
}: PropsWithChildren<TableCellProps>) {
  return (
    <li
      className={clsx('table-cell', extraClass)}
      style={PlaceOnGrid({
        columnStart: x,
        rowStart: y,
        columnEnd: x + xSize - 1,
        rowEnd: y + ySize - 1,
      })}
    >
      {!empty && children}
    </li>
  );
}

export default TableCell;
