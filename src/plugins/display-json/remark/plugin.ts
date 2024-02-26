import {
  closingTagFactory,
  deEscapeClosing,
  deEscapeOpening,
  openingTagFactory,
} from './tags';
import { createContentNode } from './create';
import pluginFactory from '../../_base/remark/plugins/plugin-block';
import { defaultOptions } from './options';
import { transformContent } from './content';
import { rootNodeType } from '../core/structure';

export const displayJSONPlugin = pluginFactory(
  rootNodeType,
  defaultOptions,
  openingTagFactory,
  closingTagFactory,
  deEscapeOpening,
  deEscapeClosing,
  transformContent,
  createContentNode,
);

/* The plugin can transform the content here before passing it to further
   parsing, either the plugins' or remarks' */

/* TODO: Make this flow optionally support escapeSequences + the escape
   registry, so we can move pre-parse logic here */

/* const contentTransformm: ContentTransform<DisplayJSONOptions> = (
  options: DisplayJSONOptions,
  content: string[]
) => {
  
} */

export default displayJSONPlugin;
