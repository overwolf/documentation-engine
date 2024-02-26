import React from 'react';
import { DisplayJSONReactNode } from '../../../core/node';
import { DisplayJSONUnits } from '../../../core/units';

const LiteralNameNode: DisplayJSONReactNode<DisplayJSONUnits._name_literal> = ({
  value,
}) => <>{value}</>;

export default LiteralNameNode;
