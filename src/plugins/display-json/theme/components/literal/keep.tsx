import React from 'react';
import { DisplayJSONReactNode } from '../../../core/node';
import { DisplayJSONUnits } from '../../../core/units';

const KeepLiteralNode: DisplayJSONReactNode<DisplayJSONUnits.KeepLiteral> = ({
  children,
  content
}) => <>{children}</>;

export default KeepLiteralNode;
