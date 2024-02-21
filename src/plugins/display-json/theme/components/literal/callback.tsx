import React from 'react';
import { DisplayJSONReactNode } from '../../../core/node';
import { DisplayJSONUnits } from '../../../core/units';

const CallbackNode: DisplayJSONReactNode<DisplayJSONUnits._callback> = ({
  children,
}) => <>{children}</>;

export default CallbackNode;
