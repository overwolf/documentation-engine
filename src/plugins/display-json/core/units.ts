/* eslint-disable no-unused-vars */
export const enum DisplayJSONUnits {
  // Group of records (aka a full block)
  _root = '_root',
  // Syntax
  _s_assignment = '_s_assignment',
  // Literal (possibly generic) Values
  _array = '_array',
  _object = '_object',
  _callback = '_callback',
  _parameters = '_parameters',
  _union = '_union',
  _name_literal = '_name_literal',
  // Structures
  Name = 'Name',
  _value = '_value',
  _record = '_record',
  _field = '_field',
  _generic = '_generic',
  // Values
  _v_linked = '_v_linked',
  _v_primitive = '_v_primitive',
  _v_literal = '_v_literal',
  _v_string = '_v_string',
  // Records
  _r_ow_e_event = '_r_ow_e_event',
  _r_ow_p_event = '_r_ow_p_event',
  _r_gep_info = '_r_gep_info',
  _r_gep_event = '_r_gep_event',
  _r_function = '_r_function',
  _r_variable = '_r_variable',
  // Comments
  _commented = '_commented',
  Comment = 'Comment',
  // Ignored signs
  KeepLiteral = 'KeepLiteral',
  Skip = 'Skip',
}
