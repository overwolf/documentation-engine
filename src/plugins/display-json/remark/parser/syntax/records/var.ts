import { FieldParentConfig } from '../field';
import { flow } from 'fp-ts/lib/function';
import { PD } from '../../data';
import { SequenceParseData, IsSequenceIn } from '../../utils/sequences';
import * as E from 'fp-ts/Either';
import edit from '../../../../../_base/fp-ts/edit';
import skip from '../../../../../_base/fp-ts/skip';
import skipMap from '../../../../../_base/fp-ts/skip-map';
import useValue from '../../../../../_base/fp-ts/use-value';
import SimpleSubParser from '../../../../../_base/remark/parsing/sub-parsers/sub-parser-simple';
import { DisplayJSONUnits } from '../../../../core/units';
import { DJPU } from '../../../../core/parse-unit';
import { DJNB, createDisplayJSONNode } from '../../../../core/node';

export type VarParseData = SequenceParseData & {
  fieldData: DJNB<DisplayJSONUnits._field>;
};

const VarKeywords = ['var', 'const', 'let', 'type'];

export default class VarSubParser extends SimpleSubParser<
  DisplayJSONUnits,
  DJNB,
  DJNB<DisplayJSONUnits._r_variable>
> {
  public StringifiedScheme = () => `${VarKeywords.join('|')} VarName = Value`;

  protected SetupLayerData = skip;

  protected CreateNode = (data: PD<VarParseData>) =>
    E.right(
      createDisplayJSONNode(
        DisplayJSONUnits._r_variable,
        { type: data.layerData.lastContent },
        [data.layerData.fieldData],
      ),
    );

  protected Starts = IsSequenceIn<VarParseData>(true, VarKeywords);
  protected Inner = useValue((data: PD<VarParseData>) =>
    flow(
      DJPU(DisplayJSONUnits._field, {
        assignmentOperator: '=',
        enableStringName: false,
        allowNamespaceNames: true,
      } as FieldParentConfig),
      E.map(edit((node) => (data.layerData.fieldData = node), data)),
    ),
  );

  protected Ends = skipMap;
}
