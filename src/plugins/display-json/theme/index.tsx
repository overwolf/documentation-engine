import {
  ReactNodeStructure,
  reactNodesToProvider,
} from '../../_base/core/nodes';
import { DisplayJSONUnits } from '../core/units';
import DisplayJSONStructure, { rootNodeType } from '../core/structure';
import React, { PropsWithChildren } from 'react';
import RootNode from './components/root';
import ArrayNode from './components/literal/array';
import ObjectNode from './components/literal/object';
import CallbackNode from './components/literal/callback';
import ParametersNode from './components/literal/parameters';
import UnionNode from './components/literal/union';
import LiteralNameNode from './components/literal/name';
import NameNode from './components/name';
import ValueNode from './components/value';
import RecordNode from './components/record';
import FieldNode from './components/field';
import GenericNode from './components/generic';
import LinkedNode from './components/values/linked';
import PrimitiveNode from './components/values/primitive';
import LiteralNode from './components/values/literal';
import StringNode from './components/values/string';
import ElectronEventNode from './components/records/electron-event';
import PlatformEventNode from './components/records/platform-event';
import GEPInfoNode from './components/records/gep-info';
import GEPEventNode from './components/records/gep-event';
import FunctionNode from './components/records/function';
import VariableNode from './components/records/variable';
import CommentedNode from './components/commented';
import CommentNode from './components/comment';
import KeepLiteralNode from './components/literal/keep';
import SkipNode from './components/skip';
import AssignmentNode from './components/assignment';
import classes from '../scss/root.module.scss';

export const classnames = classes;

const ReactComponents = {
  [DisplayJSONUnits._root]: RootNode,
  [DisplayJSONUnits._array]: ArrayNode,
  [DisplayJSONUnits._object]: ObjectNode,
  [DisplayJSONUnits._callback]: CallbackNode,
  [DisplayJSONUnits._parameters]: ParametersNode,
  [DisplayJSONUnits._union]: UnionNode,
  [DisplayJSONUnits._name_literal]: LiteralNameNode,
  [DisplayJSONUnits.Name]: NameNode,
  [DisplayJSONUnits._value]: ValueNode,
  [DisplayJSONUnits._record]: RecordNode,
  [DisplayJSONUnits._field]: FieldNode,
  [DisplayJSONUnits._generic]: GenericNode,
  [DisplayJSONUnits._v_linked]: LinkedNode,
  [DisplayJSONUnits._v_primitive]: PrimitiveNode,
  [DisplayJSONUnits._v_literal]: LiteralNode,
  [DisplayJSONUnits._v_string]: StringNode,
  [DisplayJSONUnits._r_ow_e_event]: ElectronEventNode,
  [DisplayJSONUnits._r_ow_p_event]: PlatformEventNode,
  [DisplayJSONUnits._r_gep_info]: GEPInfoNode,
  [DisplayJSONUnits._r_gep_event]: GEPEventNode,
  [DisplayJSONUnits._r_function]: FunctionNode,
  [DisplayJSONUnits._r_variable]: VariableNode,
  [DisplayJSONUnits._commented]: CommentedNode,
  [DisplayJSONUnits.Comment]: CommentNode,
  [DisplayJSONUnits.KeepLiteral]: KeepLiteralNode,
  [DisplayJSONUnits.Skip]: SkipNode,
  [DisplayJSONUnits._s_assignment]: AssignmentNode,
} as const;

// eslint-disable-next-line no-unused-vars
export const DisplayJSONClasses: { [key in DisplayJSONUnits]: string } = {
  [DisplayJSONUnits._root]: 'display-json',
  [DisplayJSONUnits._array]: 'array',
  [DisplayJSONUnits._object]: 'object',
  [DisplayJSONUnits._callback]: 'callback',
  [DisplayJSONUnits._parameters]: 'parameters',
  [DisplayJSONUnits._union]: 'union',
  [DisplayJSONUnits._name_literal]: 'name-literal',
  [DisplayJSONUnits.Name]: 'name',
  [DisplayJSONUnits._value]: 'value',
  [DisplayJSONUnits._record]: 'record',
  [DisplayJSONUnits._field]: 'field',
  [DisplayJSONUnits._generic]: 'generic',
  [DisplayJSONUnits._v_linked]: 'value-linked',
  [DisplayJSONUnits._v_primitive]: 'value-primitive',
  [DisplayJSONUnits._v_literal]: 'value-literal',
  [DisplayJSONUnits._v_string]: 'value-string',
  [DisplayJSONUnits._r_ow_e_event]: 'record-electron-event',
  [DisplayJSONUnits._r_ow_p_event]: 'record-platform-event',
  [DisplayJSONUnits._r_gep_info]: 'record-gep-info',
  [DisplayJSONUnits._r_gep_event]: 'record-gep-event',
  [DisplayJSONUnits._r_function]: 'record-function',
  [DisplayJSONUnits._r_variable]: 'record-variable',
  [DisplayJSONUnits._commented]: 'commented',
  [DisplayJSONUnits.Comment]: 'comment',
  [DisplayJSONUnits.KeepLiteral]: 'keep-literal',
  [DisplayJSONUnits.Skip]: 'skip',
  [DisplayJSONUnits._s_assignment]: 'assignment',
};

function DisplayJSONRenderNode(
  props: PropsWithChildren<{ className: string }>,
) {
  const { className, children } = props;
  return <span className={classes[className]}>{children}</span>;
}

export type ReactComponentsType = typeof ReactComponents;
export default reactNodesToProvider(
  rootNodeType,
  ReactComponents as ReactNodeStructure<
    typeof rootNodeType,
    DisplayJSONUnits,
    typeof DisplayJSONStructure
  >,
  (key, Value): typeof Value =>
    // eslint-disable-next-line react/display-name
    (props: any) =>
      (
        <DisplayJSONRenderNode
          className={DisplayJSONClasses[key as DisplayJSONUnits]}
        >
          <Value {...props} />
        </DisplayJSONRenderNode>
      ),
  DisplayJSONStructure,
);
