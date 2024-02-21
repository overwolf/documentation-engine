import React from 'react';
import { DisplayJSONReactNode } from '../../../core/node';
import { DisplayJSONUnits } from '../../../core/units';

const LiteralNode: DisplayJSONReactNode<DisplayJSONUnits._v_literal> = ({
  children, // literal definition
}) => <>{children}</>;

export default LiteralNode;
