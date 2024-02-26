import React from 'react';
import { DisplayJSONReactNode } from '../../core/node';
import { DisplayJSONUnits } from '../../core/units';

const RecordNode: DisplayJSONReactNode<DisplayJSONUnits._record> = ({
  children,
}) => <>{children}</>;

export default RecordNode;
