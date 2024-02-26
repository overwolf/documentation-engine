import React from 'react';
import { DisplayJSONReactNode } from '../../core/node';
import { DisplayJSONUnits } from '../../core/units';
import { separeateNewline } from '../utils/child-sorter';
import { classnames } from '..';

const RootNode: DisplayJSONReactNode<DisplayJSONUnits._root> = ({
  children,
  name,
}) => (
  <pre className={classnames.root}>
    <div className={classnames.title}>{name}</div>
    <code>{separeateNewline(children)}</code>
  </pre>
);

export default RootNode;
