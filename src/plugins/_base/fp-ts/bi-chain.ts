import * as E from 'fp-ts/Either';

export default <R, L, T>(f: (r: R) => T, g: (l: L) => T) =>
  (e: E.Either<L, R>) =>
    E.isRight(e) ? f(e.right) : g(e.left);
