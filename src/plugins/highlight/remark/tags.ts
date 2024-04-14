import {
  ClosingTagFactory,
  DeEscapeOpening,
  OpeningTagFactory,
} from '../../_base/remark/plugins/plugin';
import { IGNORE_ENDING_TAG } from '../../_base/remark/plugins/plugin-defaults';
import { HighlightOptions } from './options';

/* IMPORTANT - Make sure not to try to match for line-end here,
   since the lines this will run on are split into strings already */
export const openingTagFactory: OpeningTagFactory<HighlightOptions> = (
  options: HighlightOptions,
  tags: string,
) =>
  new RegExp(
    `^(?<!${options.escapeString})${options.openingTag}\\b(${tags})\\b`,
  );

/* IMPORTANT - Make sure not to try to match for line-end here,
   since the lines this will run on are split into strings already */
export const closingTagFactory: ClosingTagFactory<HighlightOptions> = (
  _options: HighlightOptions,
) => IGNORE_ENDING_TAG;

export const deEscapeOpening: DeEscapeOpening<HighlightOptions> = (
  options: HighlightOptions,
  escaped: string,
  tags: string,
) =>
  escaped.replace(
    `${options.escapeString}(${options.openingTag}\\b${tags}\\b)`,
    '$1',
  );
