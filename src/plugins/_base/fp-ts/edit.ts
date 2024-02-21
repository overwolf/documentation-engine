import { flow } from 'fp-ts/lib/function';

export default <D, R = undefined>(f: (d: D) => any, r?: R) =>
  (d: D) =>
    flow(f, () => r ?? d)(d) as R extends undefined ? D : R;
