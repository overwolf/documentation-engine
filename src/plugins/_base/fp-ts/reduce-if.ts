/* eslint-disable react-hooks/rules-of-hooks */
import * as E from 'fp-ts/Either';
import { flow } from 'fp-ts/lib/function';
import edit from './edit';
import chainLeft from './chain-left';
import useValue from './use-value';

const reduceIf = <C, R>(
  a: C[],
  f: (a: C[]) => (c: C) => E.Either<string, R>,
  n: () => E.Either<string, C>,
): (() => E.Either<string, R>) =>
  flow(
    n,
    E.chain(
      useValue((c: C) =>
        flow(
          f(a),
          chainLeft(
            flow(
              edit(() => a.push(c)),
              reduceIf(a, f, n),
            ),
          ),
        ),
      ),
    ),
  );

export default reduceIf;
