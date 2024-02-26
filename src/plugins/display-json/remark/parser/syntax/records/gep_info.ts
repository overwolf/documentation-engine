import { DisplayJSONUnits } from '../../../../core/units';
import PrefixedArrow from '../../utils/prefix-arrow';

// eslint-disable-next-line prettier/prettier
export default class GEPInfoSubParser extends PrefixedArrow<
  DisplayJSONUnits._r_gep_info,
  DisplayJSONUnits._name_literal,
  DisplayJSONUnits._value
> {
  constructor() {
    super(
      'gep_info',
      DisplayJSONUnits._r_gep_info,
      DisplayJSONUnits._name_literal,
      DisplayJSONUnits._value,
    );
  }
}
