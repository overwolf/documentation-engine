import { flow } from 'fp-ts/lib/function';
import * as E from 'fp-ts/lib/Either';
import { DisplayJSONUnits } from '../../../core/units';
import { PD } from '../data';
import RepeatingSubParser from '../../../../_base/remark/parsing/sub-parsers/sub-parser-repeating';
import skipMap from '../../../../_base/fp-ts/skip-map';
import {
  CarryOverParserData,
  ConsumeUntil,
  FoldC,
  LayerSetupCarryOver,
} from '../utils/carry-over';
import { failReason } from '../../../../_base/remark/fp-ts/fail-parse';
import { DJNB, createDisplayJSONNode } from '../../../core/node';
import { DJPU } from '../../../core/parse-unit';

export type RootParserData = {
  children: (
    | DJNB<DisplayJSONUnits._record>
    | DJNB<DisplayJSONUnits._commented>
  )[];
  name: string;
} & CarryOverParserData;

export default class RootSubParser extends RepeatingSubParser<
  DisplayJSONUnits,
  DJNB,
  DJNB<DisplayJSONUnits._root>
> {
  protected Starts = skipMap;

  protected Ends = flow(
    ConsumeUntil,
    E.chain(
      E.fromPredicate(
        (data) => E.isLeft(data.parser.current()),
        () => failReason(true, 'Content end not reached yet'),
      ),
    ),
  );

  protected Inner = (data: PD<RootParserData>) =>
    flow(
      DJPU(DisplayJSONUnits._record),
      E.map((node) => {
        const finalNode = FoldC<DisplayJSONUnits._record>(
          data.layerData.carryOver,
          node,
        );
        data.layerData.children.push(...finalNode);
        data.layerData.carryOver = [];
        return data;
      }),
    )(data as PD<RootParserData>);

  protected SetupLayerData(d: PD<RootParserData>) {
    return flow((data: PD<RootParserData>) => {
      data.layerData.children = [];
      return data;
    }, LayerSetupCarryOver)(d) as PD<RootParserData>;
  }

  protected CreateNode = (data: PD<RootParserData>) =>
    E.right(
      createDisplayJSONNode(
        DisplayJSONUnits._root,
        {
          name: data.layerData.name.replaceAll('-', ''),
          id: data.layerData.name.toLocaleLowerCase(),
        },
        [
          ...data.layerData.children,
          ...FoldC<DisplayJSONUnits._record>(data.layerData.carryOver),
        ],
      ),
    );

  public StringifiedScheme = () => '...(Comment|Skip|KeepLiteral record?)';
}
