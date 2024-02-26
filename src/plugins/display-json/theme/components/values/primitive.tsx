import React from 'react';
import { DisplayJSONReactNode } from '../../../core/node';
import { DisplayJSONUnits } from '../../../core/units';

const PrimitiveNode: DisplayJSONReactNode<DisplayJSONUnits._v_primitive> = ({
  value, // name
  children, // optional generic
}) => (
  <>
    {value}
    {children}
  </>
);

export default PrimitiveNode;
