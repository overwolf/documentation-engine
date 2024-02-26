import { flow } from 'fp-ts/lib/function';
import { Content } from '../parser/parser';
import * as E from 'fp-ts/Either';
import {
  EscapedSyntax,
  StringToLiteral,
} from '../../../_base/remark/escaping/sequence';
import useValue from '../../../_base/fp-ts/use-value';
import syntaxContent from '../../../_base/fp-ts/syntax-content';

export default (condition: string | RegExp, omitMatch = false) =>
  (content: Content[]): Content[] =>
    content.flatMap(
      (c: Content): Content[] =>
        flow(
          syntaxContent(EscapedSyntax.Literal),
          E.chain(
            flow(
              useValue((s: string) =>
                flow(
                  () =>
                    [
                      ...s.matchAll(new RegExp(condition, 'g')),
                    ] as RegExpExecArray[],
                  E.fromPredicate(
                    (matches) => !!matches.length,
                    () => s,
                  ),
                  E.map((matches) =>
                    matches
                      .flatMap((match, index, arr) => [
                        s.substring(
                          index === 0
                            ? 0
                            : arr[index - 1].index + arr[index - 1][0].length,
                          match.index,
                        ),
                        !omitMatch &&
                          s.substring(
                            match.index,
                            match.index + match[0].length,
                          ),
                        arr.length - 1 !== index
                          ? ''
                          : s.substring(match.index + match[0].length),
                      ])
                      .flatMap((content) =>
                        content ? StringToLiteral(content) : [],
                      ),
                  ),
                ),
              ),
            ),
          ),
          (either) => (E.isRight(either) ? either.right : [c]),
        )(c) as Content[],
    );
