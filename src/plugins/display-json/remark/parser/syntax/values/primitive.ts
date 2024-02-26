import * as E from 'fp-ts/lib/Either';
import { PD } from '../../data';
import { SequenceParseData, IsSequenceIn } from '../../utils/sequences';
import skip from '../../../../../_base/fp-ts/skip';
import skipMap from '../../../../../_base/fp-ts/skip-map';
import SimpleSubParser from '../../../../../_base/remark/parsing/sub-parsers/sub-parser-simple';
import { DisplayJSONUnits } from '../../../../core/units';
import { DJNB, createDisplayJSONNode } from '../../../../core/node';

export type PrimitiveParseData = SequenceParseData;

export type PrimitiveData = {
  value: string;
};

export default class PrimitiveSubParser extends SimpleSubParser<
  DisplayJSONUnits,
  DJNB,
  DJNB<DisplayJSONUnits._v_primitive>
> {
  public StringifiedScheme = () => this.primitives.join('|');

  protected SetupLayerData = skip;

  protected CreateNode = (data: PD<PrimitiveParseData>) =>
    E.right(
      createDisplayJSONNode(
        DisplayJSONUnits._v_primitive,
        { value: data.layerData.lastContent },
        [],
      ),
    );

  protected Starts = IsSequenceIn(true, this.primitives);
  protected Inner = skipMap;
  protected Ends = skipMap;

  public constructor(private primitives: string[]) {
    super();
  }
}
