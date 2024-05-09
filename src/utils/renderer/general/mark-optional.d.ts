export type MarkOptional<Type extends object, Props extends keyof Type> = Omit<
  Type,
  Props
> &
  Partial<Pick<Type, Props>>;
