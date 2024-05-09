export type GridPlacer = {
  rowStart: number;
  rowEnd?: number;
  rowFlex?: boolean;
  columnStart: number;
  columnEnd?: number;
  columnFlex?: boolean;
};

export default function PlaceOnGrid(
  gridPosition: GridPlacer,
): React.CSSProperties {
  const {
    rowStart,
    rowEnd,
    rowFlex = false,
    columnStart,
    columnEnd,
    columnFlex = false,
  } = gridPosition;
  const rowParams = Apply1DSettings(rowStart, rowEnd, rowFlex);
  const columnParams = Apply1DSettings(columnStart, columnEnd, columnFlex);

  return {
    gridRowStart: rowParams.start,
    gridRowEnd: rowParams.end,

    gridColumnStart: columnParams.start,
    gridColumnEnd: columnParams.end,
  };
}

function Apply1DSettings(
  start: number,
  end: number | undefined,
  flex: boolean,
) {
  return {
    start,
    end: flex ? -1 : (end ?? start) + 1,
  };
}

export function GridTemplate({
  columnCount,
  rowCount,
}: {
  columnCount?: number;
  rowCount?: number;
}): React.CSSProperties {
  return {
    gridTemplateRows: rowCount && '1fr '.repeat(rowCount).trimEnd(),
    gridTemplateColumns: columnCount && '1fr '.repeat(columnCount).trimEnd(),
  };
}
