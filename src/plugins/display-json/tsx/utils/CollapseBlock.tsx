import React, { useContext, useState } from 'react';
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
  const hasChildren = !!children;
  const [open, setOpen] = useState(hasChildren);
  const childArray = ToChildArray(children);
  const separated = childArray.map((child, index) => {
    return (
      <>
        <Indent />
        {child}
        {childArray.length !== index + 1 && <Comma />}
        <NewLine />
      </>
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
        onClick={() => setOpen(hasChildren && !open)}
      >
        {hasChildren && <Expand open={open} />}
        {opening}
      </span>
      <span style={{ display: open ? '' : 'none' }}>
        <NewLine />
        <IndentProvider>{separated}</IndentProvider>
        <Indent />
      </span>
      <span
        className={classnames.collapsed}
        onClick={() => setOpen(hasChildren && true)}
        style={{ display: open ? 'none' : '' }}
      >
        {separated}
      </span>
      <span
        className={classnames.closing}
        onClick={() => setOpen(hasChildren && !open)}
      >
        {closing}
      </span>
    </span>
  );
}

export default CollapseBlock;
