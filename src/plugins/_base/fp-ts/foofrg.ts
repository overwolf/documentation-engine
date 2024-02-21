import { flow } from 'fp-ts/lib/function';
import * as E from 'fp-ts/Either';
import useValue from './use-value';
import chainLeft from './chain-left';

/**
 * First Occurance of First Regex Group in string
 *
 * @param r
 * @param l
 * @param s
 */
export default (r: RegExp, s = 0) => {
  r = new RegExp(r, 'g');
  return flow(
    (c: string) => c.substring(s),
    useValue((c: string) =>
      flow(
        tryExec(r),
        E.map((match) => s + match.index + match[1].length),
        E.mapLeft(
          () => `No closing tag found for current line after index: ${s}!
            Looking for: ${r}
            In line: ${c}`,
        ),
      ),
    ),
  );
};

const tryExec = (
  r: RegExp,
): ((c: string) => E.Either<string, RegExpExecArray>) =>
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useValue((c: string) =>
    flow(
      (content) => r.exec(content),
      E.fromPredicate(
        (match) => !!match,
        () => '',
      ) as (data: RegExpMatchArray | null) => E.Either<string, RegExpExecArray>,
      E.chain(
        flow(
          E.fromPredicate(
            (match) => !!match[1],

            () => c,
          ),
          chainLeft(tryExec(r)),
        ),
      ),
    ),
  );
