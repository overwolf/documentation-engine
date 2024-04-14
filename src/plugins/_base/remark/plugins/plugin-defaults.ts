import { PLUGIN_TYPE } from './plugin';

/**
 * The default line separator
 */
export const LINE_SEPARATOR = '\n';
// Comments here are after parsing, and map to \\\\ -> \\ -> \
/**
 * \\\\\\\\ -> \\\\ in the string -> \\ in the regex
 */
export const DEFAULT_ESCAPE = '\\\\';
/**
 * The default turn to add block parsers at
 */
export const DEFAULT_BLOCK_TURN = 'admonition';

/**
 * The default turn to add inline parsers at
 */
export const DEFAULT_INLINE_TURN = 'code';

/**
 * The default component name to use for a plugin
 */
export const DEFAULT_COMPONENT = 'Index';

export const DEFAULT_STRUCTURE = (nodeType: string, properties: any) => ({
  [nodeType]: {
    name: DEFAULT_COMPONENT,
    props: {
      rawContent: '' as unknown as (typeof properties)['rawContent'],
      extra: {} as object,
    },
    children: [] as any[],
  },
});

export const IGNORE_ENDING_TAG = /(?:)/;

/**
 * The base options object for ALL plugins
 */
export type BaseOptions = {
  escapeHatchPath?: string;
  pluginType: PLUGIN_TYPE;
};
