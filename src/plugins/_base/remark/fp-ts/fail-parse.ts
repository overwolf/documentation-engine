import { FailureReason } from '../parsing/sub-parsers/sub-parser';
import * as E from 'fp-ts/lib/Either';

export default (
    correctParser: boolean,
    reason: string,
  ): (() => E.Either<FailureReason, any>) =>
  () =>
    E.left(failReason(correctParser, reason));

export const failReason = (
  correctParser: boolean,
  reason: string,
): FailureReason => ({
  correctParser,
  reason,
});
