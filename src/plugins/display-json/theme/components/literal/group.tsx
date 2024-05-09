import React from 'react';
import { DisplayJSONReactNode } from '../../../core/node';
import { DisplayJSONUnits } from '../../../core/units';
import CollapseBlock from '../../../tsx/utils/CollapseBlock';

const GroupNode: DisplayJSONReactNode<DisplayJSONUnits._group> = ({
  children,
  brackets: { opening, closing },
}) => {
  return (
    <CollapseBlock opening={opening} closing={closing}>
      {children}
    </CollapseBlock>
  );
};

export default GroupNode;
