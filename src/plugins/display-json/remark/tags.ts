import {
  ClosingTagFactory,
  DeEscapeClosing,
  DeEscapeOpening,
  OpeningTagFactory,
} from '../../_base/remark/plugins/plugin';
import { DisplayJSONOptions } from './options';

/* IMPORTANT - Make sure not to try to match for line-end here,
   since the lines this will run on are split into strings already */
export const openingTagFactory: OpeningTagFactory<DisplayJSONOptions> = (
  options: DisplayJSONOptions,
) =>
  new RegExp(
    `^(?<!${options.escapeString})${tagFuzzy(
      options.openingTag,
    )}(?: ([\\w\\.\\-]*))?`,
  );

/* IMPORTANT - Make sure not to try to match for line-end here,
   since the lines this will run on are split into strings already */
export const closingTagFactory: ClosingTagFactory<DisplayJSONOptions> = (
  options: DisplayJSONOptions,
) => new RegExp(`^(?<!${options.escapeString})${tagFuzzy(options.closingTag)}`);

export const deEscapeOpening: DeEscapeOpening<DisplayJSONOptions> = (
  options: DisplayJSONOptions,
  escaped: string,
) =>
  escaped.replace(
    `${options.escapeString}(${tagFuzzy(options.openingTag)})`,
    '$1',
  );

export const deEscapeClosing: DeEscapeClosing<DisplayJSONOptions> = (
  options: DisplayJSONOptions,
  escaped: string,
) =>
  escaped.replace(
    `${options.escapeString}(${tagFuzzy(options.openingTag)})`,
    '$1',
  );

function tagFuzzy(tag: string) {
  return `${tag}`;
}
