/**
 * Converts an unknown string into a properly escaped regex unit
 *
 * @param {string} input - The string to escape
 * @returns {string} A regex-ready literal version of this string
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#escaping
 */
export const stringToRegex = (input: string): string => {
  return input.replaceAll(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

export const stringsToRegex = (...inputs: string[]): string[] => {
  return inputs.map(stringToRegex);
};
