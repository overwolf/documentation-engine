import * as E from 'fp-ts/lib/Either';
import skipMap from '../../../../_base/fp-ts/skip-map';
import SimpleSubParser from '../../../../_base/remark/parsing/sub-parsers/sub-parser-simple';
import { DJNB, createDisplayJSONNode } from '../../../core/node';
import { DisplayJSONUnits } from '../../../core/units';
import { PD } from '../data';
import { SequenceParseData, IsSequenceIn } from '../utils/sequences';
import { AssignmentValueType, assignmentValue } from '../../../core/structure';
import skip from '../../../../_base/fp-ts/skip';
import useValue from '../../../../_base/fp-ts/use-value';
import { CarryOverParserData } from '../utils/carry-over';
import { flow } from 'fp-ts/lib/function';
import edit from '../../../../_base/fp-ts/edit';
import runIf from '../../../../_base/fp-ts/run-if';
import chainLeft from '../../../../_base/fp-ts/chain-left';

export type AssignmentParseData = SequenceParseData &
  CarryOverParserData &
  AssignmentParentData;

export type AssignmentParentData = {
  value: AssignmentValueType;
  optional: boolean;
};

export default class AssignmentSubParser extends SimpleSubParser<
  DisplayJSONUnits,
  DJNB,
  DJNB<DisplayJSONUnits._s_assignment>
> {
  public StringifiedScheme = () => assignmentValue.join('|');

  protected SetupLayerData = skip;

  protected CreateNode = (data: PD<AssignmentParseData>) =>
    E.right(
      createDisplayJSONNode(
        DisplayJSONUnits._s_assignment,
        {
          value: data.layerData.lastContent as AssignmentValueType,
          optional: data.layerData.optional ?? false,
        },
        [],
      ),
    );

  protected Starts = flow(
    E.fromPredicate(
      (d: PD<AssignmentParseData>) => this.AllowOptional(d),
      skip,
    ),
    chainLeft(E.right),
    E.chain(
      useValue((d) =>
        flow(
          IsSequenceIn<AssignmentParseData>(true, ['?']),
          E.map(edit((d) => (d.layerData.optional = true))),
          chainLeft(() => E.right(d)),
        ),
      ),
    ),
    E.chain(
      useValue((d) =>
        IsSequenceIn<AssignmentParseData>(true, [d.layerData.value]),
      ),
    ),
  );

  private AllowOptional = (data: PD<AssignmentParseData>) =>
    data.layerData.value === ':';

  protected Inner = skipMap;
  protected Ends = skipMap;
}
