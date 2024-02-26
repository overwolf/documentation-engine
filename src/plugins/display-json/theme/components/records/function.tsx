import React from 'react';
import { DisplayJSONReactNode } from '../../../core/node';
import { DisplayJSONUnits } from '../../../core/units';
import { classnames } from '../..';

const FunctionNode: DisplayJSONReactNode<DisplayJSONUnits._r_function> = ({
  children,
  type,
}) => (
  <>
    <span className={classnames['record-type']}>{'function'}</span> {children}
  </>
);

export default FunctionNode;
