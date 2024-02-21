import { RemarkNode } from '../../core/nodes';

export type ParseTree<
  Units extends string,
  Node extends RemarkNode<any, any>,
> = ParseTreeStepUnwind | NestedParseTree<Units, Node>;

export type NestedParseTree<
  Units extends string,
  Node extends RemarkNode<any, any>,
> = ParseTreeStepParseUnit<Units, Node> | ParseTreeStepParser<Units, Node>;

export type ParseTreeStepUnwind = {
  lastIndex: number;
  initialIndex: number;
};

export type ParseTreeStepParseUnit<
  Units extends string,
  Node extends RemarkNode<any, any>,
> = {
  type: 'ParseUnit';
  unit: Units;
} & (Success | Failure) &
  HasChildren<Units, Node>;

export type ParseTreeStepParser<
  Units extends string,
  Node extends RemarkNode<any, any>,
> = {
  type: 'Parser';
  startIndex: number;
  endIndex: number;
  parserIndex: number;
  parserScheme: string;
} & ((Success & { node: Node }) | (Failure & { reason: string })) &
  HasChildren<Units, Node>;

type Failure = {
  correctParser: boolean;
  status: 'Failure';
};

type Success = { status: 'Success' };

type HasChildren<Units extends string, Node extends RemarkNode<any, any>> = {
  children: ParseTree<Units, Node>[];
};

/**
 * ParseTree logging creates the following general layout:
 *
 * ```
 * ParseUnit(Unit): Success:
 *  Parser1(ParserName - ParserScheme): Failure(Incorrect)[Start:End] - 'Reason'
 *  Parser2(ParserName - ParserScheme): Failure(Correct)[Start:End] - 'Reason':
 *    ParseUnit(Unit): ...
 *  Parser3(ParserName - ParserScheme): Success[Start:End] - {Node}:
 *    ParseUnit(Unit): Failure(Correct):
 *      ...
 *    Unwinding(End -> Start)
 *    ParseUnit(Unit): ...
 * ```
 */
