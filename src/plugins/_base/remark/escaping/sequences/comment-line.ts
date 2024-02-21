import { flow } from 'fp-ts/lib/function';
import { EscapedSyntax, SequenceHandler, StringToLiteral } from '../sequence';
import * as E from 'fp-ts/Either';
import ContentHandlerEscaped from '../content-handler';

const sequence = '//';

export default {
  start: sequence,
  handleEscape:
    (startIndex: number) => (content: ContentHandlerEscaped<EscapedSyntax>) => {
      const start = content.currentIndex();
      return flow(
        () => content.current(),
        E.map(content.contentAsString),
        // eslint-disable-next-line array-callback-return
        E.map((current) => {
          content.splice(
            start,
            1,
            false,
            StringToLiteral(current.substring(0, startIndex)),
            {
              content: current.substring(startIndex + sequence.length).trim(),
              start: sequence,
              syntax: EscapedSyntax.Comment,
              end: undefined,
            },
          );
        }),
      )();
    },
} as SequenceHandler<EscapedSyntax, typeof sequence>;
