import type { Plugin } from '@docusaurus/types';
import { listFiles, pathToPagePath } from '../../utils/server/file-utils';
import path from 'path';
import { PluginBase } from '../_base';

const pathToPages = path.join('../', 'src', 'pages');

export default function themeSearchAlgolia(): Plugin<string[]> {
  const name = 'documentation-website';

  return {
    ...PluginBase(name),

    getThemePath() {
      return '../../../../src/theme';
    },
    getTypeScriptThemePath() {
      return '../../../../src/theme';
    },

    loadContent() {
      return listFiles(pathToPages, ['.tsx']);
    },

    contentLoaded({ content, actions: { addRoute } }) {
      content.forEach((page) =>
        addRoute({
          path: pathToPagePath(path.relative(pathToPages, page)),
          component: page,
          exact: true,
        }),
      );
    },
  };
}
