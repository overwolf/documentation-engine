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
 * The default turn to add this parser at
 */
export const DEFAULT_TURN = 'admonition';

/**
 * The base options object for ALL plugins
 */
export type BaseOptions = {
  escapeHatchPath?: string;
};
