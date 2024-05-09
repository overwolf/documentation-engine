import merge, { mergeWithCustomize } from 'webpack-merge';

export const deleteFlag = '_DELETE_VALUE_';
export const clearArrayFlag = '_CLEAR_PREVIOUS_ARRAY_';

const isPluginsConfig = (cell: any) => {
  return (
    Array.isArray(cell) &&
    typeof cell !== 'string' &&
    cell.length === 2 &&
    typeof cell[0] === 'string' &&
    typeof cell[1] === 'object'
  );
};

const clean = (target: any) => {
  if (target === deleteFlag) return undefined;
  if (target === null) return target;
  if (Array.isArray(target) && typeof target !== 'string') {
    const clearUpTo = target.lastIndexOf(clearArrayFlag);
    if (clearUpTo !== -1) target = target.slice(clearUpTo + 1);
    return target
      .map((cell: any) => clean(cell))
      .filter((val: any) => val !== undefined);
  }

  if (typeof target === 'object')
    return Object.keys(target).reduce((newTarget, key) => {
      const newValue = clean(target[key]);
      if (newValue !== undefined) newTarget[key] = newValue;
      return newTarget;
    }, {} as { [key: string]: any });
  return target;
};

export default (initialTarget: any, ...targets: any[]) =>
  clean(
    mergeWithCustomize({
      customizeArray(a: any[], b: any[]) {
        const mergedA = [...a];
        const remainingB = [...b];
        let deletedB = 0;
        b.forEach((cell, index) => {
          if (isPluginsConfig(cell)) {
            const aIndex = mergedA.findIndex(
              (aCell) => isPluginsConfig(aCell) && aCell[0] === cell[0],
            );
            if (aIndex !== -1) {
              mergedA[aIndex] = [
                cell[0],
                merge(mergedA[aIndex][1], cell[1]),
                deleteFlag,
              ];
              remainingB.splice(index - deletedB++, 1);
            }
          }
        });
        return [...mergedA, ...remainingB];
      },
    })(initialTarget, ...targets),
  );
