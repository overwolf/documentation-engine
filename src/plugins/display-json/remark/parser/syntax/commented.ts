import { DJNB, createDisplayJSONNode } from '../../../core/node';
import { DisplayJSONUnits } from '../../../core/units';
import { CarriedOver } from '../utils/carry-over';

export type CommentedData = {
  hasContent: boolean;
};

export const CreateCommentedNode = <NodeType extends DisplayJSONUnits>(
  commented: [
    ...CarriedOver<NodeType>[],
    DJNB<NodeType> | DJNB<DisplayJSONUnits.KeepLiteral>,
  ],
) =>
  createDisplayJSONNode(
    DisplayJSONUnits._commented,
    {
      hasContent:
        commented[commented.length - 1].type !== 'DisplayJSON => Comment',
    },
    commented,
  );
