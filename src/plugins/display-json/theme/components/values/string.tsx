import React from 'react';
import { DisplayJSONReactNode } from '../../../core/node';
import { DisplayJSONUnits } from '../../../core/units';
import { classnames } from '../..';

const StringNode: DisplayJSONReactNode<DisplayJSONUnits._v_string> = ({
  sequence,
}) => {
  const { start, content, end } = sequence;
  return (
    <>
      <span className={classnames['string-quotes']}>{start}</span>
      {content}
      <span className={classnames['string-quotes']}>{end}</span>
    </>
  );
};

export default StringNode;
