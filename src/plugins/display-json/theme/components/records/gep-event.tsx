import React from 'react';
import { DisplayJSONReactNode } from '../../../core/node';
import { DisplayJSONUnits } from '../../../core/units';
import { classnames } from '../..';

const GEPEventNode: DisplayJSONReactNode<DisplayJSONUnits._r_gep_event> = ({
  children,
}) => (
  <>
    <span className={classnames['record-type']}>{'GEP_Event'}</span> {children}
  </>
);

export default GEPEventNode;
