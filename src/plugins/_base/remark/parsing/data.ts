import { EscapeHatch } from '../escape-hatch';
import { RemarkNode } from '../../core/nodes';
import BaseParser from './parser';
import { ParseTree } from './praser-tree';

export type ParserData<
  Units extends string,
  NodeType extends RemarkNode<any, Units>,
  LayerData = { [key: string]: any },
  Extra extends object = any,
  Parser extends BaseParser<Units, NodeType, any, Extra> = BaseParser<
    Units,
    NodeType,
    any,
    Extra
  >,
  ParentConfig = { [key: string]: any },
> = {
  parser: Parser;
  escapeHatch: EscapeHatch;
  layerData: LayerData;
  parentConfig: ParentConfig;
  _parseTreeLeaves: ParseTree<Units, NodeType>[];
  extra: Extra;
};
