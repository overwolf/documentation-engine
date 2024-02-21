import { flow } from 'fp-ts/lib/function';
import { RemarkNode } from '../../core/nodes';
import { FailureReason } from '../parsing/sub-parsers/sub-parser';
import * as E from 'fp-ts/lib/Either';
import tryEval from '../../fp-ts/try-eval';
import skip from '../../fp-ts/skip';
import biChain from '../../fp-ts/bi-chain';
import parseUnit from './parse-unit';
import { ParserData } from '../parsing/data';
import { failReason } from './fail-parse';

export type RecursiveTryParse<
  Units extends string,
  NodeType extends RemarkNode<any, any>,
> = E.Either<FailureReason, E.Either<ParserData<Units, NodeType>, NodeType>>;

const tryParse = <Units extends string, NodeType extends RemarkNode<any, any>>(
  parser: (
    data: ParserData<Units, NodeType>,
  ) => E.Either<FailureReason, NodeType>,
  allowCorrectFailure = false,
) =>
  tryEval<FailureReason, ParserData<Units, NodeType>, NodeType>(
    parser,
    (
      data: ParserData<Units, NodeType>,
      result: E.Either<FailureReason, NodeType>,
    ) =>
      biChain<NodeType, FailureReason, RecursiveTryParse<Units, NodeType>>(
        flow(E.right, E.right),
        flow(
          E.fromPredicate(
            (reason) => !reason.correctParser || allowCorrectFailure,
            skip,
          ),
          E.map(() => E.left(data)),
        ),
      )(result),
  );

export default tryParse;

export const tryParseUnit = <
  Units extends string,
  NodeType extends RemarkNode<any, Units>,
>(
  unit: Units,
  allowCorrectFailure = false,
) => tryParse<Units, NodeType>(parseUnit(unit), allowCorrectFailure);

export const setUpData = flow(E.left, E.right) as <
  Units extends string,
  NodeType extends RemarkNode<any, any>,
>(
  data: ParserData<Units, NodeType>,
) => RecursiveTryParse<Units, NodeType>;

export const extractData = E.chain(
  biChain(
    (node) => E.right(node),
    () => E.left(failReason(false, 'No fitting parser found in `tryParse`')),
  ),
) as <Units extends string, NodeType extends RemarkNode<any, any>>(
  data: RecursiveTryParse<Units, NodeType>,
) => E.Either<FailureReason, NodeType>;
