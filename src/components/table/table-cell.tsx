import React, { ElementType, PropsWithChildren } from 'react';
import PlaceOnGrid from '../../utils/renderer/grid/style';
import {
  classNamer,
  DefaultVariants,
  StandardProps,
} from '../../utils/renderer/props/standard';
import { MarkOptional } from '../../utils/renderer/general/mark-optional';

export const enum TableCellVariants {
  HEADER = 'header',
}

export type TableCellProps = PropsWithChildren<
  MarkOptional<
    StandardProps<
      {
        empty?: boolean;
        /**
         * Whether the content of this cell should completely fill the area, or
         * be padded from its edges
         *
         * @default false (apply padding)
         */
        fillContent?: boolean;
        subgrid?: boolean;
        x: number;
        y: number;
        xSize?: number;
        ySize?: number;
        as?: ElementType;
      },
      TableCellVariants
    >,
    'variant'
  >
>;

function TableCell({
  children,
  fillContent = false,
  empty = false,
  subgrid,
  x,
  y,
  xSize = 1,
  ySize = 1,
  as: As = 'li',
  variant = DefaultVariants.DEFAULT,
  extraClassNames,
  style,
}: TableCellProps) {
  return (
    <As
      className={classNamer({
        classNames: { 'table-cell': !subgrid, subgrid, padded: !fillContent },
        extraClassNames,
        variant,
      })}
      style={{
        ...PlaceOnGrid({
          columnStart: x,
          rowStart: y,
          columnEnd: x + xSize - 1,
          rowEnd: y + ySize - 1,
          columnFlex: xSize === -1,
          rowFlex: ySize === -1,
        }),
        ...style,
      }}
    >
      {!empty && children}
    </As>
  );
}

export default TableCell;
