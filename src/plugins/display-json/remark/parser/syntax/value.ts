import * as E from 'fp-ts/lib/Either';
import { flow } from 'fp-ts/lib/function';
import { DisplayJSONUnits } from '../../../core/units';
import { PD } from '../data';
import skip from '../../../../_base/fp-ts/skip';
import skipMap from '../../../../_base/fp-ts/skip-map';
import firstInChain from '../../../../_base/remark/fp-ts/first-in-chain';
import SimpleSubParser from '../../../../_base/remark/parsing/sub-parsers/sub-parser-simple';
import { DJNB, createDisplayJSONNode } from '../../../core/node';

export type ValueData = {
  value: DJNB;
};

export default class ValueSubParser extends SimpleSubParser<
  DisplayJSONUnits,
  DJNB,
  DJNB<DisplayJSONUnits._value>
> {
  public StringifiedScheme = () => `${this.values.join('|')}`;

  protected SetupLayerData = skip;

  protected CreateNode = (data: PD<ValueData>) =>
    E.right(
      createDisplayJSONNode(DisplayJSONUnits._value, {}, [
        data.layerData.value,
      ]),
    );

  constructor(protected values: DisplayJSONUnits[]) {
    super();
  }

  public RegisterValue = this.values.push;

  protected Starts = (data: PD<ValueData>) =>
    flow(
      firstInChain<DisplayJSONUnits, DJNB>(this.values),
      E.map((node) => {
        data.layerData.value = node;
        return data;
      }),
    )(data);

  protected Inner = skipMap;
  protected Ends = skipMap;
}
