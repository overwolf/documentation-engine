import { IsSequenceIn, SequenceParseData } from './sequences';
import { flow } from 'fp-ts/lib/function';
import * as E from 'fp-ts/lib/Either';
import { DisplayJSONUnits } from '../../../core/units';
import {
  CarryOverParserData,
  ConsumeUntil,
  FoldC,
  LayerSetupCarryOver,
} from './carry-over';
import { PD } from '../data';
import RepeatingSubParser from '../../../../_base/remark/parsing/sub-parsers/sub-parser-repeating';
import { DJNB, createDisplayJSONNode } from '../../../core/node';
import useValue from '../../../../_base/fp-ts/use-value';
import { DJPU } from '../../../core/parse-unit';
import edit from '../../../../_base/fp-ts/edit';

export type BracketParserData<ChildType extends DisplayJSONUnits> = {
  children: DJNB<ChildType | DisplayJSONUnits._commented>[];
  opening: string;
} & SequenceParseData &
  CarryOverParserData;

export type Brackets = { [opening: string]: string };

export default abstract class BracketsSubParser<
  ResultType extends DisplayJSONUnits,
  ChildType extends DisplayJSONUnits,
> extends RepeatingSubParser<DisplayJSONUnits, DJNB, DJNB<ResultType>> {
  protected Starts = flow(
    IsSequenceIn<BracketParserData<ChildType>>(
      true,
      Object.keys(this.brackets),
    ),
    E.map(
      edit((data) => (data.layerData.opening = data.layerData.lastContent)),
    ),
  );

  protected Ends = (data: PD<BracketParserData<ChildType>>) =>
    flow(
      ConsumeUntil<BracketParserData<ChildType>>,
      E.chain(IsSequenceIn(false, [this.brackets[data.layerData.lastContent]])),
    )(data);

  protected Inner = useValue((data: PD<BracketParserData<ChildType>>) =>
    flow(
      DJPU(this.childType),
      E.map((node) => {
        const finalNode = FoldC<ChildType>(data.layerData.carryOver, node);
        data.layerData.children.push(...finalNode);
        data.layerData.carryOver = [];
        return data;
      }),
    ),
  );

  protected SetupLayerData = flow(
    edit((d: PD<BracketParserData<ChildType>>) => (d.layerData.children = [])),
    LayerSetupCarryOver,
  );

  protected CreateNode = (data: PD<BracketParserData<ChildType>>) =>
    E.right(
      createDisplayJSONNode(
        this.resultType,
        {
          brackets: {
            opening: data.layerData.opening,
            closing: data.layerData.lastContent,
          },
        },
        [...data.layerData.children, ...FoldC(data.layerData.carryOver)],
      ),
    );

  public constructor(
    private readonly resultType: ResultType,
    private readonly childType: ChildType,
    private readonly brackets: Brackets,
  ) {
    super();
  }

  public StringifiedScheme = () =>
    `${Object.keys(this.brackets).join('|')} ${
      this.childType
    }, ... ${Object.values(this.brackets).join('|')}`;
}
