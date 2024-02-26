import React from 'react';
import { DisplayJSONReactNode } from '../../../core/node';
import { DisplayJSONUnits } from '../../../core/units';
import { classnames } from '../..';

const ElectronEventNode: DisplayJSONReactNode<
  DisplayJSONUnits._r_ow_e_event
> = ({ children }) => (
  <>
    <span className={classnames['record-type']}>{'Electron Event'}</span>{' '}
    {children}
  </>
);

export default ElectronEventNode;
