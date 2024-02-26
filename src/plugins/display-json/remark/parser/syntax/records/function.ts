import * as E from 'fp-ts/lib/Either';
import { flow } from 'fp-ts/lib/function';
import { NameLiteralParentConfig } from '../literal/name';
import { PD } from '../../data';
import { SequenceParseData, IsSequenceIn } from '../../utils/sequences';
import skip from '../../../../../_base/fp-ts/skip';
import skipMap from '../../../../../_base/fp-ts/skip-map';
import SimpleSubParser from '../../../../../_base/remark/parsing/sub-parsers/sub-parser-simple';
import { DisplayJSONUnits } from '../../../../core/units';
import { DJNB, createDisplayJSONNode } from '../../../../core/node';
import { DJPU } from '../../../../core/parse-unit';

export type FunctionParseData = SequenceParseData & {
  functionName: DJNB<DisplayJSONUnits._name_literal>;
  callback: DJNB<DisplayJSONUnits._callback>;
};

export default class FunctionSubParser extends SimpleSubParser<
  DisplayJSONUnits,
  DJNB,
  DJNB<DisplayJSONUnits._r_function>
> {
  public StringifiedScheme = () => 'function Name-Callback';

  protected SetupLayerData = skip;

  protected CreateNode = (data: PD<FunctionParseData>) =>
    E.right(
      createDisplayJSONNode(
        DisplayJSONUnits._r_function,
        { type: data.layerData.lastContent },
        [data.layerData.functionName, data.layerData.callback],
      ),
    );

  protected Starts = IsSequenceIn(true, ['function']);
  protected Inner = (data: PD<FunctionParseData>) =>
    flow(
      DJPU(DisplayJSONUnits._name_literal, {
        allowNamespaceNames: true,
      } as NameLiteralParentConfig),
      E.map((node) => {
        data.layerData.functionName = node;
        return data;
      }),
      E.chain(DJPU(DisplayJSONUnits._callback)),
      E.map((node) => {
        data.layerData.callback = node;
        return data;
      }),
    )(data);

  protected Ends = skipMap;
}
