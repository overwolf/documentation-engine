import * as E from 'fp-ts/Either';

export default <L, R, F = L>(f: (l: L) => E.Either<F, R>) =>
  (e: E.Either<L, R>) =>
    E.isLeft(e) ? f(e.left) : e;
