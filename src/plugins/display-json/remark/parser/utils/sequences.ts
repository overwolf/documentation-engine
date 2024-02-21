import { constVoid, flow } from 'fp-ts/lib/function';
import * as E from 'fp-ts/lib/Either';
import { PD } from '../data';
import { Content } from '../parser';
import { failReason } from '../../../../_base/remark/fp-ts/fail-parse';
import syntaxContent from '../../../../_base/fp-ts/syntax-content';
import { EscapedSyntax } from '../../../../_base/remark/escaping/sequence';
import escapedContent from '../../../../_base/fp-ts/escaped-content';
import { FailureReason } from '../../../../_base/remark/parsing/sub-parsers/sub-parser';

export type SequenceParseData = {
  lastContent: string;
};

export const DoesSequenceMatch = <Data extends SequenceParseData>(
  testing: boolean,
  matcher: RegExp,
) => SequenceFromPredicate<Data>(testing, (content) => matcher.test(content));

export const IsSequenceIn = <Data extends SequenceParseData>(
  testing: boolean,
  sequences: string[],
) =>
  SequenceFromPredicate<Data>(testing, (content) =>
    sequences.includes(content),
  );

const SequenceFromPredicate = <Data extends SequenceParseData>(
  testing: boolean,
  predicate: (sequence: string) => boolean,
) =>
  flow(
    E.fromPredicate(
      flow(
        (data: PD<Data>) => data.parser.current(),
        E.chain(syntaxContent(EscapedSyntax.Literal)),
        E.map(predicate),
        E.getOrElse(() => false),
      ),
      (data: PD<Data>) =>
        failReason(
          !testing,
          // eslint-disable-next-line prettier/prettier
          `Evaluated string \`${data.parser._dangerousCurrent()
          }\` did not match the given predicate!`,
        ),
    ),
    E.map((current: PD<Data>) => {
      E.fold(
        constVoid,
        (val: Content) => (current.layerData.lastContent = escapedContent(val)),
      )(current.parser.consumeOne());
      return current;
    }),
  ) as (data: PD<Data>) => E.Either<FailureReason, PD<Data>>;
