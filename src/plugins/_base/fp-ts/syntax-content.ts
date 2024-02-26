import * as E from 'fp-ts/Either';
import { flow } from 'fp-ts/lib/function';
import { EscapedSequence, EscapedSyntax } from '../remark/escaping/sequence';
import escapedContent from './escaped-content';

export default (syntax: EscapedSyntax) =>
  flow(
    E.fromPredicate<EscapedSequence<EscapedSyntax, any>, string>(
      (c) => c.syntax === syntax,
      (c) => `Non ${syntax} content provided as ${syntax}! ${c.content}`,
    ),
    E.map(escapedContent),
  );
