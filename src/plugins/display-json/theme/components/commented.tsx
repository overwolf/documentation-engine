import React from 'react';
import { DisplayJSONReactNode } from '../../core/node';
import { DisplayJSONUnits } from '../../core/units';
import { separeateNewline } from '../utils/child-sorter';

const CommentedNode: DisplayJSONReactNode<DisplayJSONUnits._commented> = ({
  children,
  hasContent,
}) => <>{separeateNewline(children)}</>;

export default CommentedNode;
