import React from 'react';
import { DisplayJSONReactNode } from '../../core/node';
import { DisplayJSONUnits } from '../../core/units';
import CollapseBlock from '../../tsx/utils/CollapseBlock';

const GenericNode: DisplayJSONReactNode<DisplayJSONUnits._generic> = ({
  children,
  brackets: { opening, closing },
}) => {
  return (
    <CollapseBlock opening={opening} closing={closing}>
      {children}
    </CollapseBlock>
  );
};

export default GenericNode;
