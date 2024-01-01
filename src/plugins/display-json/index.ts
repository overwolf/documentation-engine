import type { LoadContext, Plugin } from '@docusaurus/types';
import { PluginBase, PluginBaseAlias, PluginBaseTheme } from '../_base';

export default function themeSearchAlgolia(
  context: LoadContext,
): Plugin<string[]> {
  const name = 'display-json';

  return {
    ...PluginBase(name),
    ...PluginBaseAlias(name, context),
    ...PluginBaseTheme(),
  };
}
