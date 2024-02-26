import {
  RemarkNodeData,
  createHName,
  createReactFunction,
  createRemarkNode,
} from '../../_base/core/nodes';
import DisplayJSONStructure, {
  DisplayJSONStructureType,
  rootNodeType,
} from './structure';
import { DisplayJSONUnits } from './units';

export const createDisplayJSONNode = <Unit extends DisplayJSONUnits>(
  ...props: RemarkNodeData<typeof rootNodeType, Unit, DisplayJSONStructureType>
) =>
  createRemarkNode(
    rootNodeType,
    DisplayJSONStructure as DisplayJSONStructureType,
    props,
  );

export type DisplayJSONNodeBase<
  Unit extends DisplayJSONUnits = DisplayJSONUnits,
> = ReturnType<typeof createDisplayJSONNode<Unit>>;

export type DJNB<Unit extends DisplayJSONUnits = DisplayJSONUnits> =
  DisplayJSONNodeBase<Unit>;

/**
 * Frankly, this function only exists as a hack for type resolution
 *
 * @param {...any} props
 */
const createDisplayJSONRenderer = <Unit extends DisplayJSONUnits>(
  ...props: RemarkNodeData<typeof rootNodeType, Unit, DisplayJSONStructureType>
) =>
  createReactFunction(
    rootNodeType,
    DisplayJSONStructure as DisplayJSONStructureType,
    props,
  );

export type DisplayJSONReactNode<
  Unit extends DisplayJSONUnits = DisplayJSONUnits,
> = ReturnType<typeof createDisplayJSONRenderer<Unit>>;

export const mdxTypeFromUnit = (unit: DisplayJSONUnits) =>
  createHName(rootNodeType, DisplayJSONStructure, unit);
