import {
  closingTagFactory,
  deEscapeClosing,
  deEscapeOpening,
  openingTagFactory,
} from './tags';
import { createContentNode } from './create';
import pluginFactory from '../../_base/remark/plugins/plugin';
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

export default displayJSONPlugin;
