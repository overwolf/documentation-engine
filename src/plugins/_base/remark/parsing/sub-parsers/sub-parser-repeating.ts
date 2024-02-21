import { flow } from 'fp-ts/lib/function';
import BaseSubParser, { FailureReason } from './sub-parser';
import * as E from 'fp-ts/lib/Either';
import { RemarkNode } from '../../../core/nodes';
import { ParserData } from '../data';

export default abstract class RepeatingSubParser<
  Units extends string,
  NodeType extends RemarkNode<any, any, any>,
  ResultNode extends NodeType,
> extends BaseSubParser<Units, NodeType, ResultNode> {
  private RecursiveParse: (
    data: ParserData<Units, NodeType>,
  ) => E.Either<FailureReason, ParserData<Units, NodeType>> = (data) =>
    flow(
      // If the closing sequence was found, close this node
      () => this.Ends(data),
      E.alt(() =>
        flow(
          // If the closing sequence was not found, try to find content
          () => this.Inner(data),
          // If content was located, iterate recursively
          E.chain((d) => this.RecursiveParse(d)),
        )(),
      ),
    )();

  public ParseFlow = this.RecursiveParse;
}
