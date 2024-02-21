import { FC, ReactNode } from 'react';
import transformObject from '../fp-ts/transform-object';

export type NodeProperties = object;
export type NodeChildren<Unit extends string> = readonly Unit[];
export type NodeConfig<Unit extends string> = {
  readonly name: string;
  readonly props: NodeProperties;
  readonly children: NodeChildren<Unit>;
};

export type UnitNodeConfig<Unit extends string> = {
  // eslint-disable-next-line no-unused-vars
  [key in Unit]: NodeConfig<Unit>;
};

export type UnitNodeProperties<
  Unit extends string,
  Dict extends UnitNodeConfig<Unit>,
> = Dict[Unit]['props'];

export type UnitNodeName<
  Unit extends string,
  Dict extends UnitNodeConfig<any>,
> = Dict[Unit]['name'];

export type UnitNodeChildren<
  Unit extends string,
  Dict extends UnitNodeConfig<Unit>,
> = Dict[Unit]['children'][number];

export type RemarkNode<
  Prefix extends string = any,
  Unit extends string = any,
  Dict extends UnitNodeConfig<Unit> = any,
> = ReturnType<typeof createRemarkNode<Prefix, Unit, Dict>>;

export type RemarkNodeData<
  Prefix extends string,
  Unit extends string,
  Dict extends UnitNodeConfig<any>,
> = readonly [
  Unit,
  UnitNodeProperties<Unit, Dict>,
  RemarkNode<Prefix, UnitNodeChildren<Unit, Dict>, Dict>[],
];

type MappedNames<
  Unit extends string,
  Dict extends UnitNodeConfig<Unit>,
> = Dict[Unit]['name'];

export function createRemarkNode<
  Prefix extends string,
  Unit extends string,
  Dict extends UnitNodeConfig<any>,
>(
  prefix: Prefix,
  dict: Dict,
  [unit, hProperties, children]: RemarkNodeData<Prefix, Unit, Dict>,
) {
  // This is in order to ensure no undefined optional nodes make it through
  const filtered: typeof children = children.filter(
    (child) => child !== undefined,
  );
  const result = {
    /** MDX-level type field for this node */
    type: `${prefix} => ${unit}` as const,
    /** Data to be passed along with this node */
    data: {
      /** The MDXProvider entry used to render this node */
      hName: createHName<Prefix, Unit, Dict>(prefix, dict, unit),
      /** The properties to pass to the rendered MDXProvider node */
      hProperties,
    },
    /** (OPTIONAL) list of child nodes */
    children: filtered,
  } as const;

  return result;
}

export function createHName<
  Prefix extends string,
  Unit extends string,
  Dict extends UnitNodeConfig<any>,
>(prefix: Prefix, dict: Dict, unit: Unit) {
  return `${prefix}${dict[unit].name as MappedNames<Unit, Dict>}` as const;
}

export type FunctionalReactNode<
  Prefix extends string = any,
  Unit extends string = any,
  Dict extends UnitNodeConfig<Unit> = any,
> = ReturnType<typeof createReactFunction<Prefix, Unit, Dict>>;

export function createReactFunction<
  Prefix extends string,
  Unit extends string,
  Dict extends UnitNodeConfig<any>,
>(
  _prefix: Prefix,
  _dict: Dict,
  [, hProperties]: RemarkNodeData<Prefix, Unit, Dict>,
) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return (p: typeof hProperties & { children: ReactNode }) =>
    null as ReturnType<FC>;
}

export type ReactNodeStructure<
  Prefix extends string,
  Unit extends string,
  Dict extends UnitNodeConfig<any>,
> = {
  [Key in Unit]: FunctionalReactNode<Prefix, Key, Dict>;
};

export function reactNodesToProvider<
  Prefix extends string,
  Units extends string,
  Dict extends UnitNodeConfig<any>,
>(
  prefix: Prefix,
  nodes: ReactNodeStructure<Prefix, Units, Dict>,
  transformer: <Unit extends string>(
    key: Unit,
    value: FunctionalReactNode<Prefix, Unit, Dict>,
  ) => FC,
  dict: Dict,
) {
  return transformObject<
    FunctionalReactNode<Prefix, Units, Dict>,
    FunctionalReactNode<Prefix, Units, Dict>
  >(nodes, transformer, (unit) => createHName(prefix, dict, unit));
}
