import type { LoadContext, Plugin } from '@docusaurus/types';
import path from 'path';

export const pluginName = (name: string) => `overwolf-${name}`;
export const pluginAlias = (name: string) => `~${name}`;

/**
 * A method for creating all of the required boilerplate plugin fields
 *
 * @param {string} name - The name of the plugin
 * @returns {object} The required boilerplate plugin fields
 */
export function PluginBase<Data>(name: string): Plugin<Data> {
  return {
    name: pluginName(name),
  };
}

/**
 * A method for creating the plugin's data file resolution alias
 *
 * @param {string} name - The name of the plugin
 * @param {string} generatedFilesDir - The plugin's generated files directory
 * @returns {object} The plugin's data file resolution alias field
 */
export function PluginBaseAlias<Data>(
  name: string,
  { generatedFilesDir }: LoadContext,
): Partial<Plugin<Data>> {
  return {
    configureWebpack() {
      return {
        resolve: {
          alias: {
            [pluginAlias(name)]: path.join(
              generatedFilesDir,
              pluginName(name),
              'default',
            ),
          },
        },
      };
    },
  };
}

/**
 * A method for creating the plugin's theme paths
 *
 * @returns {object} The plugin's generated theme paths
 */
export function PluginBaseTheme<Data>(): Partial<Plugin<Data>> {
  return {
    getThemePath() {
      return './theme';
    },
    getTypeScriptThemePath() {
      return './theme';
    },
  };
}
