import edit from './edit';

export default <Value, Transformed>(
  source: { [key: string]: Value },
  transformer: (oldKey: string, value: Value) => Transformed,
  transformKey: (key: string) => string,
) =>
  Object.keys(source).reduce(
    (accum, oldKey) =>
      edit(
        (a: { [key: string]: Transformed }) =>
          (a[transformKey(oldKey)] = transformer(oldKey, source[oldKey])),
      )(accum),
    {},
  );
