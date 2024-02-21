import React from 'react';
import { DisplayJSONReactNode } from '../../core/node';
import { DisplayJSONUnits } from '../../core/units';

const ValueNode: DisplayJSONReactNode<DisplayJSONUnits._value> = ({
  children,
}) => {
  return <>{children}</>;
};

export default ValueNode;
