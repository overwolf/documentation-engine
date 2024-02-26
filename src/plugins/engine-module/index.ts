import type { Plugin, LoadContext } from '@docusaurus/types';
import { listFiles, pathToPagePath } from '../../utils/server/file-utils';
import path from 'path';
import { PluginBase } from '../_base';

export default function engineModulePlugin(
  context: LoadContext,
): Plugin<string[]> {
  const { siteDir } = context;
  const name = 'documentation-website';

  // const pathToPages = path.join(siteDir, '../', 'src', 'pages');

  return {
    ...PluginBase(name),

    getThemePath() {
      return path.join(siteDir, '../', 'src', 'theme');
    },
    getTypeScriptThemePath() {
      return path.join(siteDir, '../', 'src', 'theme');
    },
  };
}
