export default <D>(base: D) =>
  (full: Partial<D>) => ({ ...base, ...full });
