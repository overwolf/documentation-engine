import { GridPlacer } from './style';

export default function PositionInGrid(
  index: number,
  width: number,
): GridPlacer {
  return {
    columnStart: index % width,
    rowStart: Math.floor(index / width),
  };
}
