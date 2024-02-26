import * as E from 'fp-ts/lib/Either';
import { DisplayJSONUnits } from '../../../core/units';
import { flow } from 'fp-ts/lib/function';
import {
  CarryOverParserData,
  ConsumeUntil,
  FoldC,
  LayerSetupCarryOver,
} from '../utils/carry-over';
import { PD } from '../data';
import PairedSubParser, {
  PairedSubParserData,
} from '../../../../_base/remark/parsing/sub-parsers/sub-parser-paired';
import { DJNB, createDisplayJSONNode } from '../../../core/node';
import useValue from '../../../../_base/fp-ts/use-value';
import { DJPU } from '../../../core/parse-unit';
import { AssignmentParentData } from '../syntax/assignment';

export type ArrowParseData<
  LeftUnit extends DisplayJSONUnits,
  RightUnit extends DisplayJSONUnits,
> = PairedSubParserData<DJNB<LeftUnit>, DJNB<RightUnit>> &
  CarryOverParserData & {
    assignment: DJNB<DisplayJSONUnits._commented>[];
  };

export default abstract class ArrowSubParser<
  ResultType extends DisplayJSONUnits,
  LeftUnit extends DisplayJSONUnits,
  RightUnit extends DisplayJSONUnits,
> extends PairedSubParser<
  DisplayJSONUnits,
  DJNB,
  DJNB<ResultType>,
  DJNB<LeftUnit>,
  DJNB<RightUnit>
> {
  constructor(
    private readonly resultType: ResultType,
    left: LeftUnit,
    right: RightUnit,
  ) {
    super(left, right);
  }

  public StringifiedScheme() {
    return `${this.leftParser} => ${this.rightParser}`;
  }

  protected SetupLayerData = LayerSetupCarryOver;

  protected CreateNode = (data: PD<ArrowParseData<LeftUnit, RightUnit>>) =>
    E.right(
      createDisplayJSONNode(this.resultType, {}, [
        data.layerData.leftResult,
        ...data.layerData.assignment,
        ...FoldC(data.layerData.carryOver, data.layerData.rightResult),
      ]),
    );

  protected Inner = useValue((data: PD<ArrowParseData<LeftUnit, RightUnit>>) =>
    flow(
      ConsumeUntil<ArrowParseData<LeftUnit, RightUnit>>,
      E.chain(
        DJPU(DisplayJSONUnits._s_assignment, {
          value: '=>',
        } as AssignmentParentData),
      ),
      E.map((assignment) => {
        data.layerData.assignment = FoldC(data.layerData.carryOver, assignment);
        data.layerData.carryOver = [];
        return data;
      }),
      E.chain(ConsumeUntil),
    ),
  );
}
