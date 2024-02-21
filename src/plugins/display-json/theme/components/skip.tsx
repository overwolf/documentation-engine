import React from 'react';
import { DisplayJSONReactNode } from '../../core/node';
import { DisplayJSONUnits } from '../../core/units';

const SkipNode: DisplayJSONReactNode<DisplayJSONUnits.Skip> = ({
  children,
}) => <>{children}</>;

export default SkipNode;
