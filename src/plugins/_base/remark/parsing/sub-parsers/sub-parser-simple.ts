import { flow } from 'fp-ts/lib/function';
import BaseSubParser, { FailureReason } from './sub-parser';
import * as E from 'fp-ts/lib/Either';
import { RemarkNode } from '../../../core/nodes';
import { ParserData } from '../data';

export default abstract class SimpleSubParser<
  Units extends string,
  NodeType extends RemarkNode,
  ResultNode extends NodeType,
> extends BaseSubParser<Units, NodeType, ResultNode> {
  public ParseFlow: (
    data: ParserData<Units, NodeType>,
  ) => E.Either<FailureReason, ParserData<Units, NodeType>> = flow(
    (d) => this.Inner(d),
    E.chain((d) => this.Ends(d)),
  );
}
