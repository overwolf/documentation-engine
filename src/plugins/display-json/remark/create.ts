import { CreateContentNode } from '../../_base/remark/plugins/plugin';
import { DisplayJSONNode } from '../types/display-json-node';
import { DisplayJSONOptions } from './options';
import { EscapeHatchEntry } from '../../_base/remark/escape-hatch';
import DisplayJSONParser, { Content } from './parser/parser';
import skip from '../../_base/fp-ts/skip';
import { DisplayJSONUnits } from '../core/units';
import { fold } from 'fp-ts/lib/Either';

// Where we would transform the
export const createContentNode: CreateContentNode<
  DisplayJSONOptions,
  Content
> = (
  options: DisplayJSONOptions,
  content: Content[],
  escapeHatch: (...entries: EscapeHatchEntry[]) => void,
  matchGroups: string[],
): DisplayJSONNode => {
  // eslint-disable-next-line prettier/prettier
  const [/* full */, name] = matchGroups as [string, string];
  /** A flat `string[]` of all "safe to use" strings */

  const t = new DisplayJSONParser(content, skip, options);
  // TODO - add support for name field
  const result = t.ParseUnitRoot(DisplayJSONUnits._root, escapeHatch, { name });
  return fold(
    (error) => {
      console.error(result.data._parseTreeLeaves);
      throw new Error(
        `Display json parse failed! ${JSON.stringify(
          error,
          undefined,
          2,
        )}. Full content: ${JSON.stringify(content, undefined, 2)}        
        Full parse trace: ${JSON.stringify(
          result.data._parseTreeLeaves,
          undefined,
          2,
        )}`,
      );
    },
    (node) => node,
  )(result.result);
};
