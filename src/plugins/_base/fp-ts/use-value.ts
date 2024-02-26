export default <D, R>(f: (d: D) => (d: D) => R) =>
  (d: D) =>
    f(d)(d);
