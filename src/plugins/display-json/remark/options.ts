import {
  BasePluginOptions,
  PLUGIN_TYPE,
} from '../../_base/remark/plugins/plugin';
import { DisplayJSONUnits } from '../core/units';
import commentBlock, {
  commentBlockRich,
} from '../../_base/remark/escaping/sequences/comment-block';
import quoteSingle from '../../_base/remark/escaping/sequences/quote-single';
import quoteDouble from '../../_base/remark/escaping/sequences/quote-double';
import quoteBacktick from '../../_base/remark/escaping/sequences/quote-backtick';
import commentLine from '../../_base/remark/escaping/sequences/comment-line';

export const defaultOptions = {
  escapeHatchPath: './.docusaurus/display-json',
  openingTag: '!JSON' as string,
  closingTag: '/JSON' as string,
  includeOpening: false as boolean,
  includeClosing: false as boolean,
  parseContent: false as boolean,
  primitives: [
    'any',
    'void',
    'string',
    'boolean',
    'number',
    'true',
    'false',
    'null',
  ] as string[],
  records: [
    DisplayJSONUnits._r_function,
    DisplayJSONUnits._r_gep_event,
    DisplayJSONUnits._r_gep_info,
    DisplayJSONUnits._r_ow_e_event,
    DisplayJSONUnits._r_ow_p_event,
    DisplayJSONUnits._r_variable,
  ] as DisplayJSONUnits[],
  values: [
    DisplayJSONUnits._v_string,
    DisplayJSONUnits._v_primitive,
    DisplayJSONUnits._v_literal,
    DisplayJSONUnits._v_linked,
  ] as DisplayJSONUnits[],
  blocks: [
    {
      openingTag: '{',
      closingTag: '}',
      blockType: 'Object',
    },
    {
      openingTag: '[',
      closingTag: ']',
      blockType: 'Array',
    },
    {
      openingTag: '(',
      closingTag: ')',
      blockType: 'Params',
    },
    {
      openingTag: '<',
      closingTag: '>',
      blockType: 'Generic',
    },
  ] as BlockDefinition[],
  escapeSequences: [
    commentBlockRich,
    commentBlock,
    quoteSingle,
    quoteDouble,
    quoteBacktick,
    commentLine,
  ] as const,
  pluginType: {
    block: true,
  } as PLUGIN_TYPE,
};

export type DisplayJSONOptions = Options<typeof defaultOptions>;

export type BlockDefinition = {
  openingTag: string;
  closingTag: string;
  blockType: BracketTypes;
};

export type BracketTypes = 'Object' | 'Array' | 'Params' | 'Generic';

/** Convenience guard type & redundancy to make typescript not error */
type Options<T extends BasePluginOptions> = T & BasePluginOptions;
