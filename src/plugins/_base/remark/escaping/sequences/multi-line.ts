import { flow } from 'fp-ts/lib/function';
import foofrg from '../../../fp-ts/foofrg';
import {
  EscapedSequence,
  EscapedSyntax,
  SequenceHandler,
  StringToLiteral,
} from '../sequence';
import reduceIf from '../../../fp-ts/reduce-if';
import * as E from 'fp-ts/Either';
import useValue from '../../../fp-ts/use-value';
import edit from '../../../fp-ts/edit';
import { LINE_SEPARATOR } from '../../plugins/plugin-defaults';
import ContentHandlerEscaped from '../content-handler';
import { stringToRegex } from '../../../utils/string-to-regex';

export default <Syntax extends EscapedSyntax = EscapedSyntax>(
  syntax: Syntax,
  startSequence: string,
  closingSequence = startSequence,
  closingRegex = new RegExp(
    `\\\\\\\\|\\\\${closingSequence}|(${closingSequence})`,
    'g',
  ),
  linePrefix = '',
  indent = 0,
): SequenceHandler<Syntax, typeof startSequence> => ({
  start: startSequence,
  handleEscape:
    (startIndex: number) =>
    (
      content: ContentHandlerEscaped<Syntax>,
      a: string[] = [],
      multiLine = false,
    ) =>
      flow(
        reduceIf<string, number>(
          a,
          () => {
            multiLine = a.length !== 0;
            return foofrg(
              closingRegex,
              !multiLine ? startIndex + startSequence.length : 0,
            );
          },
          flow(
            () => content.consumeOne(),
            E.map((s) => content.contentAsString(s)),
          ),
        ),
        E.chain(
          // eslint-disable-next-line react-hooks/rules-of-hooks
          useValue((lastIndex) =>
            flow(
              () => {
                if (multiLine) a.push('');
                return a.join(LINE_SEPARATOR);
              },
              edit(
                (total) =>
                  (lastIndex += total.length ? total.length - startIndex : 0),
              ),
              useValue((total) =>
                flow(
                  () => {
                    content.unshiftIndex();
                    return content.current();
                  },
                  // eslint-disable-next-line array-callback-return
                  E.map((current) => {
                    total += content.contentAsString(current);
                    const upToCount = Math.max(a.length - 1, 0);
                    const deleteCount = upToCount + 1;
                    // Everything UP TO the first index of the start sequence
                    const upTo = total.substring(0, startIndex - 1);
                    // Everything BETWEEN the start/end sequences
                    const sequence = total.substring(
                      startIndex + startSequence.length,
                      lastIndex - closingSequence.length,
                    );
                    const from = total.substring(lastIndex);
                    content.splice(
                      content.currentIndex() - upToCount,
                      deleteCount,
                      true,
                      StringToLiteral(upTo) as EscapedSequence<
                        Syntax,
                        typeof startSequence
                      >,
                      {
                        content: sequence
                          .split(LINE_SEPARATOR)
                          .map((value) => value.trim())
                          .filter((value) => !!value)
                          .map((value) =>
                            linePrefix
                              ? value.replace(
                                  new RegExp(
                                    `\\s*${stringToRegex(
                                      linePrefix.trim(),
                                    )}\\s*`,
                                    'g',
                                  ),
                                  '',
                                )
                              : value,
                          )
                          .join(LINE_SEPARATOR),
                        start: startSequence.trim(),
                        syntax,
                        linePrefix,
                        indent,
                        end: closingSequence.trim(),
                      },
                      StringToLiteral(from) as EscapedSequence<
                        Syntax,
                        typeof startSequence
                      >,
                    );
                  }),
                ),
              ),
            ),
          ),
        ),
      )(),
});
