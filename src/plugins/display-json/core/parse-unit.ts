import parseUnit from '../../_base/remark/fp-ts/parse-unit';
import { DJNB } from './node';
import { DisplayJSONUnits } from './units';

export const DJPU = <
  Unit extends DisplayJSONUnits,
  ParentConfig extends { [key: string]: any },
>(
  unit: Unit,
  parentConfig?: ParentConfig,
) =>
  parseUnit<Unit, ParentConfig, DJNB<Unit>, any>(unit, {
    parentConfig: parentConfig ? () => parentConfig : undefined,
  });
