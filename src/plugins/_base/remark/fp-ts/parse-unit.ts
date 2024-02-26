import * as E from 'fp-ts/Either';
import { flow } from 'fp-ts/lib/function';
import BaseParser from '../parsing/parser';
import edit from '../../fp-ts/edit';
import useData from '../../fp-ts/use-value';
import { RemarkNode } from '../../core/nodes';
import { FailureReason } from '../parsing/sub-parsers/sub-parser';
import { ParserData } from '../parsing/data';

export default <
  Unit extends string,
  ParentConfig extends { [key: string]: any },
  NodeType extends RemarkNode<any, Unit, any>,
  PD extends ParserData<
    Unit,
    NodeType,
    any,
    any,
    BaseParser<any, any>,
    ParentConfig
  >,
>(
  unit: Unit,
  options?: {
    parentConfig?: (data: ParserData<any, any>) => ParentConfig;
    rewindOnFailure?: boolean;
  },
) =>
  flow(
    edit(
      (data: PD) =>
        (data.parentConfig =
          options?.parentConfig?.(data) ??
          data.parentConfig ??
          ({} as ParentConfig)),
    ),
    useData((data: PD) =>
      data.parser.ParseUnit(unit, options?.rewindOnFailure ?? false),
    ),
  ) as (data: PD) => E.Either<FailureReason, NodeType>;
