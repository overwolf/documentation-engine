import { flow } from 'fp-ts/lib/function';
import { DisplayJSONUnits } from '../../../core/units';
import * as E from 'fp-ts/lib/Either';
import { PD } from '../data';
import ignoreIncorrect from '../../../../_base/remark/fp-ts/ignore-incorrect';
import { DJNB } from '../../../core/node';
import { DJPU } from '../../../core/parse-unit';

export type HasGenericData = {
  generic: DJNB<DisplayJSONUnits._generic>;
};

export default (data: PD<HasGenericData>) =>
  flow(
    DJPU(DisplayJSONUnits._generic),
    E.map((generic) => {
      data.layerData.generic = generic;
      return data;
    }),
    ignoreIncorrect(data),
  )(data);
