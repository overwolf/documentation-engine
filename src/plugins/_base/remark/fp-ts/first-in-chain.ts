import { flow } from 'fp-ts/lib/function';
import {
  RecursiveTryParse,
  extractData,
  setUpData,
  tryParseUnit,
} from './try-parse';
import { RemarkNode } from '../../core/nodes';

export type FirstInChainFlags = {
  disabled?: boolean;
  allowRewind?: boolean;
};

const firstInChain = <Units extends string, NodeType extends RemarkNode>(
  units: (Units | [Units, FirstInChainFlags])[],
) =>
  flow(
    setUpData<Units, NodeType>,
    (setup) =>
      units
        // eslint-disable-next-line array-callback-return
        .map((value) => {
          if (typeof value !== 'string' && typeof value === 'object') {
            if (!value[1].disabled)
              return { unit: value[0], allowRewind: value[1].allowRewind };
          } else return { unit: value, allowRewind: false };
        })
        .filter((value) => value !== undefined)
        .map((params) =>
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          tryParseUnit<Units, NodeType>(params!.unit, params!.allowRewind),
        )
        .reduce(
          (result, parse) =>
            parse(result) as RecursiveTryParse<Units, NodeType>,
          setup,
        ),
    extractData<Units, NodeType>,
  );

export default firstInChain;
