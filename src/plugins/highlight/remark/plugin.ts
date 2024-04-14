import { closingTagFactory, deEscapeOpening, openingTagFactory } from './tags';
import pluginFactory from '../../_base/remark/plugins/plugin';
import { defaultOptions } from './options';
import { nodeType } from '../core/structure';

export const highlightPlugin = pluginFactory(
  nodeType,
  defaultOptions,
  openingTagFactory,
  closingTagFactory,
  deEscapeOpening,
  /* deEscapeClosing */ undefined,
  /* transformContent */ (options, content) => ({
    content: [content[0].replace(new RegExp(`^${options.openingTag}`), '')],
    extra: {},
  }),
  /* createContentNode */
);

export default highlightPlugin;
