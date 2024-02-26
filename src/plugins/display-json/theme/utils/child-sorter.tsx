import React, { Fragment, ReactElement, ReactNode } from 'react';
import NewLine from '../../tsx/syntactic/NewLine';
import { DisplayJSONUnits } from '../../core/units';
import { DisplayJSONReactNode, mdxTypeFromUnit } from '../../core/node';
import Indent from '../../tsx/utils/Indent';

type Transform = (child: ReactElement) => ReactElement;

export const childSorter = (children: ReactNode): ReactElement[] => {
  return React.Children.toArray(children) as ReactElement[];
};

export const splitChildren = (
  child: ReactNode,
  callback: (lastValue: ReactNode, key: number) => ReactNode,
) => {
  const result = [];
  const children = childSorter(child);
  for (let i = 0; i < children.length - 1; i++) {
    result.push(callback(children[i], i));
  }

  result.push(children[children.length - 1]);

  return result;
};

export const separeateNewline = (children: ReactNode) =>
  splitChildren(children, (child, key) => (
    <Fragment key={key}>
      {child}
      <NewLine />
      <Indent />
    </Fragment>
  ));

type MDXProps = {
  mdxType: string;
  parentName: string;
};

export const transformChild = (
  children: ReactNode,
  unit: DisplayJSONUnits,
  transform: Transform,
) => {
  const sorted = childSorter(children);
  const childIndex = sorted.findIndex(isChildType(unit));
  if (childIndex !== -1) {
    sorted[childIndex] = transform(sorted[childIndex]);
    return sorted;
  }

  console.log(sorted.find(transformIfCommentedChildType(unit, transform)));
  return sorted;
};

export const isChildType =
  (unit: DisplayJSONUnits) => (child: ReactElement) => {
    return (child.props as MDXProps).mdxType === mdxTypeFromUnit(unit);
  };

export const transformIfCommentedChildType =
  (unit: DisplayJSONUnits, transform: Transform) => (child: ReactElement) => {
    if (!isChildType(DisplayJSONUnits._commented)(child)) return false;
    const props = child.props as Parameters<
      DisplayJSONReactNode<DisplayJSONUnits._commented>
    >[0];
    if (!props.hasContent) return false;
    const sorted = childSorter(props.children);
    const lastChild = sorted[sorted.length - 1];
    if (!isChildType(unit)(lastChild)) return false;
    sorted[sorted.length - 1] = transform(lastChild);
    // props.children = sorted;
    return true;
  };
