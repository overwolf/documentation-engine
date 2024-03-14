import { UnitNodeConfig } from '../../_base/core/nodes';
import {
  EscapedSequence,
  EscapedSyntax,
} from '../../_base/remark/escaping/sequence';
import { DisplayJSONUnits } from './units';

export const rootNodeType = 'DisplayJSON';
export const assignmentValue = [':', '=', '=>'] as const;
export type AssignmentValueType = (typeof assignmentValue)[number];

type NoValue = Record<string, never>;
const Commented = DisplayJSONUnits._commented;
const Brackets = {
  opening: '' as string,
  closing: '' as string,
} as const;

const DisplayJSONStructure = {
  [DisplayJSONUnits._root]: {
    name: 'Root',
    props: { name: '' as string, id: '' as string },
    children: [Commented, DisplayJSONUnits._record],
  },
  [DisplayJSONUnits._array]: {
    name: 'Array',
    props: { brackets: Brackets },
    children: [Commented, DisplayJSONUnits._value],
  },
  [DisplayJSONUnits._object]: {
    name: 'Object',
    props: { brackets: Brackets },
    children: [Commented, DisplayJSONUnits._field],
  },
  [DisplayJSONUnits._callback]: {
    name: 'Callback',
    props: {} as NoValue,
    children: [
      Commented,
      DisplayJSONUnits._parameters,
      DisplayJSONUnits._s_assignment,
      DisplayJSONUnits._value,
    ],
  },
  [DisplayJSONUnits._parameters]: {
    name: 'Parameters',
    props: { brackets: Brackets },
    children: [Commented, DisplayJSONUnits._field],
  },
  [DisplayJSONUnits._union]: {
    name: 'Union',
    props: { brackets: Brackets },
    children: [],
  },
  [DisplayJSONUnits._name_literal]: {
    name: 'NameLiteral',
    props: { value: '' as string },
    children: [],
  },
  [DisplayJSONUnits.Name]: {
    name: 'Name',
    props: {} as NoValue,
    children: [DisplayJSONUnits._name_literal, DisplayJSONUnits._v_string],
  },
  [DisplayJSONUnits._value]: {
    name: 'Value',
    props: {} as NoValue,
    children: [] as DisplayJSONUnits[],
  },
  [DisplayJSONUnits._record]: {
    name: 'Record',
    props: {} as NoValue,
    children: [] as DisplayJSONUnits[],
  },
  [DisplayJSONUnits._field]: {
    name: 'Field',
    props: {} as NoValue,
    children: [
      Commented,
      DisplayJSONUnits.Name,
      DisplayJSONUnits._s_assignment,
      DisplayJSONUnits._value,
    ],
  },
  [DisplayJSONUnits._generic]: {
    name: 'Generic',
    props: { brackets: Brackets },
    children: [Commented, DisplayJSONUnits._value],
  },
  [DisplayJSONUnits._v_linked]: {
    name: 'Linked',
    props: {} as NoValue,
    children: [DisplayJSONUnits._generic, DisplayJSONUnits._name_literal],
  },
  [DisplayJSONUnits._v_primitive]: {
    name: 'Primitive',
    props: { value: '' as string },
    children: [],
  },
  [DisplayJSONUnits._v_literal]: {
    name: 'Literal',
    props: {} as NoValue,
    children: [
      DisplayJSONUnits._generic,
      DisplayJSONUnits._union,
      DisplayJSONUnits._array,
      DisplayJSONUnits._callback,
      DisplayJSONUnits._object,
    ],
  },
  [DisplayJSONUnits._v_string]: {
    name: 'String',
    props: {
      sequence: {} as EscapedSequence<EscapedSyntax, any>,
    },
    children: [],
  },
  [DisplayJSONUnits._r_ow_e_event]: {
    name: 'RecordOWEEvent',
    props: {} as NoValue,
    children: [
      Commented,
      DisplayJSONUnits._name_literal,
      DisplayJSONUnits._s_assignment,
      DisplayJSONUnits._value,
    ],
  },
  [DisplayJSONUnits._r_ow_p_event]: {
    name: 'RecordOWPEvent',
    props: {} as NoValue,
    children: [
      Commented,
      DisplayJSONUnits._name_literal,
      DisplayJSONUnits._s_assignment,
      DisplayJSONUnits._value,
    ],
  },
  [DisplayJSONUnits._r_gep_info]: {
    name: 'RecordGEPInfo',
    props: {} as NoValue,
    children: [
      Commented,
      DisplayJSONUnits._name_literal,
      DisplayJSONUnits._s_assignment,
      DisplayJSONUnits._value,
    ],
  },
  [DisplayJSONUnits._r_gep_event]: {
    name: 'RecordGEPEvent',
    props: {} as NoValue,
    children: [
      Commented,
      DisplayJSONUnits._name_literal,
      DisplayJSONUnits._s_assignment,
      DisplayJSONUnits._value,
    ],
  },
  [DisplayJSONUnits._r_function]: {
    name: 'RecordFunction',
    props: { type: '' as string },
    children: [DisplayJSONUnits._name_literal, DisplayJSONUnits._callback],
  },
  [DisplayJSONUnits._r_variable]: {
    name: 'Variable',
    props: { type: '' as string },
    children: [DisplayJSONUnits._field],
  },
  [DisplayJSONUnits._commented]: {
    name: 'Commented',
    props: { hasContent: true as boolean },
    children: [
      DisplayJSONUnits.Comment,
      DisplayJSONUnits.KeepLiteral,
    ] as DisplayJSONUnits[],
  },
  [DisplayJSONUnits.Comment]: {
    name: 'Comment',
    props: {
      sequence: {} as EscapedSequence<EscapedSyntax, any>,
    },
    children: [],
  } as const,
  [DisplayJSONUnits.KeepLiteral]: {
    name: 'KeepLiteral',
    props: { content: '' as string },
    children: [],
  },
  [DisplayJSONUnits.Skip]: {
    name: 'Skip',
    props: {} as NoValue,
    children: [],
  },
  [DisplayJSONUnits._s_assignment]: {
    name: 'Assignment',
    props: { value: '' as AssignmentValueType, optional: false as boolean },
    children: [],
  },
} as const;

export type DisplayJSONStructureType = typeof DisplayJSONStructure;
export default DisplayJSONStructure as UnitNodeConfig<DisplayJSONUnits>;
