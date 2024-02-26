export default <D, R>(f: (d: D) => R, b: boolean) =>
  (d: D) =>
    (b ? f(d) : d) as typeof b extends true ? R : D;
