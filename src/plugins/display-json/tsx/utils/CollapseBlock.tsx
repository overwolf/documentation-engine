import React, { Fragment, useContext, useState } from 'react';
import { DisplayJSONPropsChildren } from '../../types/DisplayJSONProperties';
import Comma from '../syntactic/Comma';
import NewLine from '../syntactic/NewLine';
import Expand from '../syntactic/Expand';
import Indent from './Indent';
import { ToChildArray } from './ChildValidation';
import { IndentContext, IndentProvider } from './IndentContext';
import DisplayJSONConfig from '../../config/DisplayJSONConfig';
import { classnames } from '../../theme';
import clsx from 'clsx';

function CollapseBlock(
  props: DisplayJSONPropsChildren<{ opening: string; closing: string }>,
) {
  const { opening, children, closing } = props;
  const [open, setOpen] = useState(true);
  const childArray = ToChildArray(children);
  const separated = childArray.map((child, index) => {
    return (
      <Fragment key={index}>
        <Indent />
        {child}
        {childArray.length !== index + 1 && <Comma />}
        <NewLine />
      </Fragment>
    );
  });
  const indentCount =
    (useContext(IndentContext) / DisplayJSONConfig.indent) % 3;

  // ---------------------------------------------------------------------------

  return (
    <span className={classnames[['first', 'second', 'third'][indentCount]]}>
      <span
        className={clsx(classnames.opening, {
          open,
        })}
        onClick={() => setOpen(!open)}
      >
        <Expand open={open} />
        {opening}
      </span>
      <span style={{ display: open ? '' : 'none' }}>
        <NewLine />
        <IndentProvider>{separated}</IndentProvider>
        <Indent />
      </span>
      <span
        className={classnames.collapsed}
        onClick={() => setOpen(true)}
        style={{ display: open ? 'none' : '' }}
      >
        {separated}
      </span>
      <span className={classnames.closing} onClick={() => setOpen(!open)}>
        {closing}
      </span>
    </span>
  );
}

export default CollapseBlock;
