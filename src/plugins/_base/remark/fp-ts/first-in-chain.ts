import { flow } from 'fp-ts/lib/function';
import {
  RecursiveTryParse,
  extractData,
  setUpData,
  tryParseUnit,
} from './try-parse';
import { RemarkNode } from '../../core/nodes';

const firstInChain = <Units extends string, NodeType extends RemarkNode>(
  units: (Units | [Units, boolean])[],
) =>
  flow(
    setUpData<Units, NodeType>,
    (setup) =>
      units
        // eslint-disable-next-line array-callback-return
        .map((value) => {
          if (
            typeof value !== 'string' &&
            Array.isArray(value) &&
            value.length === 2
          ) {
            if (value[1]) return value[0];
          } else return value;
        })
        .filter((value) => value !== undefined)
        .map((unit) => tryParseUnit<Units, NodeType>(unit as Units))
        .reduce(
          (result, parse) =>
            parse(result) as RecursiveTryParse<Units, NodeType>,
          setup,
        ),
    extractData<Units, NodeType>,
  );

export default firstInChain;
