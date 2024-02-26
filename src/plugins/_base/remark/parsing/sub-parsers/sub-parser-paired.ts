import * as E from 'fp-ts/lib/Either';
import SimpleSubParser from './sub-parser-simple';
import { FailureReason } from './sub-parser';
import parseUnit from '../../fp-ts/parse-unit';
import { flow } from 'fp-ts/lib/function';
import { RemarkNode } from '../../../core/nodes';
import { ParserData } from '../data';
import useValue from '../../../fp-ts/use-value';

export type PairedSubParserData<
  LeftNode extends RemarkNode,
  RightNode extends RemarkNode,
> = {
  leftResult: LeftNode;
  rightResult: RightNode;
};

export default abstract class PairedSubParser<
  Units extends string,
  NodeType extends RemarkNode,
  ResultNode extends NodeType,
  LeftNode extends RemarkNode,
  RightNode extends RemarkNode,
> extends SimpleSubParser<Units, NodeType, ResultNode> {
  protected leftParentProperties: (data: ParserData<Units, NodeType>) => {
    [key: string]: any;
  } = () => ({});

  protected rightParentProperties: (data: ParserData<Units, NodeType>) => {
    [key: string]: any;
  } = () => ({});

  protected Starts = useValue(
    (
      data: ParserData<
        Units,
        NodeType,
        PairedSubParserData<LeftNode, RightNode>
      >,
    ) =>
      flow(
        () => this.PreStart(data),
        E.chain(
          parseUnit(this.leftParser, {
            parentConfig: (d) => this.leftParentProperties(d),
          }),
        ),
        E.map((node) => {
          data.layerData.leftResult = node as LeftNode;
          return data;
        }),
      ),
  );

  protected abstract PreStart: (
    data: ParserData<Units, NodeType>,
  ) => E.Either<FailureReason, ParserData<Units, NodeType>>;

  protected Ends = (
    data: ParserData<Units, NodeType, PairedSubParserData<LeftNode, RightNode>>,
  ) =>
    flow(
      parseUnit(this.rightParser, {
        parentConfig: (d) => this.rightParentProperties(d),
      }),
      E.map((node) => {
        data.layerData.rightResult = node as RightNode;
        return data;
      }),
    )(data);

  public constructor(
    protected leftParser: Units,
    protected rightParser: Units,
  ) {
    super();
  }
}
