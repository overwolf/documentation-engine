import * as E from 'fp-ts/lib/Either';
import { flow } from 'fp-ts/lib/function';
import { PD } from '../../data';
import hasGeneric, { HasGenericData } from '../../utils/has-generic';
import skip from '../../../../../_base/fp-ts/skip';
import skipMap from '../../../../../_base/fp-ts/skip-map';
import firstInChain from '../../../../../_base/remark/fp-ts/first-in-chain';
import SimpleSubParser from '../../../../../_base/remark/parsing/sub-parsers/sub-parser-simple';
import { DisplayJSONUnits } from '../../../../core/units';
import { DJNB, createDisplayJSONNode } from '../../../../core/node';

type LiteralNode =
  | DJNB<DisplayJSONUnits._union>
  | DJNB<DisplayJSONUnits._array>
  | DJNB<DisplayJSONUnits._callback>
  | DJNB<DisplayJSONUnits._object>;

export type LiteralParseData = HasGenericData & {
  literalNode: LiteralNode;
};

export default class LiteralSubParser extends SimpleSubParser<
  DisplayJSONUnits,
  DJNB,
  DJNB<DisplayJSONUnits._v_literal>
> {
  public StringifiedScheme = () => 'Union | Array | Callback | Object';

  protected SetupLayerData = skip;

  protected CreateNode = (data: PD<LiteralParseData>) =>
    E.right(
      createDisplayJSONNode(DisplayJSONUnits._v_literal, {}, [
        data.layerData.generic,
        data.layerData.literalNode,
      ]),
    );

  protected Starts = (data: PD<LiteralParseData>) =>
    flow(
      hasGeneric,
      E.chain(
        firstInChain([
          // DisplayJSONUnit._union, only this can fail
          DisplayJSONUnits._array,
          DisplayJSONUnits._callback,
          DisplayJSONUnits._object,
        ] as DisplayJSONUnits[]),
      ),
      E.map((node) => {
        data.layerData.literalNode = node as LiteralNode;
        return data;
      }),
    )(data);

  protected Inner = skipMap;
  protected Ends = skipMap;
}
