import { RemarkNode } from '../../_base/core/nodes';
import { DisplayJSONNodeTypes } from '../enums/DisplayJSONNodeTypes';
import {
  Comment,
  RecordDefinition,
  Root,
  StringValue,
  TopLevelRecordDefinition,
  TypeDefinition,
} from './DisplayJSONProperties';
import { DisplayJSONUnits } from '../core/units';



export type DisplayJSONNode = DisplayJSONNodeBase<
  DisplayJSONNodeTypes.DisplayJSON,
  Root
>;

export type DisplayJSONRecordNode =
  DisplayJSONNodeBase<DisplayJSONNodeTypes.Record>;

export type DisplayJSONRecordDefinitionNode = DisplayJSONNodeBase<
  DisplayJSONNodeTypes.RecordDefinition,
  RecordDefinition
>;

export type DisplayJSONTopLevelRecordDefinitionNode = DisplayJSONNodeBase<
  DisplayJSONNodeTypes.TopLevelRecordDefinition,
  TopLevelRecordDefinition
>;

export type DisplayJSONTypeNode = DisplayJSONNodeBase<
  DisplayJSONNodeTypes.Type,
  TypeDefinition
>;

export type DisplayJSONExpandedTypeNode =
  DisplayJSONNodeBase<DisplayJSONNodeTypes.ExpandedType>;

export type DisplayJSONFunctionNode =
  DisplayJSONNodeBase<DisplayJSONNodeTypes.Function>;

export type DisplayJSONParametersNode =
  DisplayJSONNodeBase<DisplayJSONNodeTypes.Parameters>;

export type DisplayJSONObjectNode =
  DisplayJSONNodeBase<DisplayJSONNodeTypes.Object>;

export type DisplayJSONArrayNode =
  DisplayJSONNodeBase<DisplayJSONNodeTypes.Array>;

export type DisplayJSONCommentedNode =
  DisplayJSONNodeBase<DisplayJSONNodeTypes.CommentedNode>;

export type DisplayJSONCommentNode<Type extends DisplayJSONNodeTypes> =
  DisplayJSONNodeBase<Type, Comment>;

export type DisplayJSONCommentLineNode =
  DisplayJSONCommentNode<DisplayJSONNodeTypes.CommentLine>;

export type DisplayJSONCommentBlockNode =
  DisplayJSONCommentNode<DisplayJSONNodeTypes.CommentBlock>;

export type DisplayJSONQuoteNode<Type extends DisplayJSONNodeTypes> =
  DisplayJSONNodeBase<Type, StringValue>;

export type DisplayJSONDoubleQuoteNode =
  DisplayJSONQuoteNode<DisplayJSONNodeTypes.DoubleQuote>;

export type DisplayJSONSingleQuoteNode =
  DisplayJSONQuoteNode<DisplayJSONNodeTypes.SingleQuote>;

export type DisplayJSONBacktickQuoteNode =
  DisplayJSONQuoteNode<DisplayJSONNodeTypes.BacktickQuote>;

export type dCommented<Node> = DisplayJSONCommentedNode | Node;
export type dRecord = dCommented<DisplayJSONRecordNode>;
export type dRecordDefinition = dCommented<
  DisplayJSONRecordDefinitionNode | DisplayJSONTopLevelRecordDefinitionNode
>;
export type dInnerValue = dType | dFunction | dLiteral;
export type dLiteral = dCommented<DisplayJSONQuoteNode<any>>;
export type dType = dCommented<DisplayJSONExpandedTypeNode>;
export type dFunction = dCommented<DisplayJSONFunctionNode>;
export type dObject = DisplayJSONObjectNode;
export type dArray = DisplayJSONArrayNode;
export type dComment = DisplayJSONCommentNode<any>;
