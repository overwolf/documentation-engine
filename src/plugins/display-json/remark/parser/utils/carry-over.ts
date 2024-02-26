import { flow } from 'fp-ts/lib/function';
import * as E from 'fp-ts/lib/Either';
import { DisplayJSONUnits } from '../../../core/units';
import { PD } from '../data';
import { CreateCommentedNode } from '../syntax/commented';
import chainLeft from '../../../../_base/fp-ts/chain-left';
import { FailureReason } from '../../../../_base/remark/parsing/sub-parsers/sub-parser';
import edit from '../../../../_base/fp-ts/edit';
import useValue from '../../../../_base/fp-ts/use-value';
import { failReason } from '../../../../_base/remark/fp-ts/fail-parse';
import biChain from '../../../../_base/fp-ts/bi-chain';
import { DJNB } from '../../../core/node';
import { DJPU } from '../../../core/parse-unit';

export type CarryOverParserData = {
  carryOver: CarriedOver[];
  _parsedAny: boolean;
};

export type CarriedOver<Carried extends DisplayJSONUnits = any> =
  | DJNB<DisplayJSONUnits.KeepLiteral>
  | DJNB<DisplayJSONUnits.Comment>
  | DJNB<Carried>;

export const LayerSetupCarryOver = <Data extends CarryOverParserData>(
  data: PD<Data>,
) => {
  data.layerData.carryOver = [];
  return data;
};

const foldEval = <
  Unit extends DisplayJSONUnits,
  Data extends CarryOverParserData,
>(
  unit: Unit,
  skipContent = false,
): ((data: PD<Data>) => E.Either<FailureReason, PD<Data>>) =>
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useValue((data: PD<Data>) =>
    flow(
      E.fromPredicate(
        (data) => E.isRight(data.parser.current()),
        () => failReason(true, 'Parser ran out of content'),
      ),
      biChain(
        flow(
          DJPU(unit),
          E.map(
            edit((child) => {
              !skipContent && data.layerData.carryOver.push(child);
              data.layerData._parsedAny = true;
            }, data),
          ),
          chainLeft((reason) =>
            reason.correctParser ? E.left(reason) : E.right(data),
          ),
        ),
        () => E.right(data),
      ),
    ),
  );

export const ConsumeUntil = <Data extends CarryOverParserData>(
  data: PD<Data>,
): E.Either<FailureReason, PD<Data>> =>
  flow(
    edit((data: PD<Data>) => (data.layerData._parsedAny = false)),
    foldEval(DisplayJSONUnits.Comment),
    E.chain(foldEval(DisplayJSONUnits.KeepLiteral)),
    E.chain(foldEval(DisplayJSONUnits.Skip, true)),
    E.chain((data) =>
      data.layerData._parsedAny ? ConsumeUntil<Data>(data) : E.right(data),
    ),
  )(data);

type CarriedOverSum<NodeType extends DisplayJSONUnits> = [
  ...CarriedOver<NodeType>[],
  DJNB<NodeType> | DJNB<DisplayJSONUnits.KeepLiteral>,
];

export const FoldC = <NodeType extends DisplayJSONUnits>(
  carried: CarriedOver<NodeType>[],
  node?: DJNB<NodeType>,
): (DJNB<NodeType> | DJNB<DisplayJSONUnits._commented>)[] => {
  if (!carried.length) return node ? [node] : [];
  const content = carried.reduce(
    (total, val, index) => {
      total[total.length - 1].push(val);
      if (val.type !== 'DisplayJSON => Comment' && index !== carried.length - 1)
        total.push([] as unknown as CarriedOverSum<NodeType>);

      return total;
    },
    [[]] as unknown as CarriedOverSum<NodeType>[],
  );
  if (node) content[content.length - 1].push(node);
  return content.map((value: CarriedOverSum<NodeType>) =>
    CreateCommentedNode<NodeType>(value),
  );
};
