import React from 'react';
import { DisplayJSONReactNode } from '../../../core/node';
import { DisplayJSONUnits } from '../../../core/units';
import { classnames } from '../..';

const GEPInfoNode: DisplayJSONReactNode<DisplayJSONUnits._r_gep_info> = ({
  children,
}) => (
  <>
    <span className={classnames['record-type']}>{'GEP_Info'}</span> {children}
  </>
);

export default GEPInfoNode;
