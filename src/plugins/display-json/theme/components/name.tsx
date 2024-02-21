import React from 'react';
import { DisplayJSONReactNode } from '../../core/node';
import { DisplayJSONUnits } from '../../core/units';

const NameNode: DisplayJSONReactNode<DisplayJSONUnits.Name> = ({
  children,
}) => <>{children}</>;

export default NameNode;
