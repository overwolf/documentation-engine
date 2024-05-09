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
import firstInChain from '../../../../_base/remark/fp-ts/first-in-chain';
import skip from '../../../../_base/fp-ts/skip';
import SimpleSubParser from '../../../../_base/remark/parsing/sub-parsers/sub-parser-simple';

export type ValueData = {
  topValue: DJNB;
};

// export default class ValueSubParser extends SimpleSubParser<
//   DisplayJSONUnits,
//   DJNB,
//   DJNB<DisplayJSONUnits._value>
// > {
//   public StringifiedScheme = () => `${this.values.join('|')}`;

//   protected SetupLayerData = skip;

//   protected CreateNode = (data: PD<ValueData>) =>
//     E.right(
//       createDisplayJSONNode(DisplayJSONUnits._value, {}, [
//         data.layerData.value,
//       ]),
//     );

//   constructor(protected values: DisplayJSONUnits[]) {
//     super();
//   }

//   public RegisterValue = this.values.push;

//   protected Starts = (data: PD<ValueData>) =>
//     flow(
//       firstInChain<DisplayJSONUnits, DJNB>([
//         [DisplayJSONUnits._group, { allowRewind: true }],
//         ...this.values,
//       ]),
//       E.map((node) => {
//         data.layerData.value = node;
//         return data;
//       }),
//     )(data);

//   protected Inner = skipMap;
//   protected Ends = skipMap;
// }

export default class ValueSubParser extends SimpleSubParser<
  DisplayJSONUnits,
  DJNB,
  DJNB<DisplayJSONUnits._value>
> {
  protected Starts = skipMap;

  protected Ends = flow(
    // Try parse union with current node as context, if successful, set union as current
    // return if union success/didn't start (aka found union/didn't find unifying char)
    // Union parser - parse unifying, if success, parse value right after, and build as pair-wise node

    // ConsumeUntil,
    // E.chain(
    //   E.fromPredicate(
    //     (data) => E.isLeft(data.parser.current()),
    //     () => failReason(true, 'Content end not reached yet'),
    //   ),
    // ),
  );

  protected Inner = (data: PD<ValueData>) =>
    flow(
      firstInChain<DisplayJSONUnits, DJNB>([
        [DisplayJSONUnits._group, { allowRewind: true }],
        ...this.values,
      ]),
      E.map((node) => {
        data.layerData.topValue = node;
        return data;
      }),
    )(data);

  // protected Inner = (data: PD<RootParserData>) =>
  //   flow(
  //     DJPU(DisplayJSONUnits._record),
  //     E.map((node) => {
  //       const finalNode = FoldC<DisplayJSONUnits._record>(
  //         data.layerData.carryOver,
  //         node,
  //       );
  //       data.layerData.children.push(...finalNode);
  //       data.layerData.carryOver = [];
  //       return data;
  //     }),
  //   )(data as PD<RootParserData>);

  protected SetupLayerData = skip;

  protected CreateNode = (data: PD<ValueData>) =>
    E.right(
      createDisplayJSONNode(DisplayJSONUnits._value, {}, [
        data.layerData.topValue,
      ]),
    );

  constructor(protected values: DisplayJSONUnits[]) {
    super();
  }

  public StringifiedScheme = () =>
    `(?:${this.values.join('|')}){1}(?:(?:\\|\\&)${this.values.join('|')})*`;
}
