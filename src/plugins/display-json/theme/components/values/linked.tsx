import React from 'react';
import { DisplayJSONReactNode } from '../../../core/node';
import { DisplayJSONUnits } from '../../../core/units';

const LinkedNode: DisplayJSONReactNode<DisplayJSONUnits._v_linked> = ({
  value, // name
  children, // optional generic
}) => (
  <>
    {value}
    {children}
  </>
);

export default LinkedNode;
