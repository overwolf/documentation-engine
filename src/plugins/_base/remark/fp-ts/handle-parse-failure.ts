import { FailureReason } from '../parsing/sub-parsers/sub-parser';
import * as E from 'fp-ts/lib/Either';
import { failReason } from './fail-parse';

export default <T extends E.Either<FailureReason, any>>(
  correctParser?: boolean,
  reason?: string,
): ((e: T) => T) =>
  // @ts-expect-error Typescript cannot properly parse this type
  E.mapLeft((left) =>
    failReason(left.correctParser ?? correctParser, left.reason ?? reason),
  );
