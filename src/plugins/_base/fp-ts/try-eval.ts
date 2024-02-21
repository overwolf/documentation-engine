import * as E from 'fp-ts/Either';
import { flow } from 'fp-ts/lib/function';
import biChain from './bi-chain';

export default <L, R, RR>(
  p: (d: R) => E.Either<L, RR>,
  c: (d: R, p: E.Either<L, RR>) => E.Either<L, E.Either<R, RR>>,
) =>
  E.chain(
    biChain<RR, R, E.Either<L, E.Either<R, RR>>>(flow(E.right, E.right), (d) =>
      flow(p, (e) => c(d, e))(d),
    ),
  ) as (e: E.Either<L, E.Either<R, RR>>) => E.Either<L, E.Either<R, RR>>;
