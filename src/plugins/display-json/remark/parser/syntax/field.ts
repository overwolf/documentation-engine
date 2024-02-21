import { flow } from 'fp-ts/lib/function';
import * as E from 'fp-ts/lib/Either';
import { NameParentConfig } from './name';
import { DisplayJSONUnits } from '../../../core/units';
import { PD } from '../data';
import {
  CarryOverParserData,
  LayerSetupCarryOver,
  FoldC,
  ConsumeUntil,
} from '../utils/carry-over';
import edit from '../../../../_base/fp-ts/edit';
import skipMap from '../../../../_base/fp-ts/skip-map';
import { chainParentConfig } from '../../../../_base/remark/fp-ts/pass-parent-config';
import PairedSubParser, {
  PairedSubParserData,
} from '../../../../_base/remark/parsing/sub-parsers/sub-parser-paired';
import { DJNB, createDisplayJSONNode } from '../../../core/node';
import { AssignmentValueType } from '../../../core/structure';
import { DJPU } from '../../../core/parse-unit';
import { AssignmentParentData } from './assignment';
import useValue from '../../../../_base/fp-ts/use-value';

export type FieldParseData = PairedSubParserData<
  DJNB<DisplayJSONUnits.Name>,
  DJNB<DisplayJSONUnits._value>
> &
  CarryOverParserData & {
    assignment: DJNB<DisplayJSONUnits._commented>[];
  } & FieldParentConfig;

export type FieldParentConfig = {
  assignmentOperator: AssignmentValueType;
} & NameParentConfig;

export type FieldData = { assignment: string };

export default class FieldSubParser extends PairedSubParser<
  DisplayJSONUnits,
  DJNB,
  DJNB<DisplayJSONUnits._field>,
  DJNB<DisplayJSONUnits.Name>,
  DJNB<DisplayJSONUnits._value>
> {
  public StringifiedScheme = () => 'Name :|= Value';

  protected PreStart = skipMap;

  constructor() {
    super(DisplayJSONUnits.Name, DisplayJSONUnits._value);
  }

  protected leftParentProperties = chainParentConfig;

  protected SetupLayerData = flow(
    LayerSetupCarryOver<FieldParseData>,
    edit(
      (data: PD<FieldParseData>) =>
        (data.layerData.assignmentOperator =
          data.layerData.assignmentOperator ?? ':'),
    ),
  );

  protected CreateNode = (data: PD<FieldParseData>) =>
    E.right(
      createDisplayJSONNode(DisplayJSONUnits._field, {}, [
        data.layerData.leftResult,
        ...data.layerData.assignment,
        ...FoldC<DisplayJSONUnits._value>(
          data.layerData.carryOver,
          data.layerData.rightResult,
        ),
      ]),
    );

  protected Inner = useValue((data: PD<FieldParseData>) =>
    flow(
      ConsumeUntil<FieldParseData>,
      E.chain(
        DJPU(DisplayJSONUnits._s_assignment, {
          value: data.layerData.assignmentOperator,
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
