import React from 'react';
import { DisplayJSONReactNode } from '../../../core/node';
import { DisplayJSONUnits } from '../../../core/units';
import { classnames } from '../..';

const VariableNode: DisplayJSONReactNode<DisplayJSONUnits._r_variable> = ({
  children,
  type,
}) => (
  <>
    <span className={classnames['record-type']}>{type}</span> {children}
  </>
);

export default VariableNode;
