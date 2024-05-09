import clsx, { ClassValue } from 'clsx';
import { CSSProperties } from 'react';

export const enum DefaultVariants {
  NONE = 'none',
  DEFAULT = 'default',
}

export type BaseProps<Variants extends string> = {
  style?: CSSProperties;
  variant: Variants | DefaultVariants;
  extraClassNames?: ClassValue[];
};

export type StandardProps<
  Props extends object,
  Variants extends string = never,
> = Props & BaseProps<Variants>;

export const defaultStyle = 'default-style';

export function classNamer<Variants extends string>({
  classNames,
  variant,
  extraClassNames,
}: Omit<BaseProps<Variants>, 'style'> & { classNames: ClassValue }) {
  return clsx(classNames, variant, extraClassNames);
}
