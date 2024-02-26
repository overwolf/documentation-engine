import React from 'react';
import { DisplayJSONReactNode } from '../../core/node';
import { DisplayJSONUnits } from '../../core/units';
import Space from '../../tsx/syntactic/Space';

const AssignmentNode: DisplayJSONReactNode<DisplayJSONUnits._s_assignment> = ({
  value,
  optional,
}) => (
  <>
    {value !== ':' && <Space />}
    {optional ? '?' : ''}
    {value}
    <Space />
  </>
);

export default AssignmentNode;
