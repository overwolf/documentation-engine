import * as E from 'fp-ts/lib/Either';
import { flow } from 'fp-ts/lib/function';
import { DisplayJSONUnits } from '../../../core/units';
import { PD } from '../data';
import skip from '../../../../_base/fp-ts/skip';
import skipMap from '../../../../_base/fp-ts/skip-map';
import firstInChain from '../../../../_base/remark/fp-ts/first-in-chain';
import SimpleSubParser from '../../../../_base/remark/parsing/sub-parsers/sub-parser-simple';
import { DJNB, createDisplayJSONNode } from '../../../core/node';

export type RecordData = {
  record: DJNB;
};

export default class RecordSubParser extends SimpleSubParser<
  DisplayJSONUnits,
  DJNB,
  DJNB<DisplayJSONUnits._record>
> {
  public StringifiedScheme = () => `${this.records.join('|')}`;

  protected SetupLayerData = skip;

  protected CreateNode = (data: PD<RecordData>) =>
    E.right(
      createDisplayJSONNode(DisplayJSONUnits._record, {}, [
        data.layerData.record,
      ]),
    );

  constructor(protected records: DisplayJSONUnits[]) {
    super();
  }

  public RegisterRecord = this.records.push;

  protected Starts = (data: PD<RecordData>) =>
    flow(
      firstInChain<DisplayJSONUnits, DJNB>(this.records),
      E.map((node) => {
        data.layerData.record = node;
        return data;
      }),
    )(data);

  protected Inner = skipMap;
  protected Ends = skipMap;
}
