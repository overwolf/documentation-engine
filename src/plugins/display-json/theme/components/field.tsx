import React from 'react';
import { DisplayJSONReactNode } from '../../core/node';
import { DisplayJSONUnits } from '../../core/units';

const FieldNode: DisplayJSONReactNode<DisplayJSONUnits._field> = ({
  children,
}) => <>{children}</>;

export default FieldNode;
