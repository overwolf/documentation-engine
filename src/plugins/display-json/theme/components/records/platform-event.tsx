import React from 'react';
import { DisplayJSONReactNode } from '../../../core/node';
import { DisplayJSONUnits } from '../../../core/units';
import { classnames } from '../..';

const PlatformEventNode: DisplayJSONReactNode<
  DisplayJSONUnits._r_ow_p_event
> = ({ children }) => (
  <>
    <span className={classnames['record-type']}>{'Overwolf Event'}</span>{' '}
    {children}
  </>
);
export default PlatformEventNode;
