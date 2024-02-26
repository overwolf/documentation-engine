import { RemarkNode } from '../../../core/nodes';
import * as E from 'fp-ts/lib/Either';
import { flow } from 'fp-ts/lib/function';
import { ParserData } from '../data';

// TODO - convert this to be layer-based rather than inherited abstract funcs
export default abstract class BaseSubParser<
  Units extends string,
  NodeType extends RemarkNode,
  ResultNode extends NodeType,
> {
  public abstract StringifiedScheme(): string;

  protected abstract Starts(
    data: ParserData<Units, NodeType>,
  ): E.Either<FailureReason, ParserData<Units, NodeType>>;

  protected abstract SetupLayerData(
    data: ParserData<Units, NodeType>,
  ): ParserData<Units, NodeType>;

  protected abstract Inner(
    data: ParserData<Units, NodeType>,
  ): E.Either<FailureReason, ParserData<Units, NodeType>>;

  protected abstract Ends(
    data: ParserData<Units, NodeType>,
  ): E.Either<FailureReason, ParserData<Units, NodeType>>;

  protected abstract CreateNode(
    data: ParserData<Units, NodeType>,
  ): E.Either<FailureReason, ResultNode>;

  protected abstract ParseFlow(
    data: ParserData<Units, NodeType>,
  ): E.Either<FailureReason, ParserData<Units, NodeType>>;

  public Parse: (
    data: ParserData<Units, NodeType>,
  ) => E.Either<FailureReason, ResultNode> = flow(
    (d) => this.SetupLayerData(d),
    (d) => this.Starts(d),
    E.chain((d) => this.ParseFlow(d)),
    E.chain((d) => this.CreateNode(d)),
  );
}

export type FailureReason = {
  correctParser: boolean;
  reason: string;
};
