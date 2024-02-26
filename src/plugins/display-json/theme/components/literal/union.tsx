import React from 'react';
import { DisplayJSONReactNode } from '../../../core/node';
import { DisplayJSONUnits } from '../../../core/units';

const UnionNode: DisplayJSONReactNode<DisplayJSONUnits._union> = ({
  children,
}) => <>{children}</>;

export default UnionNode;
